import { NextResponse, NextRequest } from "next/server";
import { StatusCodes } from "http-status-codes";
import dbConnect from "@/lib/mongoose";
import User from "@/lib/models/User";
import Product from "@/lib/models/Product";
import Employee from "@/lib/models/Employee";
import Supplier from "@/lib/models/Supplier";
import Department from "@/lib/models/Department";
import Customer from "@/lib/models/Customer";
import Series from "@/lib/models/Series";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import Task from "@/lib/models/Task";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Utility function to upload buffer to Cloudinary
const uploadToCloudinary = (buffer, options) => {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error("Upload timed out after 15s"));
    }, 15000); // safety timeout

    const stream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        clearTimeout(timeout);
        if (error) reject(new Error("Cloudinary upload failed: " + error.message));
        else resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};
// Session validation function

const validateSession = async (session) => {
  console.log("Validating session...");
  if (!session || !session.user || !session.user.id) {
    console.log("Invalid session");
    return {
      valid: false,
      stage: "sv1",
      message: "Unauthorized, please login",
    };
  }

  // Step 2: Find user inside department designations
  const department = await Department.findOne({
    "teams.attachedEmployees.email": session.user.email,
  });
  if (!department) {
    return {
      valid: false,
      stage: "sv1",
      message: "Unauthorized, please login",
    };
  }

  // Step 3: Extract the matching employee
  let matchedEmployee = null;
  let matchedTeam = null;

  for (const team of department.teams) {
    const employee = team.attachedEmployees.find(
      (emp) => emp.email === session.user.email
    );
    if (employee) {
      matchedEmployee = employee;
      matchedTeam = team;
      break;
    }
  }

  console.log("Session validated successfully");
  return {
    valid: true,
    user: {
      ...matchedEmployee,
      team: matchedTeam,
      department: { name: department.name, code: department.code },
    },
  };
};

export async function POST(request) {
  try {
    await dbConnect();

    const contentType = request.headers.get("content-type") || "";
    console.log("Content-Type:", contentType);

    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { status: "fail", message: "Unsupported Content-Type" },
        { status: StatusCodes.UNSUPPORTED_MEDIA_TYPE }
      );
    }

    // Attempt to parse FormData with additional debugging
    let formData;
    try {
      formData = await request.formData();
      console.log("FormData parsed successfully");
    } catch (parseError) {
      console.error("FormData parsing failed:", parseError);
      throw new Error("Failed to parse body as FormData");
    }

    if (contentType.includes("multipart/form-data")) {
      console.log("FormData:", formData);
      const fields = {};
      const files = {};

      // Log raw FormData entries
      const entries = [...formData.entries()];

      for (const [key, value] of entries) {
        console.log(`Processing key: ${key}, value type: ${typeof value}`);
        // Check if value is a file-like object
        if (value && typeof value.arrayBuffer === "function") {
          console.log(`File detected for key: ${key}`, {
            name: value.name,
            type: value.type,
            size: value.size,
          });
          files[key] = {
            name: value.name,
            type: value.type,
            size: value.size,
            buffer: Buffer.from(await value.arrayBuffer()),
          };
        } else {
          console.log(`Field detected for key: ${key}`, value);
          fields[key] = value;
        }
      }

      const {
        route,
        folder,
        session: sessionString,
        resource_type,
        ...rest
      } = fields;

      // Validate route
      if (!route) {
        return NextResponse.json(
          { status: "fail", message: "Route is required" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

      // Validate and parse session
      if (!sessionString) {
        return NextResponse.json(
          { status: "fail", message: "Unauthorized, please login" },
          { status: StatusCodes.UNAUTHORIZED }
        );
      }

      let session;
      try {
        session = JSON.parse(sessionString);
      } catch (error) {
        return NextResponse.json(
          { status: "fail", message: "Invalid session format" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

      const sessionValidation = await validateSession(session);
      // Check session validation
      if (!sessionValidation.valid) {
        return NextResponse.json(
          { status: "fail", message: sessionValidation.message },
          { status: StatusCodes.UNAUTHORIZED }
        );
      }

      console.log("files", files);

      // Validate file
      if (!files.file) {
        return NextResponse.json(
          { status: "fail", message: "No file provided" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

      // Prepare data
      const data = {
        ...rest,
        file: "",
        filePublicId: "",
      };

      console.log(data)

      // Upload file to Cloudinary
      const options = {
        folder: folder,
        resource_type: resource_type || "auto",
      };
      console.log(options)
      const result = await uploadToCloudinary(files.file.buffer, options);
      console.log(result);
      data.file = result.url;
      data.filePublicId = result.public_id;

      if (route === "addTaskFile") {
        const { file, filePublicId } = data;

        console.log(filePublicId);

        // Validate required fields
        if (!file || !filePublicId) {
          return NextResponse.json(
            { status: "fail", message: "Missing required fields" },
            { status: StatusCodes.BAD_REQUEST }
          );
        }

        if (data.type === "comment-audio") {
          const comment = {
            id: Date.now(),
            type: "comment-audio",
            content: {
              audio: {
                file: file,
                filePublicId: filePublicId,
              },
              taskId: data.source,
            },
            tag: [],
            text: "",
            author: sessionValidation.user.name,
            by: {
              name: sessionValidation.user.name,
              employeeCode: sessionValidation.user.employeeCode,
              connectionID: sessionValidation.user.connectionID,
              departmentId: sessionValidation.user.department.code,
              departmentName: sessionValidation.user.department.name,
            },
            timestamp: new Date(),
            avatar: "", // Replace with actual avatar path
          };

  

          //find task by id
          const task = await Task.findById(data.source);
          console.log(task)
          if (!task) {
            return NextResponse.json(
              { status: "fail", message: "Task not found" },
              { status: StatusCodes.BAD_REQUEST }
            );
          }
          console.log(task.data)

          task.data.comments.push(comment);

          //add activity
          const activityEntry = {
            id: Date.now(),
            action: "comment-audio",
            source:'comment',
            time: new Date().toISOString(),
            content: {
              audio: {
                file: file,
                filePublicId: filePublicId,
              },
            },
            by: {
              name: sessionValidation.user.name,
              employeeCode: sessionValidation.user.employeeCode,
              connectionID: sessionValidation.user.connectionID,
              departmentId: sessionValidation.user.department.code,
              departmentName: sessionValidation.user.department.name,
            },
          };
          task.data.activity.push(activityEntry);
          //update unarchive that task when new or any user comment in that 
        for (const key in task.perUserBoardMap) {
          console.log('updating archive',key)
          task.perUserBoardMap[key].archive = false;
      }
      task.markModified("perUserBoardMap");
          task.markModified("data");
          await task.save();
          return NextResponse.json(
            {
              status: "success",
              message: "Product created successfully",
              data: comment,
            },
            { status: StatusCodes.OK }
          );
        }

        if (data.type === "task-attachment") {
          const attachment = {
            file_name: data.file_name,
            id: Date.now(),
            status: "active",
            file: file,
            filePublicId: filePublicId,
            by: {
              name: sessionValidation.user.name,
              employeeCode: sessionValidation.user.employeeCode,
              connectionID: sessionValidation.user.connectionID,
              departmentId: sessionValidation.user.department.code,
              departmentName: sessionValidation.user.department.name,
            },
          };

          //find task by id
          const task = await Task.findById(data.source);
          if (!task) {
            return NextResponse.json(
              { status: "fail", message: "Task not found" },
              { status: StatusCodes.BAD_REQUEST }
            );
          }

          task.files.push(attachment);
          const activityEntry = {
            id: Date.now(),
            action: "task-attachment",
            time: new Date().toISOString(),
            content: {
              attachment: {
                file: file,
                filePublicId: filePublicId,
              },
            },
            by: {
              name: sessionValidation.user.name,
              employeeCode: sessionValidation.user.employeeCode,
              connectionID: sessionValidation.user.connectionID,
              departmentId: sessionValidation.user.department.code,
              departmentName: sessionValidation.user.department.name,
            },
          };
          task.data.activity.push(activityEntry);
          task.markModified("data");
          await task.save();
          return NextResponse.json(
            {
              status: "success",
              message: "Product created successfully",
              data: task,
            },
            { status: StatusCodes.OK }
          );
        }

        
        if (data.type === "comment-image") {
          const comment = {
            id: Date.now(),
            type: "comment-image",
            content: {
              image: {
                file: file,
                filePublicId: filePublicId,
              },
              taskId: data.source,
            },
            tag: [],
            text: "",
            author: sessionValidation.user.name,
            by: {
              name: sessionValidation.user.name,
              employeeCode: sessionValidation.user.employeeCode,
              connectionID: sessionValidation.user.connectionID,
              departmentId: sessionValidation.user.department.code,
              departmentName: sessionValidation.user.department.name,
            },
            timestamp: new Date(),
            avatar: "", // Replace with actual avatar path
          };



          //find task by id
          const task = await Task.findById(data.source);
          if (!task) {
            return NextResponse.json(
              { status: "fail", message: "Task not found" },
              { status: StatusCodes.BAD_REQUEST }
            );
          }

          task.data.comments.push(comment);

          //add activity
          const activityEntry = {
            id: Date.now(),
            action: "comment-image",
            source:'comment',
            time: new Date().toISOString(),
            content: {
              image: {
                file: file,
                filePublicId: filePublicId,
              },
            },
            by: {
              name: sessionValidation.user.name,
              employeeCode: sessionValidation.user.employeeCode,
              connectionID: sessionValidation.user.connectionID,
              departmentId: sessionValidation.user.department.code,
              departmentName: sessionValidation.user.department.name,
            },
          }

          task.data.activity.push(activityEntry);
          //update unarchive that task when new or any user comment in that 
        for (const key in task.perUserBoardMap) {
          console.log('updating archive',key)
          task.perUserBoardMap[key].archive = false;
      }
      task.markModified("perUserBoardMap");
          task.markModified("data");
          await task.save();
          return NextResponse.json(
            {
              status: "success",
              message: "Product created successfully",
              data: comment,
            },
            { status: StatusCodes.OK }
          );
        }
      }

      // If no route is matched
      return NextResponse.json(
        { status: "fail", message: "Invalid route" },
        { status: StatusCodes.INTERNAL_SERVER_ERROR }
      );
    }
    return NextResponse.json(
      { status: "fail", message: "Unsupported Content-Type" },
      { status: StatusCodes.UNSUPPORTED_MEDIA_TYPE }
    );
  } catch (error) {
    console.error("Error in API route:", error);
    // If no route is matched
    return NextResponse.json(
      {
        status: "fail",
        message: error.message || "An error occurred...",
      },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
