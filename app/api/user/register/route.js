import { NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";
import dbConnect from "@/lib/mongoose";
import Department from "@/lib/models/Department";
import User from "@/lib/models/User";
import Series from "@/lib/models/Series";
import { nanoid } from "nanoid";
import { hashPassword } from "@/lib/utils/password";
import { generatCode } from "@/lib/utils/required";

export async function POST(request, response) {
  try {
    //connect database
    await dbConnect();

    let reqBody = await request.json();
    const { name, email, password } = reqBody;
    console.log("data in registration route", reqBody);

    // Step 1: Validate fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { status: "fail", message: "Missing required fields" },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    // Step 2: Check if email is already registered
    const isEmailExist = await User.findOne({ email });
    if (isEmailExist) {
      return NextResponse.json(
        { status: "fail", message: "Email already exists" },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    // Step 3: Hash the password
    const hashedPassword = await hashPassword(password);
    if (!hashedPassword) {
      return NextResponse.json(
        { status: "fail", message: "Failed to hash password" },
        { status: StatusCodes.BAD_REQUEST }
      );
    }


    // Step 4: Restrict to only the first user
    const isFirstAccount = (await User.countDocuments()) === 0;
    if (!isFirstAccount) {
      return NextResponse.json(
        { status: "fail", message: "External registration is disabled" },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    // Step 5: Prepare user data
    reqBody.password = hashedPassword;
    reqBody.userID = 1;
    reqBody.role = "superadmin";
    reqBody.status = "active";

   

    // Step 6: Create initial department
    const departmentObj = {
      name: "admin",
      teams: [
        {
          title: "admin",
          teamID: nanoid(24), 
          attachedEmployees: [
            {
              employeeCode:generatCode(2, 2),
              connectionID: nanoid(24),
              name: "developer", // Consider aligning this with the actual userID/email
              email: "developer@touchtek.net",
              password: hashedPassword,
              status: "active",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      status: "active",
      code: generatCode(3, 2), // Assuming `generateCode` is defined/imported
      series: 1,
    };
    // Step 7: Initialize Series
    await Series.create({ userSeries: 1, department: 1 });

    // Step 8: Create user and department
    const user = await User.create(reqBody);
    const department = await Department.create(departmentObj);

    if (!department) {
      return NextResponse.json(
        {
          status: "fail",
          message: "Failed to create department",
        },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    return NextResponse.json(
      {
        status: "success",
        message: "User registered successfully",
      },
      { status: StatusCodes.OK } // Use http-status-codes here
    );
  } catch (e) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: StatusCodes.INTERNAL_SERVER_ERROR } // Use http-status-codes here
    );
  }
}
