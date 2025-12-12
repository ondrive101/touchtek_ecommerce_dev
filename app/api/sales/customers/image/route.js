import { NextResponse, NextRequest } from "next/server";
import { StatusCodes } from "http-status-codes";
import dbConnect from "@/lib/mongoose";
import User from "@/lib/models/User";
import Product from "@/lib/models/Product";
import Series from "@/lib/models/Series";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import Customer from "@/lib/models/Customer";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Utility function to upload buffer to Cloudinary
const uploadToCloudinary = (buffer, options) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error)
          reject(new Error("Cloudinary upload failed: " + error.message));
        else resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// Session validation function
const validateSession = async (session) => {
  if (!session || !session.user || !session.user.id) {
    return { valid: false, message: "Unauthorized, please login" };
  }

  const user = await User.findOne({ userID: session.user.id });
  if (!user) {
    return { valid: false, message: "Unauthorized, please login" };
  }

  if (user.role !== "sales") {
    return { valid: false, message: "Unauthorized, please login" };
  }

  return { valid: true, user };
};

export async function POST(request) {
  try {
    await dbConnect();
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      // Parse multipart/form-data
      const formData = await request.formData();
      const fields = {};
      const files = {};

      const entries = [...formData.entries()];
      console.log("Raw FormData entries:", entries);

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
      const { route, session: sessionString, ...rest } = fields;

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

      // Validate file
      if (!files.profileImage) {
        return NextResponse.json(
          { status: "fail", message: "No image provided" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

      // Prepare SKU data
      const data = {
        ...rest,
        image: "",
        imagePublicId: "",
      };

      // Upload file to Cloudinary
      const options = { folder: "customer_images" };
      const result = await uploadToCloudinary(files.profileImage.buffer, options);
      data.image = result.url;
      data.imagePublicId = result.public_id;

      console.log("in route", route, sessionValidation, data);

      if (route === "createCustomer") {
        try {
       
      
          const isFirstCustomer = (await Customer.countDocuments()) === 0;
          const series = await Series.findOne();
    
          // create object to upload
          const obj = {
          ...data,
            customerCode: isFirstCustomer ? 1 : series.customerCode + 1,
            status: "active",
            approvals: {
              initial: {
                status: "pending",
                approvedBy: "",
                approvedAt: "",
              },
            },
            createdBy: sessionValidation.user._id,
            createdByName: sessionValidation.user.name,
          };
    
          // create product series or update
          await Series.updateOne({}, { $set: { customerCode: obj.customerCode } });
          const customer = await Customer.create(obj);
    
          if (!customer) {
            return NextResponse.json(
              { status: "fail", message: "unable to create new customer" },
              { status: StatusCodes.BAD_REQUEST }
            );
          }
    
    
          return NextResponse.json(
            {
              status: "success",
              message: "return successfully",
            },
            { status: StatusCodes.OK }
          );
        } catch (e) {
          return NextResponse.json(
            {
              status: "fail",
              message: e.message || "An error occurred...",
            },
            { status: StatusCodes.BAD_REQUEST }
          );
        }
      }



      // only for testing time
      // return NextResponse.json(
      //   {
      //     status: "success",
      //     message: "Product created successfully",
      //   },
      //   { status: StatusCodes.OK }
      // );

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
