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

  const sessionValidation = await validateSession(reqBody.session, "purchase");

  // Check session validation
  if (!sessionValidation.valid) {
    console.log("Invalid session", sessionValidation);
    return NextResponse.json(
      { status: "fail", message: sessionValidation.message },
      { status: StatusCodes.UNAUTHORIZED }
    );
  }
  const user = sessionValidation.user;

  // --orders
  if (reqBody.route === "getProductList") {
    // console.log("Fetching product list...");
    try {
      const List = await Product.find({}).sort({
        createdAt: -1,
      });

      // console.log("Product list fetched successfully:", List.length);

      const list = List.map((product) => {
        // Return the final structured object for the product
        return {
          ...product._doc,
        };
      });

      // console.log("Product list processed successfully:", list.length);

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

  // --orders
  if (reqBody.route === "getSupplierList") {
    // console.log("Fetching suppliers list...");
    try {
      const List = await Supplier.find({}).sort({
        // createdAt: -1,
      });

      // console.log("Suppliers list fetched successfully:", List.length);

      const list = List.map((supplier) => {
        // Return the final structured object for the product
        return {
          ...supplier._doc,
        };
      });

      // console.log("Supplier list processed successfully:", list.length);

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

  if (reqBody.route === "createPurchaseOrder") {
    try {
      const { supplier, items, financialSummary } = reqBody.data;
      // // // Validate required fields
      if (!supplier || !items || !financialSummary) {
        return NextResponse.json(
          { status: "fail", message: "Missing required fields" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

      // Step 4: Set department series
      const isFirstDocument = (await Purchase.countDocuments()) === 0;
      const series = await Series.findOne();
      const purchaseSeries = isFirstDocument ? 1 : (series.purchase || 0) + 1;

      // create object to upload
      const obj = {
        type: "purchase",
        data: {
          ...reqBody.data,
          previousReceipts: [],
          stage: [
            {
              type: "punched",
              status: "completed",
              data: {
                note: "order punched",
              },
              createdBy: {
                departmentId: sessionValidation.user.department.code,
                teamId: sessionValidation.user.team.teamID,
                employeeId: sessionValidation.user.employeeCode,
              },
              date: new Date(),
            },
            {
              type: "verification",
              status: "pending",
              createdBy: "",
              date: "",
            },
          ],
        },
        orderCode: generatCode(3, 3),
        orderSeries: purchaseSeries,
        createdByDepartment: {
          departmentId: sessionValidation.user.department.code,
          teamId: sessionValidation.user.team.teamID,
          employeeId: sessionValidation.user.employeeCode,
        },
        status: "in-progress",
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

      // // create product series or update
      await Series.updateOne({}, { $set: { purchase: purchaseSeries } });
      const order = await Purchase.create(obj);

      if (!order) {
        return NextResponse.json(
          { status: "fail", message: "unable to create new purchase order" },
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

  // --orders
  if (reqBody.route === "getPurchaseOrderList") {
    // console.log("Fetching purchase order list...");
    try {
      const List = await Purchase.find({}).sort({
        // createdAt: -1,
      });

      // console.log("Purchase order list fetched successfully:", List.length);

      const list = List.map((order) => {
        // Return the final structured object for the product
        return {
          ...order._doc,
        };
      });

      // console.log("Purchase order list processed successfully:", list.length);

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

  // --orders
  if (reqBody.route === "deletePurchaseOrder") {
    try {
      // Validate required fields
      if (!reqBody.id) {
        return NextResponse.json(
          { status: "fail", message: "Missing required fields" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

      const order = await Purchase.findById(reqBody.id);
      if (!order) {
        return NextResponse.json(
          { status: "fail", message: "Purchase order not found" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

      
      //update product with quantity received and remove history
      for (const receipt of order.data.previousReceipts) {
        for (const item of receipt.items) {
          const product = await Product.findOne({
            productCode: item.productCode,
          });
          
          if (product) {
            // create a object contains order details and update quantity, price, rate
            const baseData = product.data.find((data) => data.type === "base");
            if (baseData) {
              baseData.quantity -= Number(item.receivedQuantity);
              baseData.amount -=
              Number(item.receivedQuantity) * Number(item.ratePerUnit);
              baseData.rate = baseData.amount / baseData.quantity || 0;
              baseData.history = baseData.history.filter(
                (history) => history.orderId !== order._id.toString()
              );
            }

            product.markModified("data");
            await product.save();
          }
        }
      }
      await order.deleteOne();

      return NextResponse.json(
        {
          status: "success",
          message: "deleted successfully",
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

  // --orders
  if (reqBody.route === "deletePurchaseReceipt") {
    try {
      // Validate required fields
      if (!reqBody.data) {
        return NextResponse.json(
          { status: "fail", message: "Missing required fields" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

      const order = await Purchase.findById(reqBody.data.orderId);
      if (!order) {
        return NextResponse.json(
          { status: "fail", message: "Purchase order not found" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

      const receipt = order.data.previousReceipts.find(
        (receipt) => receipt.receiptID === reqBody.data.receiptId
      );
      if (!receipt) {
        return NextResponse.json(
          { status: "fail", message: "Receipt not found" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

      order.data.previousReceipts = order.data.previousReceipts.filter(
        (receipt) => receipt.receiptID !== reqBody.data.receiptId
      );

      if (order.data.previousReceipts.length === 0) {
        order.status = "in-progress";
      }

      //update product with quantity received and remove history
      for (const item of receipt.items) {
        const product = await Product.findOne({
          productCode: item.productCode,
        });

        if (product) {
          // create a object contains order details and update quantity, price, rate
          const baseData = product.data.find((data) => data.type === "base");
          if (baseData) {
            baseData.quantity -= Number(item.receivedQuantity);
            baseData.amount -=
              Number(item.receivedQuantity) * Number(item.ratePerUnit);
            baseData.rate = baseData.amount / baseData.quantity || 0;
            baseData.history = baseData.history.filter(
              (history) => history.data.receiptID !== receipt.receiptID
            );
          }

          product.markModified("data");
          await product.save();
        }
      }

      order.markModified("data.previousReceipts");
      await order.save();

      return NextResponse.json(
        {
          status: "success",
          message: "deleted successfully",
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

  if (reqBody.route === "confirmPurchaseOrder") {
    try {
      const { items, financialSummary } = reqBody.data;
      // // // Validate required fields
      if (!items || !financialSummary) {
        return NextResponse.json(
          { status: "fail", message: "Missing required fields" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

      const order = await Purchase.findById(reqBody.data.orderId);
      if (!order) {
        return NextResponse.json(
          { status: "fail", message: "Purchase order not found" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }
      const receiptObj = {
        ...reqBody.data,
        receiptID: generatCode(4, 3),
      };

      const receiptSummary = reqBody.data.receiptSummary;
      if (
        receiptSummary.overallPercentComplete > 0 &&
        receiptSummary.overallPercentComplete < 100
      ) {
        order.status = "partial";
      }
      if (receiptSummary.overallPercentComplete === 100) {
        order.status = "completed";


           const stage = order.data.stage.find(
                (stage) => stage.type === "verification"
              );
              if (!stage) {
                return NextResponse.json(
                  { status: "fail", message: "Stage not found" },
                  { status: StatusCodes.NOT_FOUND }
                );
              }

              stage.status = "completed";
              stage.data = {
                note: "order verified",
              };
              stage.createdBy = {
                departmentId: sessionValidation.user.department.code,
                teamId: sessionValidation.user.team.teamID,
                employeeId: sessionValidation.user.employeeCode,
              };
              stage.date = new Date();

      }

      // puss the object in order.data
      order.data.previousReceipts.push(receiptObj);
      order.markModified("data.previousReceipts");
      order.markModified("data.stage");
      await order.save();

      //update product with quantity received
      for (const item of items) {
        const product = await Product.findOne({
          productCode: item.productCode,
        });
        if (product) {
          // create a object contains order details and update quantity, price, rate
          //first find is there any object with type base
          const baseData = product.data.find((data) => data.type === "base");
          if (baseData) {
            baseData.quantity += Number(item.receivedQuantity);
            baseData.amount +=
              Number(item.receivedQuantity) * Number(item.ratePerUnit);
            baseData.rate = baseData.amount / baseData.quantity;
            baseData.history.push({
              type: order.type,
              data: {
                orderId: order._id.toString(),
                receiptID: receiptObj.receiptID,
              },
              effect: "+", // Purchase increases stock
              effectQuantity: Number(item.receivedQuantity),
              effectAmount:
                Number(item.receivedQuantity) * Number(item.ratePerUnit),
            });
          } else {
            product.data.push({
              type: "base",
              quantity: Number(item.receivedQuantity),
              amount: Number(item.receivedQuantity) * Number(item.ratePerUnit),
              rate: Number(item.ratePerUnit),
              history: [
                {
                  type: order.type,
                  data: {
                    orderId: order._id.toString(),
                    receiptID: receiptObj.receiptID,
                  },
                  effect: "+", // Purchase increases stock
                  effectQuantity: Number(item.receivedQuantity),
                  effectAmount:
                    Number(item.receivedQuantity) * Number(item.ratePerUnit),
                },
              ],
            });
          }

          product.markModified("data");
          await product.save();
        }
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

  // If no route is matched
  return NextResponse.json(
    {
      status: "fail",
      message: "Invalid route",
    },
    { status: StatusCodes.INTERNAL_SERVER_ERROR }
  );
}
