import { NextResponse, NextRequest } from "next/server";
import { StatusCodes } from "http-status-codes";
import dbConnect from "@/lib/mongoose";
import User from "@/lib/models/User";
import Series from "@/lib/models/Series";
import Customer from "@/lib/models/Customer";

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
  if (user.role !== "sales") {
    return NextResponse.json(
      {
        status: "fail",
        message: "Unauthorized, please login",
      },
      { status: StatusCodes.UNAUTHORIZED }
    );
  }

  if (reqBody.route === "createCustomer") {
    try {
   
  
      const isFirstCustomer = (await Customer.countDocuments()) === 0;
      const series = await Series.findOne();

      // create object to upload
      const obj = {
      ...reqBody.data,
        customerCode: isFirstCustomer ? 1 : series.customerCode + 1,
        status: "active",
        approvals: {
          initial: {
            status: "pending",
            approvedBy: "",
            approvedAt: "",
          },
        },
        createdBy: user._id,
        createdByName: user.name,
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

  if (reqBody.route === "getCustomerList") {
    try {
      const List = await Customer.find({}).sort({
        createdAt: -1,
      });

     
      const list = List.map((item) => {
        return {
          ...item._doc,
        };
      });


      return NextResponse.json({
        status: "success",
        message: "return successfully",
        data: list,
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

  if (reqBody.route === "getCustomerById") {
    try {
      const customer = await Customer.findOne({ _id: reqBody.id });


      
      if (!customer) {
        return NextResponse.json(
          {
            status: "fail",
            message: "Customer not found",
          },
          { status: StatusCodes.NOT_FOUND }
        );
      }




      return NextResponse.json({
        status: "success",
        message: "return successfully",
        data: {customer},
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

  if (reqBody.route === "deleteCustomer") {
    try {
      const removeCustomer = await Customer.findByIdAndDelete(reqBody.id);
      if (!removeCustomer) {
        return NextResponse.json(
          {
            status: "fail",
            message: "customer not found",
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



    // If no route is matched
    return NextResponse.json(
      {
        status: "fail",
        message: "Invalid route",
      },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );


}
