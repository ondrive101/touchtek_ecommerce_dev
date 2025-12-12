import { NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";
import dbConnect from "@/lib/mongoose";
import User from "@/lib/models/User";
import avatar3 from "@/public/images/avatar/avatar-6.jpg";
import Employee from "@/lib/models/Employee";
import Department from "@/lib/models/Department";
import { comparePassword } from "@/lib/utils/password";

export async function POST(request, response) {
  try {
    //connect database
    await dbConnect();

    let reqBody = await request.json();
    const { email, password } = reqBody;

    // Step 1: Validate input
    if (!email || !password) {
      return NextResponse.json(
        { status: "fail", message: "Missing email or password" },
        { status: StatusCodes.BAD_REQUEST }
      );
    }
console.log('email',email)
const employeeList = await Employee.find({})
console.log('employeeList',employeeList)
    const employeeData = await Employee.findOne({
      $or: [
        { officialEmail: email },
        { employeeCode: email },
        { "data.departmentEmail": email },
      ],
    });

    const userData = await User.findOne({
      email: email,
    });

    console.log('userData',userData)
    console.log('employeeData',employeeData)

    if (!employeeData && !userData) {
      return NextResponse.json(
        { status: "fail", message: "Invalid email or password" },
        { status: StatusCodes.UNAUTHORIZED }
      );
    }
    // Determine the search base (employeeCode or email)
    const isEmployee = !!employeeData;
    const identifier = isEmployee ? employeeData.employeeCode : userData.email;

    // Find department
    const department = await Department.findOne({
      [`teams.attachedEmployees.${isEmployee ? "employeeCode" : "email"}`]:
        identifier,
    });

    if (!department) {
      return NextResponse.json(
        { status: "fail", message: "Invalid email or password" },
        { status: StatusCodes.UNAUTHORIZED }
      );
    }

    // Step 3: Extract the matching employee
    let matchedEmployee = null;
    let matchedTeam = null;

    for (const team of department.teams) {
      const emp = team.attachedEmployees.find((e) =>
        isEmployee
          ? e.employeeCode === employeeData.employeeCode
          : e.email === userData.email
      );

      if (emp) {
        matchedEmployee = emp;
        matchedTeam = team.title;
        break;
      }
    }

    if (!matchedEmployee) {
      return NextResponse.json(
        { status: "fail", message: "Invalid email or password" },
        { status: StatusCodes.UNAUTHORIZED }
      );
    }

    // Step 4: Check password
    const isMatch = await comparePassword(password, matchedEmployee.password);
    if (!isMatch) {
      return NextResponse.json(
        { status: "fail", message: "Invalid email or password" },
        { status: StatusCodes.UNAUTHORIZED }
      );
    }

    //check user status
    if (matchedEmployee.status === "inactive") {
      return NextResponse.json(
        { message: "Your account is inactive" },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    return NextResponse.json(
      {
        message: "okay",
        user: {
          id: matchedEmployee.employeeCode,
          name: matchedEmployee.name,
          email: matchedEmployee.email,
          connectionID: matchedEmployee.connectionID,
          image: employeeData?.image === "" ? avatar3:employeeData?.image,
          team: matchedTeam,
          department: department.name,
        },
      },
      { status: StatusCodes.OK } // Use http-status-codes here
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: StatusCodes.INTERNAL_SERVER_ERROR } // Use http-status-codes here
    );
  }
}
