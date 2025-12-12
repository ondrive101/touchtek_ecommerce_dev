import { NextResponse, NextRequest } from "next/server";
import { StatusCodes } from "http-status-codes";
import dbConnect from "@/lib/mongoose";
import dayjs from "dayjs";
import TaskGroup from "@/lib/models/TaskGroup";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { comparePassword } from "@/lib/utils/password";
dayjs.extend(isSameOrBefore);
import User from "@/lib/models/User";
import Product from "@/lib/models/Product";
import StickyNote from "@/lib/models/StickyNote";
import Supplier from "@/lib/models/Supplier";
import { hashPassword } from "@/lib/utils/password";
import { generatCode } from "@/lib/utils/required";
import Department from "@/lib/models/Department";

import Series from "@/lib/models/Series";
import Purchase from "@/lib/models/Purchase";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { nanoid } from "nanoid";
import streamifier from "streamifier";
import Sales from "@/lib/models/Sales";
import Customer from "@/lib/models/Customer";
import Employee from "@/lib/models/Employee";
import Task from "@/lib/models/Task";
import {
  processPurchaseOrders,
  processSalesOrders,
  processReturnOrders,
} from "@/app/utils/stockUtils";
import { revalidatePath } from "next/cache";
import TaskProject from "@/lib/models/TaskProject";

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
  await dbConnect();

  let reqBody = await request.json();

  if (!reqBody.session) {
    return NextResponse.json(
      {
        status: "fail",
        message: "Unauthorized, please login",
      },
      { status: StatusCodes.UNAUTHORIZED }
    );
  }

  const sessionValidation = await validateSession(reqBody.session);

  // Check session validation
  if (!sessionValidation.valid) {
    console.log("Invalid session", sessionValidation);
    return NextResponse.json(
      { status: "fail", message: sessionValidation.message },
      { status: StatusCodes.UNAUTHORIZED }
    );
  }
  const user = sessionValidation.user;

  if (reqBody.route === "getEmployeeList") {
    try {
      const List = await Employee.find({}).sort({
        // createdAt: -1,
      });

      return NextResponse.json({
        status: "success",
        message: "return successfully",
        data: List,
      });
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

  if (reqBody.route === "getNotificationMessages") {
    try {
      const employeeList = await Employee.find({}).select("name employeeCode image")
      const projects = await TaskProject.find({}).sort({});
      const groups = await TaskGroup.find({}).sort({});
         

      const today = dayjs().startOf("day");

      // calculation birthday notifications
      const BirthdayEmployee = (daysAhead = 5) => {
        const today = dayjs().startOf("day");
        const endDate = today.add(daysAhead, "day");

        return (
          employeeList?.filter((employee) => {
            const dob = dayjs(employee.dateOfBirth);
            let birthdayThisYear = dayjs(
              `${today.year()}-${dob.format("MM-DD")}`
            );
            if (dob.format("MM-DD") === "02-29" && !dayjs().isLeapYear()) {
              birthdayThisYear = dayjs(`${today.year()}-03-01`);
            }

            return (
              birthdayThisYear.isSame(today, "day") ||
              (birthdayThisYear.isAfter(today, "day") &&
                birthdayThisYear.isSameOrBefore(endDate, "day"))
            );
          }) || []
        );
      };
      const birthdayWishes = BirthdayEmployee(30).map((emp) => {
        const dob = dayjs(emp.dateOfBirth);
        let birthdayThisYear = dayjs(`${today.year()}-${dob.format("MM-DD")}`);
        if (
          dob.format("MM-DD") === "02-29" &&
          !dayjs(`${today.year()}-02-29`).isValid()
        ) {
          birthdayThisYear = dayjs(`${today.year()}-03-01`);
        }

        const daysLeft = birthdayThisYear.diff(today, "day");

        return {
          channel: "birthdays",
          avatar:
            "https://storage.googleapis.com/a1aa/image/f3c9338b-28a9-4910-f132-57b0bcbd2caa.jpg",
          username: emp.name,
          level: 21,
          time: dayjs().format("YYYY-MM-DD HH:mm:ss"),
          message: `🎉 Upcoming Birthday for @${emp.name} in ${daysLeft} day(s)! 🎂`,
        };
      });

      // Only include projects where user is creator or member
      let tasks = await Task.find({}).select(" name boardId frequency projectId createdByDepartment assignedTo tag forwardTo data perUserBoardMap createdAt dueDate priority").lean();
      const userId = sessionValidation.user.employeeCode;

      const filteredTasks = tasks.filter((task) => {
        const isCreator = task.createdByDepartment?.employeeId === userId;
        const isAssignTo = task.assignedTo?.includes(userId);
        const isTagged = task.tag?.includes(userId);
        // const isForwardTo = task.forwardTo.find()

        if (isCreator || isAssignTo || isTagged) return true;

        // Check if user is tagged in any comment
        return task.data?.comments?.some((comment) =>
          (comment.tag || []).some((member) => member?.employeeCode === userId)
        );
      });
      // console.log('filteredTasks', filteredTasks)

      const taskList = filteredTasks.map((task) => {
        const project = projects.find(
          (p) => p._id.toString() === task.projectId
        );
        const group = groups.find((p) => p._id.toString() === project.folderId);
        // console.log('project', project)
        // console.log("processing", task?._id);

        const isCreator = task.createdByDepartment?.employeeId === userId;
        const isAssignTo = task.assignedTo?.includes(userId);
        const isTagged = task.data?.comments?.some((comment) =>
          (comment.tag || []).some((member) => member?.employeeCode === userId)
        );
        const isForwardTo = task.forwardTo?.includes(userId);
        const assignToFull = employeeList.find(
          (emp) => emp.employeeCode === task.assignedTo?.[0]
        );
        const creatorFull = employeeList.find(
          (emp) => emp.employeeCode === task.createdByDepartment?.employeeId
        );

        //add incoming and outgoing title
        if (
          task.assignedTo.some((empCode) => {
            return empCode === userId; //means does not created by user but he is an assigned to user
          }) ||
          task.forwardTo.some((emp) => {
            return emp.to.employeeCode === userId; //means does not created by user but he is an assigned to user
          })
        ) {
          // if current user forward task to other user then show outgoint for current user and incoming for that user
          const isForward = task.forwardTo.find(
            (forwardTo) => forwardTo.by.employeeCode === userId
          );

          if (isForward) {
            task.type = "outgoing";
          } else {
            task.type = "incoming";
          }
        } else {
          task.type = "outgoing";
        }

        const p = task;
        p.project = project;
        p.assignToFull = {
          name: assignToFull?.name,
          employeeCode: assignToFull?.employeeCode,
        };
        p.creatorName = creatorFull?.name;
        p.employeeList = employeeList
        p.group = group;
        p.latestCommentActivity =
          task.data?.activity
            // ?.filter(activity => activity?.source === 'comment')
            ?.sort((a, b) => dayjs(b.time).diff(dayjs(a.time)))?.[0] || null;
        p.user = isCreator
          ? "creator"
          : isAssignTo
          ? "assignTo"
          : isTagged
          ? "tagged"
          : isForwardTo
          ? "forward"
          : "";

        return p;
      });


      // console.log('taskList', taskList)

      // let allTimelineEvents = tasks.flatMap((task) =>
      //   (task.data?.timeline || []).map((event) => ({
      //     ...event,
      //     content: event.content
      //       ? typeof event.content === "string"
      //         ? {
      //             description: event.content,
      //             taskName: task.name,
      //             taskId: task.taskId,
      //           }
      //         : { ...event.content, taskName: task.name, taskId: task.taskId }
      //       : { taskName: task.name, taskId: task.taskId },
      //   }))
      // );

      //prepare all events in defined Format
      // let allTaskEvents = allTimelineEvents.map((event) => {
      //   return {
      //     channel: "tasks",
      //     avatar:
      //       "https://storage.googleapis.com/a1aa/image/f3c9338b-28a9-4910-f132-57b0bcbd2caa.jpg",
      //     username: event.by.name,
      //     level: 21,
      //     time: dayjs(event.time).format("YYYY-MM-DD HH:mm:ss"),
      //     message: { ...event.content, action: event.action },
      //   };
      // });

      const payload = [];

      if (reqBody.data === "tasks") {
        payload.push(...taskList);
      }

      // if (reqBody.data === "birthdays") {
      //   payload.push(...birthdayWishes);
      // }

      return NextResponse.json({
        status: "success",
        message: "return successfully",
        data: payload,
      });
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

  if (reqBody.route === "getUserProfile") {
    try {
      const employee = await Employee.findOne({
        employeeCode: user.employeeCode,
      });

      const profile = {
        gender: employee.gender,
        name: employee.name,
        email: employee.email,
        officialEmail: employee.officialEmail,
        image: employee.image,
        department: employee.department,
        address: employee.currentAddress,
        contactNumber: employee.contactNumber,
        dateOfBirth: employee.dateOfBirth,
      };

      return NextResponse.json({
        status: "success",
        message: "return successfully",
        data: profile,
      });
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

  if (reqBody.route === "editProfile") {
    // console.log("payload received", user);
    try {
      if (reqBody.data.type === "profile") {
        const data = reqBody.data.data;

        // Only include defined fields in update
        const updatedFields = {};
        if (data.name !== undefined) updatedFields.name = data.name;
        if (data.email !== undefined) updatedFields.email = data.email;
        if (data.officialEmail !== undefined) updatedFields.officialEmail = data.officialEmail;
        if (data.address !== undefined) updatedFields.currentAddress = data.address;
        if (data.phone !== undefined) updatedFields.contactNumber = data.phone;
        if (data.dob !== undefined) updatedFields.dateOfBirth = data.dob;
        if (data.gender !== undefined) updatedFields.gender = data.gender;
        if (data.currentPassword !== undefined)
          updatedFields.currentPassword = data.currentPassword;
        if (data.newPassword !== undefined)
          updatedFields.newPassword = data.newPassword;
        if (data.confirmNewPassword !== undefined)
          updatedFields.confirmNewPassword = data.confirmNewPassword;

        // Update nested department employee
        if (updatedFields.name || updatedFields.email) {
          const department = await Department.findOne({
            code: user.department.code,
          });
          const team = department?.teams.find(
            (team) => team.teamID === user.team.teamID
          );
          const employee = team?.attachedEmployees.find(
            (emp) => emp.employeeCode === user.employeeCode
          );

          if (employee) {
            if (updatedFields.name) employee.name = updatedFields.name;
            if (updatedFields.currentPassword) {
              console.log('department', department)
              if(department?.name !== 'admin') {
                return NextResponse.json(
                  { status: "fail", message: "You are not authorized to change password!Contact admin" },
                  { status: StatusCodes.UNAUTHORIZED }
                );
              }
              const isMatch = await comparePassword(
                updatedFields.currentPassword,
                employee.password
              );
              if (!isMatch) {
                return NextResponse.json(
                  { status: "fail", message: "Invalid current password" },
                  { status: StatusCodes.UNAUTHORIZED }
                );
              }

              const hashedPassword = await hashPassword(
                updatedFields.newPassword
              );
              if (!hashedPassword) {
                return NextResponse.json(
                  { status: "fail", message: "Failed to hash password" },
                  { status: StatusCodes.BAD_REQUEST }
                );
              }
              employee.password = hashedPassword;
            }

            department.markModified("teams");
            await department.save();
          }

          //update in main
          const updatedEmployee = await Employee.findOneAndUpdate(
            { employeeCode: user.employeeCode },
            { $set: updatedFields },
            { new: true }
          );
          if (!updatedEmployee) throw new Error("Employee not found");
        }
      }

      return NextResponse.json({
        status: "success",
        message: "return successfully",
        // data: profile,
      });
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

  if (reqBody.route === "createStickyNote") {
    // console.log("payload received", reqBody);
    try {
      // validate fields
      if (!reqBody.data.title || !reqBody.data.content || !reqBody.data.color) {
        return NextResponse.json(
          { status: "fail", message: "Title, content and color are required" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

      const payload = {
        title: reqBody.data.title,
        content: reqBody.data.content,
        color: reqBody.data.color,
        createdByDepartment: {
          departmentId: sessionValidation.user.department.code,
          teamId: sessionValidation.user.team.teamID,
          employeeId: sessionValidation.user.employeeCode,
          connectionID: sessionValidation.user.connectionID,
        },
        data: {
          base: "",
        },
        status: "active",
      };
      const stickyNote = await StickyNote.create(payload);
      if (!stickyNote) {
        return NextResponse.json(
          { status: "fail", message: "unable to create new sticky note" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }
      return NextResponse.json({
        status: "success",
        message: "return successfully",
        data: stickyNote,
      });
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

  if (reqBody.route === "getStickyNotes") {
    try {
      // console.log("called getStickyNotes", sessionValidation.user.employeeCode);
  
    const List = await StickyNote.find({
      "createdByDepartment.employeeId": sessionValidation.user.employeeCode,
      status: "active"
    }).sort({
      createdAt: -1,
    });

      // console.log("List", List);

      return NextResponse.json({
        status: "success",
        message: "return successfully",
        data: List,
      });
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

  if (reqBody.route === "updateStickyNote") {
    // console.log("payload received", reqBody);
    try {

      if(reqBody.data.type === "delete"){
        const stickyNote = await StickyNote.findOneAndDelete({
          _id: reqBody.data.data.id,
        });
        if (!stickyNote) {
          return NextResponse.json(
            { status: "fail", message: "Sticky note not found" },
            { status: StatusCodes.BAD_REQUEST }
          );
        }
        return NextResponse.json({
          status: "success",
          message: "Sticky note deleted successfully",
        });
        
      }
      if(reqBody.data.type === "update"){
        const updateData = {};
        if (reqBody.data.data.title !== undefined) updateData.title = reqBody.data.data.title;
        if (reqBody.data.data.content !== undefined) updateData.content = reqBody.data.data.content;
        if (reqBody.data.data.color !== undefined) updateData.color = reqBody.data.data.color;

        const stickyNote = await StickyNote.findOneAndUpdate(
          { _id: reqBody.data.data.id },
          updateData,
          { new: true, runValidators: true }
        );
        if (!stickyNote) {
          return NextResponse.json(
            { status: "fail", message: "Sticky note not found" },
            { status: StatusCodes.BAD_REQUEST }
          );
        }
     

        return NextResponse.json({
          status: "success",
          message: "Sticky note updated successfully",
        });
        
      }
    
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
  // If no route is matched
  return NextResponse.json(
    {
      status: "fail",
      message: "Invalid route",
    },
    { status: StatusCodes.INTERNAL_SERVER_ERROR }
  );
}
