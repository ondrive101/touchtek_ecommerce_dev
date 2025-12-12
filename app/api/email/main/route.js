import { NextResponse, NextRequest } from "next/server";
import { StatusCodes } from "http-status-codes";
import dbConnect from "@/lib/mongoose";
import User from "@/lib/models/User";
import Product from "@/lib/models/Product";
import Supplier from "@/lib/models/Supplier";
import { hashPassword } from "@/lib/utils/password";
import {
  generatCode,
  decrypt,
  encrypt,
  fetchMails,
  deleteMail,
  sendMail,
  moveToTrash,
} from "@/lib/utils/required";
import Department from "@/lib/models/Department";
import Kanban from "@/lib/models/Kanban";
import Series from "@/lib/models/Series";
import mongoose from "mongoose";
// import { mails } from "../data";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { nanoid } from "nanoid";
import streamifier from "streamifier";
import Sales from "@/lib/models/Sales";
import Customer from "@/lib/models/Customer";
import Employee from "@/lib/models/Employee";
import MailSetup from "@/lib/models/MailSetup";
import crypto from "crypto";
import { revalidatePath } from "next/cache";

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
    return NextResponse.json(
      { status: "fail", message: sessionValidation.message },
      { status: StatusCodes.UNAUTHORIZED }
    );
  }
  const user = sessionValidation.user;

  // --get mails
  if (reqBody.route === "getMails") {
    // step 1: get user mail setup
    const mailSetup = await MailSetup.findOne({
      employeeCode: user.employeeCode,
    }).select("username password");

    if (!mailSetup) {
      return NextResponse.json(
        {
          status: "fail",
          message: "Mail setup not found",
        },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    // step 2: decrypt password
    const decryptedPassword = decrypt(mailSetup.password);

    // Step 3: Connect to IMAP
    const imapConfig = {
      user: mailSetup.username,
      password: decryptedPassword,
      host: "mail.touchtek.in", // <-- Replace with your mail server
      port: 993,
      tls: true,
      tlsOptions: { rejectUnauthorized: false },
    };

    try {
      const mails = await fetchMails(imapConfig);


      if (mails.length === 0) {
        return NextResponse.json(
          {
            status: "fail",
            message: "Mails not found",
          },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

      // format each mails
      mails.forEach((mail, index) => {
        mail.starred = false;
        mail.isRead = true;
        mail.category = "primary";
        mail.label = "work";
      });

      return NextResponse.json({
        status: "success",
        message: "return successfully",
        data: mails,
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

  // --get mail setup
  if (reqBody.route === "getMailSetup") {
    try {
      const mailSetup = await MailSetup.findOne({
        employeeCode: user.employeeCode,
      }).select("status");

      return NextResponse.json({
        status: "success",
        message: "return successfully",
        data: {
          isMailSetup: mailSetup ? true : false,
          status: mailSetup?.status || "not setup",
        },
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

  // --save mail setup
  if (reqBody.route === "createMailSetup") {
    try {
      const { email, password } = reqBody.data;

      // step 1 validate fields
      if (!email || !password) {
        return NextResponse.json(
          {
            status: "fail",
            message: "All fields are required",
          },
          { status: StatusCodes.BAD_REQUEST }
        );
      }
      const encryptedPassword = encrypt(password);

      const mailSetup = await MailSetup.findOne({
        employeeCode: user.employeeCode,
      });

      if (mailSetup) {
        return NextResponse.json(
          {
            status: "fail",
            message: "Mail setup already exists",
          },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

      const payload = {
        name: user.name,
        employeeCode: user.employeeCode,
        username: email,
        password: encryptedPassword,
        status: "active",
      };

      const response = await MailSetup.create(payload);

      return NextResponse.json({
        status: "success",
        message: "return successfully",
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

  //delete mail
  if (reqBody.route === "deleteMail") {
    // step 1: get user mail setup
    const mailSetup = await MailSetup.findOne({
      employeeCode: user.employeeCode,
    }).select("username password");

    if (!mailSetup) {
      return NextResponse.json(
        {
          status: "fail",
          message: "Mail setup not found",
        },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    // step 2: decrypt password
    const decryptedPassword = decrypt(mailSetup.password);

    // Step 3: Connect to IMAP
    const imapConfig = {
      user: mailSetup.username,
      password: decryptedPassword,
      host: "mail.touchtek.in", // <-- Replace with your mail server
      port: 993,
      tls: true,
      tlsOptions: { rejectUnauthorized: false },
    };

    try {
      const mail = await moveToTrash(imapConfig, reqBody.id);

      if (mail.status === "success") {
        return NextResponse.json(
          {
            status: "success",
            message: "Mail deleted successfully",
          },
          { status: StatusCodes.OK }
        );
      }
    } catch (error) {
      return NextResponse.json(
        {
          status: "fail",
          message: error.message || "An error occurred...",
        },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    return NextResponse.json({
      status: "success",
      message: "return successfully",
    });
  }


  //reset mail
  if (reqBody.route === "resetMailSetup") {
    try {
      const mailSetup = await MailSetup.findOneAndDelete({
        employeeCode: user.employeeCode,
      });
      return NextResponse.json({
        status: "success",
        message: "Mail setup deleted successfully",
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


    // --send mail
    if (reqBody.route === "sendMail") {
      try {
        const { recipient, subject, content } = reqBody.data;
        
        // step 1: get user mail setup
        const mailSetup = await MailSetup.findOne({
          employeeCode: user.employeeCode,
        }).select("username password");

        if (!mailSetup) {
          return NextResponse.json(
            {
              status: "fail",
              message: "Mail setup not found",
            },
            { status: StatusCodes.BAD_REQUEST }
          );
        }

        // step 2: decrypt password
        const decryptedPassword = decrypt(mailSetup.password);

        // Step 3: Configure SMTP
        const smtpConfig = {
          user: mailSetup.username,
          pass: decryptedPassword,
          host: "mail.touchtek.in", // <-- Replace with your mail server
          port: 587,
        };

        // Prepare mail options with plain text
        const mailOptions = {
          from: mailSetup.username,
          to: recipient,
          subject: subject,
          text: content, // Using plain text content
        };
         
        // Send the email
        const mail = await sendMail(smtpConfig, mailOptions);
        console.log("Email sent result:", mail);

        if (!mail || !mail.success) {
          return NextResponse.json(
            {
              status: "fail",
              message: "Failed to send email",
            },
            { status: StatusCodes.BAD_REQUEST }
          );
        }
        
        return NextResponse.json(
          {
            status: "success",
            message: "Email sent successfully",
          },
          { status: StatusCodes.OK }
        );
       
      } catch (e) {
        console.error("Error sending email:", e);
        return NextResponse.json(
          {
            status: "fail",
            message: e.message || "An error occurred while sending the email",
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
