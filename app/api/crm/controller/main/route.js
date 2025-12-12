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

  const sessionValidation = await validateSession(reqBody.session, "crm");

  // Check session validation
  if (!sessionValidation.valid) {
    console.log("Invalid session", sessionValidation);
    return NextResponse.json(
      { status: "fail", message: sessionValidation.message },
      { status: StatusCodes.UNAUTHORIZED }
    );
  }
  const user = sessionValidation.user;

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
          main: product.data.find((data) => data.type === "base") || {
            quantity: 0,
            amount: 0,
            rate: 0,
          },
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

  if (reqBody.route === "createSalesOrder") {
    try {
      const { customer, items, financialSummary } = reqBody.data;
      // // // Validate required fields
      if (!customer || !items || !financialSummary) {
        return NextResponse.json(
          { status: "fail", message: "Missing required fields" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

      // Step 4: Set department series
      const isFirstDocument = (await Sales.countDocuments()) === 0;
      const series = await Series.findOne();
      const salesSeries = isFirstDocument ? 1 : (series.sales || 0) + 1;

      // create object to upload
      const obj = {
        type: "sales",
        data: {
          ...reqBody.data,
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
        orderSeries: salesSeries,
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
      };

      // // create product series or update
      await Series.updateOne({}, { $set: { sales: salesSeries } });
      const order = await Sales.create(obj);

      if (!order) {
        return NextResponse.json(
          { status: "fail", message: "unable to create new sales order" },
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

  if (reqBody.route === "getSalesOrderList") {
    // console.log("Fetching purchase order list...");
    try {
      const List = await Sales.find({}).sort({
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

  if (reqBody.route === "updateSalesOrderStage") {
    try {
      const { id } = reqBody.data;
      // // // Validate required fields
      if (!id) {
        return NextResponse.json(
          { status: "fail", message: "Missing required fields" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

      const order = await Sales.findById(id);
      if (!order) {
        return NextResponse.json(
          { status: "fail", message: "Order not found" },
          { status: StatusCodes.NOT_FOUND }
        );
      }

      const stage = order.data.stage.find(
        (stage) => stage.type === reqBody.data.type
      );
      if (!stage) {
        return NextResponse.json(
          { status: "fail", message: "Stage not found" },
          { status: StatusCodes.NOT_FOUND }
        );
      }

      stage.status = reqBody.data.status;
      stage.data = {
        note: reqBody.data.note,
      };
      stage.createdBy = {
        departmentId: sessionValidation.user.department.code,
        teamId: sessionValidation.user.team.teamID,
        employeeId: sessionValidation.user.employeeCode,
      };
      stage.date = new Date();

      // add next empty stage for packing stage
      if (reqBody.data.type === "verification") {
        order.data.stage.push({
          type: "packing",
          status: "pending",
          createdBy: "",
          date: "",
        });
      }
      // add next empty stage for delivery stage
      if (reqBody.data.type === "packing") {
        order.data.stage.push({
          type: "delivery",
          status: "pending",
          createdBy: "",
          date: "",
        });
      }

      // add next empty stage for delivery stage
      if (reqBody.data.type === "delivery") {
        order.status = "completed";

        //update product
        //update product with quantity received
        for (const item of order.data.items) {
          const product = await Product.findOne({
            productCode: item.productCode,
          });
          if (product) {
            // create a object contains order details and update quantity, price, rate
            //first find is there any object with type base
            const baseData = product.data.find((data) => data.type === "base");
            if (baseData) {
              baseData.quantity -= Number(item.quantitySelected);
              baseData.amount -=
                Number(item.quantitySelected) * Number(item.ratePerUnit);
              baseData.rate = baseData.amount / baseData.quantity;
              baseData.history.push({
                type: order.type,
                data: {
                  orderId: order._id.toString(),
                },
                effect: "-", // Purchase increases stock
                effectQuantity: Number(item.quantitySelected),
                effectAmount:
                  Number(item.quantitySelected) * Number(item.ratePerUnit),
              });
            }
            product.markModified("data");
            await product.save();
          }
        }
      }

      order.markModified("data");
      await order.save();

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

  if (reqBody.route === "deleteCancelReopenSalesOrder") {
    try {
      const { id, type } = reqBody.data;
      // // // Validate required fields
      if (!id || !type) {
        return NextResponse.json(
          { status: "fail", message: "Missing required fields" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

      const order = await Sales.findById(id);
      if (!order) {
        return NextResponse.json(
          { status: "fail", message: "Order not found" },
          { status: StatusCodes.NOT_FOUND }
        );
      }


      console.log(order)


      if (type === "delete") {
        order.status = "deleted";
      }
      if (type === "cancel") {
        order.status = "rejected";
      }
      if (type === "reopen") {
        order.status = "in-progress";

        const stage = order.data.stage.find(
          (stage) => stage.type === "delivery"
        );
        if (!stage) {
          return NextResponse.json(
            { status: "fail", message: "Stage not found" },
            { status: StatusCodes.NOT_FOUND }
          );
        }

        //again set back to delivery stage
        stage.type = "delivery";
        stage.status = "pending";
        stage.createdBy = "";
        stage.date = "";
        delete stage.data;


        if(order.type === "sales") {

          //update product with quantity received
          for (const item of order.data.items) {
            const product = await Product.findOne({
              productCode: item.productCode,
            });
            if (product) {
              // create a object contains order details and update quantity, price, rate
              //first find is there any object with type base
              const baseData = product.data.find((data) => data.type === "base");
              if (baseData) {
                baseData.quantity += Number(item.quantitySelected);
                baseData.amount +=
                  Number(item.quantitySelected) * Number(item.ratePerUnit);
                baseData.rate = baseData.amount / baseData.quantity;
                baseData.history = baseData.history.filter(
                  (history) => history.data.orderId !== order._id.toString()
                );
              }
              product.markModified("data");
              await product.save();
            }
          }
        }

      }
      order.markModified("data");
      await order.save();

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

  if (reqBody.route === "createSalesReturnOrder") {
    try {
      const { customer, items, financialSummary, orderType, orderNote } =
        reqBody.data;
      // Validate required fields
      if (
        !customer ||
        !items ||
        !financialSummary ||
        !orderType ||
        !orderNote
      ) {
        return NextResponse.json(
          { status: "fail", message: "Missing required fields" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

      // Step 4: Set department series
      const isFirstDocument = (await Sales.countDocuments()) === 0;
      const series = await Series.findOne();
      const salesSeries = isFirstDocument ? 1 : (series.sales || 0) + 1;

      // create object to upload
      const obj = {
        type: "sales-return",
        data: {
          ...reqBody.data,
          stage: [
            {
              type: "punched",
              status: "completed",
              subStages: [],
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
              type: "pickup",
              subStages: [
                {
                  type: "pickup-initiated",
                  status: "pending",
                  createdBy: "",
                  date: "",
                },
              ],
              status: "pending",
              createdBy: "",
              date: "",
            },
          ],
        },
        orderCode: generatCode(3, 3),
        orderSeries: salesSeries,
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
      };

      // // create product series or update
      await Series.updateOne({}, { $set: { sales: salesSeries } });
      const order = await Sales.create(obj);

      if (!order) {
        return NextResponse.json(
          { status: "fail", message: "unable to create new sales order" },
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

  if (reqBody.route === "updateSalesReturnOrderStage") {
    try {
      const { id, isSubStage } = reqBody.data;
      // // // Validate required fields
      if (!id) {
        return NextResponse.json(
          { status: "fail", message: "Missing required fields" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

      const order = await Sales.findById(id);
      if (!order) {
        return NextResponse.json(
          { status: "fail", message: "Order not found" },
          { status: StatusCodes.NOT_FOUND }
        );
      }

     

      let stage;
      let mainStage;

      if (isSubStage) {
        mainStage = order.data.stage.find(
          (stage) => stage.type === reqBody.data.main
        );

        stage = mainStage.subStages.find(
          (subStage) => subStage.type === reqBody.data.type
        );
      } else {
        stage = order.data.stage.find(
          (stage) => stage.type === reqBody.data.type
        );
      }

      if (!stage) {
        return NextResponse.json(
          { status: "fail", message: "Stage not found" },
          { status: StatusCodes.NOT_FOUND }
        );
      }

      stage.status = reqBody.data.status;
      stage.data = reqBody.data.data;
      stage.createdBy = {
        departmentId: sessionValidation.user.department.code,
        teamId: sessionValidation.user.team.teamID,
        employeeId: sessionValidation.user.employeeCode,
      };
      stage.date = new Date();

      // add next empty stage for pickup-initiated stage
      if (reqBody.data.type === "pickup-initiated") {
        mainStage.subStages.push({
          type: "pickup-received",
          status: "pending",
          createdBy: "",
          date: "",
        });
      }

      // add next empty stage for pickup-initiated stage
      if (reqBody.data.type === "pickup-received") {
        //update main stage status  "pickup"
        mainStage.status = "completed";
        mainStage.data = {
          note: "order picked up",
        };
        mainStage.createdBy = {
          departmentId: sessionValidation.user.department.code,
          teamId: sessionValidation.user.team.teamID,
          employeeId: sessionValidation.user.employeeCode,
        };
        mainStage.date = new Date();

        //add new verification main stage after pickup completed
        order.data.stage.push({
          type: "verification",
          subStages: [],
          status: "pending",
          createdBy: "",
          date: "",
        });
      }

      // add next empty stage for pickup-initiated stage
      if (reqBody.data.type === "verification") {
        if (reqBody.data.data.action === "replace") {
          //add delivery stage
          order.data.stage.push({
            type: "delivery",
            subStages: [],
            status: "pending",
            createdBy: "",
            date: "",
          });
        }
      }

      // add next empty stage for delivery stage
      if (reqBody.data.type === "delivery") {
        order.status = "completed";

      // update product
      // update product with quantity received
      //   for (const item of order.data.items) {
      //     const product = await Product.findOne({
      //       productCode: item.productCode,
      //     });
      //     if (product) {
      //       // create a object contains order details and update quantity, price, rate
      //       //first find is there any object with type base
      //       const baseData = product.data.find((data) => data.type === "base");
      //       if (baseData) {
      //         baseData.quantity -= Number(item.quantitySelected);
      //         baseData.amount -=
      //           Number(item.quantitySelected) * Number(item.ratePerUnit);
      //         baseData.rate = baseData.amount / baseData.quantity;
      //         baseData.history.push({
      //           type: order.type,
      //           data: {
      //             orderId: order._id.toString(),
      //           },
      //           effect: "-", // Purchase increases stock
      //           effectQuantity: Number(item.quantitySelected),
      //           effectAmount:
      //             Number(item.quantitySelected) * Number(item.ratePerUnit),
      //         });
      //       }
      //       product.markModified("data");
      //       await product.save();
      //     }
      //   }
      }
      console.log(stage);

      order.markModified("data");

      await order.save();

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
