import { NextResponse, NextRequest } from "next/server";
import { StatusCodes } from "http-status-codes";
import dbConnect from "@/lib/mongoose";
import User from "@/lib/models/User";
import Department from "@/lib/models/Department";
import { hashPassword } from "@/lib/utils/password";
import Series from "@/lib/models/Series";

export async function POST(request, response) {
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
  //destruction session
  const { id } = reqBody.session.user;

  const user = await User.findOne({ userID: id });
  if (!user) {
    return NextResponse.json(
      {
        status: "fail",
        message: "Unauthorized, please login",
      },
      { status: StatusCodes.UNAUTHORIZED }
    );
  }
  if (user.role !== "superadmin") {
    return NextResponse.json(
      {
        status: "fail",
        message: "Unauthorized, please login",
      },
      { status: StatusCodes.UNAUTHORIZED }
    );
  }

  if (reqBody.route === "getUsersList") {
    try {
      const userList = await User.find({}).sort({
        createdAt: -1,
      });

      // // remove some field from userList
      const filteredUserList = userList.map((user) => {
        const { password, ...rest } = user.toObject();
        return rest;
      });

      return NextResponse.json({
        status: "success",
        message: "return successfully",
        data: filteredUserList,
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
  if (reqBody.route === "createUser") {
    try {
      const { name, email, password, role } = reqBody.data;

      // Validate required fields
      if (!name || !email || !password || !role) {
        return NextResponse.json(
          { message: "Missing required fields" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }
      //Check Email Already Register
      const isEmailExist = await User.findOne({ email });
      if (isEmailExist) {
        return NextResponse.json(
          { message: "Email already exist" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

      const hashedPassword = await hashPassword(password);
      if (!hashedPassword) {
        throw new Error("Failed to hash password");
      }
      reqBody.data.password = hashedPassword;

      const series = await Series.findOne();
      reqBody.data.userID = series.userSeries + 1;
      reqBody.data.status = "active";

      await Series.updateOne({}, { $set: { userSeries: reqBody.data.userID } });
      const user = await User.create(reqBody.data);
      if (!user) {
        return NextResponse.json(
          {
            status: "fail",
            message: "Failed to create user",
          },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

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
  if (reqBody.route === "deleteUser") {
    try {
      const removeUser = await User.findByIdAndDelete(reqBody.id);
      if (!removeUser) {
        return NextResponse.json(
          {
            status: "fail",
            message: "user not found",
          },
          { status: StatusCodes.NOT_FOUND }
        );
      }

      return NextResponse.json({
        status: "success",
        message: "deleted successfully",
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
  if (reqBody.route === "editUser") {
    try {
      if (reqBody.data.password) {
        const hashedPassword = await hashPassword(reqBody.data.password);
        if (!hashedPassword) {
          return NextResponse.json(
            {
              status: "fail",
              message: "Failed to hash password",
            },
            { status: StatusCodes.BAD_REQUEST }
          );
        }
        reqBody.data.password = hashedPassword;
      }

      const updated = await User.findOneAndUpdate(
        { _id: reqBody.id },
        { $set: { ...reqBody.data } },
        {
          new: true,
        }
      );
      return NextResponse.json({
        status: "success",
        message: "updated successfully",
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

  if (reqBody.route === "createDepartment") {
    try {
      const { name, code } = reqBody.data;

      // Step 1: Validate required fields
      if (!name || !code) {
        return NextResponse.json(
          { message: "Missing required fields" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }
      // Step 2: Check if department or code already exists
      const [existingByName, existingByCode] = await Promise.all([
        Department.findOne({ name }),
        Department.findOne({ code }),
      ]);

      if (existingByName) {
        return NextResponse.json(
          { status: "fail", message: "Department already exists" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

      if (existingByCode) {
        return NextResponse.json(
          { status: "fail", message: "Department code already exists" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }
      // Step 3: Hash default admin password
      const hashedPassword = await hashPassword("admin123");
      if (!hashedPassword) {
        throw new Error("Failed to hash password");
      }
      // Step 4: Prepare default designation with admin
      const adminEmail = `admin.${reqBody.data.name}@touchtek.net`;
      const designations = [{
        title: "admin",
        attachedEmployees: [{
          userID: "admin",
          email: adminEmail,
          password: hashedPassword,
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date()
        }]
      }];
      reqBody.data.designations = designations;
      reqBody.data.status = "active";
      
      // Step 5: Set department series
      const isFirstDepartment = (await Department.countDocuments()) === 0;
      const series = await Series.findOne();
      const departmentSeries = isFirstDepartment ? 1 : (series.department || 0) + 1;
      reqBody.data.series = departmentSeries;
    
      await Series.updateOne({}, { $set: { department: departmentSeries } });

      // Step 6: Create the department
      const department = await Department.create(reqBody.data);
      if (!department) {
        return NextResponse.json(
          {
            status: "fail",
            message: "Failed to create department",
          },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

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

  // If no route is matched
  return NextResponse.json(
    {
      status: "fail",
      message: "Invalid route",
    },
    { status: StatusCodes.INTERNAL_SERVER_ERROR }
  );
}
