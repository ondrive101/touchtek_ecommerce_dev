import { NextResponse, NextRequest } from "next/server";
import { StatusCodes } from "http-status-codes";
import dbConnect from "@/lib/mongoose";
import User from "@/lib/models/User";
import Product from "@/lib/models/Product";
import { hashPassword } from "@/lib/utils/password";
import { generatCode } from "@/lib/utils/required";
import Department from "@/lib/models/Department";
import Series from "@/lib/models/Series";
import PurchaseOrders from "@/lib/models/PurchaseOrders";
import Purchase from "@/lib/models/Purchase";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { nanoid } from "nanoid";
import streamifier from "streamifier";
import Sales from "@/lib/models/Sales";
import Customer from "@/lib/models/Customer";
import Supplier from "@/lib/models/Supplier";

import Employee from "@/lib/models/Employee";
import {
  processPurchaseOrders,
  processSalesOrders,
  processReturnOrders,
} from "@/app/utils/stockUtils";
import { revalidatePath } from "next/cache";

// Session validation function
const validateSession = async (session, role) => {
  // console.log("Validating session...");
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

  if (department.name !== role && department.name !== "admin") {
    console.log("Role mismatch");
    return {
      valid: false,
      stage: "sv3",
      message: "Unauthorized, please login",
    };
  }

  // console.log("Session validated successfully");
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

  const sessionValidation = await validateSession(reqBody.session, "account");

  // Check session validation
  if (!sessionValidation.valid) {
    console.log("Invalid session", sessionValidation);
    return NextResponse.json(
      { status: "fail", message: sessionValidation.message },
      { status: StatusCodes.UNAUTHORIZED }
    );
  }
  const user = sessionValidation.user;



  if (reqBody.route === "getCustomerList") {
    // console.log("Fetching customers list...");
    try {
      const List = await Customer.find({}).sort({
        createdAt: -1,
      });

      // console.log("Customers list fetched successfully:", List.length);

      const list = List.map((customer) => {
        // Return the final structured object for the product
        return {
          ...customer._doc,
        };
      });

      // console.log("Customer list processed successfully:", list.length);

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
  if (reqBody.route === "getSupplierList") {
    // console.log("Fetching customers list...");
    try {
      const List = await Supplier.find({}).sort({
        createdAt: -1,
      });

      // console.log("Customers list fetched successfully:", List.length);

      const list = List.map((supplier) => {
        // Return the final structured object for the product
        return {
          ...supplier._doc,
        };
      });

      // console.log("Customer list processed successfully:", list.length);

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

  if (reqBody.route === "getCustomerBy_Id") {
    // console.log("Fetching customers list...");
    try {
      const { id } = reqBody;
      const customer = await Customer.findById(id);
  

      // step1: get all sales order related to that customer
      const salesOrders = await Sales.find({ "data.customer.id": id }).sort({
        createdAt: -1,
      });


      // Calculate total order amount
    const totalOrdersAmount = salesOrders.reduce((sum, order) => {
      const grandTotal = order?.data?.financialSummary?.grandTotal || 0;
      return sum + Number(grandTotal);
    }, 0);


    const totalOrdersAverage = totalOrdersAmount / salesOrders.length;

      const payload = {
        customer,
        salesOrders,
        totalOrdersAmount,
        totalOrdersAverage
      };
     
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


  // If no route is matched
  return NextResponse.json(
    {
      status: "fail",
      message: "Invalid route",
    },
    { status: StatusCodes.INTERNAL_SERVER_ERROR }
  );
}
