import { NextResponse, NextRequest } from "next/server";
import { StatusCodes } from "http-status-codes";
import dbConnect from "@/lib/mongoose";
import User from "@/lib/models/User";
import Product from "@/lib/models/Product";

import Series from "@/lib/models/Series";
import PurchaseOrders from "@/lib/models/PurchaseOrders";

import Sales from "@/lib/models/Sales";

import Customer from "@/lib/models/Customer";
import {
  processPurchaseOrders,
  processSalesOrders,
  processReturnOrders,
} from "@/app/utils/stockUtils";

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

  if (reqBody.route === "getProductList") {
    try {
      // Fetch all products sorted by the creation date in descending order
      const List = await Product.find({}).sort({ createdAt: -1 });

      // Use Promise.all to await all asynchronous operations inside map
      const list = await Promise.all(
        List.map(async (product) => {
          // Initialize main and returns objects to track stock and return data
          const main = {
            quantity: 0,
            amount: 0,
            rate: 0,
            orders: [],
          };

          const returns = {
            quantity: 0,
            amount: 0,
            rate: 0,
            orders: [],
          };

          // Query Purchase Orders
          const purchaseOrders = await PurchaseOrders.find({
            "items.itemCode": product.productCode,
            status: "received",
          });

          // Query Sales Orders
          const salesOrders = await Sales.find({
            "initial.data.items.productCode": product.productCode,
          });

          // Use utils to process orders
          processPurchaseOrders(purchaseOrders, product, main);
          processSalesOrders(salesOrders, product, main);
          processReturnOrders(salesOrders, product, main, returns);

          // Extract product details
          const {
            _id,
            productName,
            category,
            productCode,
            skucode,
            subCategory,
            image,
          } = product;

          // Return the final structured object for the product
          return {
            _id,
            productName,
            category,
            productCode,
            skucode,
            subCategory,
            image,
            main, // Include main stock details
            returns, // Include return details
          };
        })
      );

      /**
       * ─── Send the final response ─────────────────────────────────────────
       */

      console.log(list)
      return NextResponse.json({
        status: "success",
        message: "return successfully",
        data: list || [],
      });
    } catch (e) {
      // Handle errors gracefully and return a failure response
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
      const {
        customer,
        payment,
        orderType,
        orderDate,
        orderTime,
        orderNote,
        items,
        subTotal,
        customerObj,
      } = reqBody.data;

      // // Validate required fields
      if (
        !customer ||
        !payment ||
        !orderType ||
        !orderDate ||
        !orderTime ||
        !orderNote ||
        !items ||
        !subTotal ||
        !customerObj
      ) {
        return NextResponse.json(
          { status: "fail", message: "Missing required fields" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

      const isFirstSalesOrder = (await Sales.countDocuments()) === 0;
      const series = await Series.findOne();

      const obj = {
        soid: isFirstSalesOrder ? 1 : series.soid + 1,
        customer: customerObj._id,
        status: "initiated",
        stage: "sales",
        statusHistory: [
          {
            status: "initiated",
            createdBy: user._id,
            createdByName: user.name,
            createdAt: new Date(),
          },
        ],
        initial: {
          type: "sales",
          createdBy: user._id,
          createdByName: user.name,
          createdAt: new Date(),
          updatedAt: new Date(),
          data: {
            paymentType: payment,
            orderType,
            orderDate,
            orderTime,
            orderNote,
            items,
            subTotal,
          },
        },
        isReturn: false,
        return: {
          type: "sales-return",
          data: {},
        },
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
      await Series.updateOne({}, { $set: { soid: obj.soid } });

      const sales = await Sales.create(obj);

      if (!sales) {
        return NextResponse.json(
          { status: "fail", message: "unable to create new sales order" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

      // add details in inprogress in each product document
      // for (const item of items) {
      //   console.log(item);
      //   const product = await Product.findOne({ _id: item.itemId });
      //   if (!product) {
      //     return NextResponse.json(
      //       {
      //         status: "fail",
      //         message: "Product not found",
      //       },
      //       { status: StatusCodes.NOT_FOUND }
      //     );
      //   }

      //   //reduce quantity and blocked fund
      //   // product.quantity -= Number(item.quantitySelected);
      //   // product.blockedFund -= Number(item.amount);

      //   //add details in inprogress
      //   const { id, ...rest } = item;
      //   product.initial.quantity -= Number(item.quantitySelected);
      //   product.initial.amount -=
      //     Number(item.rate) * Number(item.quantitySelected);
      //   product.initial.orders.push({
      //     data: rest,
      //     orderId: sales._id.toString(),
      //     type: "sales",
      //     createdAt: new Date(),
      //   });

      //   product.markModified("initial");
      //   await product.save();
      // }

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

  if (reqBody.route === "createReturnOrder") {
    try {
      const { selectedOrder, returnItems, returnNote, totalReturnAmount } =
        reqBody.data;

      // // Validate required fields
      if (!selectedOrder || !returnItems || !returnNote || !totalReturnAmount) {
        return NextResponse.json(
          { status: "fail", message: "Missing required fields" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

      // create object to upload

      const historyArray = [
        ...selectedOrder.statusHistory,
        {
          status: "return-initiated",
          createdBy: user._id,
          createdByName: user.name,
          createdAt: new Date(),
        },
      ];

      const obj = {
        status: "return-initiated",
        stage: "return",
        statusHistory: historyArray,
        isReturn: true,
        return: {
          type: "sales-return",
          createdBy: user._id,
          createdByName: user.name,
          createdAt: new Date(),
          updatedAt: new Date(),
          data: {
            orderNote: returnNote,
            items: returnItems,
            subTotal: totalReturnAmount,
          },
        },
      };

      // update status of selected order
      const updatedOrder = await Sales.findByIdAndUpdate(
        selectedOrder._id,
        obj,
        { new: true }
      );

      if (!updatedOrder) {
        return NextResponse.json(
          {
            status: "fail",
            message: "unable to create new sales return order",
          },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

      // add details in inprogress in each product document
      // for (const item of items) {
      //   const product = await Product.findOne({ _id: item._id });
      //   if (!product) {
      //     return NextResponse.json(
      //       {
      //         status: "fail",
      //         message: "Product not found",
      //       },
      //       { status: StatusCodes.NOT_FOUND }
      //     );
      //   }

      //reduce quantity and blocked fund
      // product.quantity -= Number(item.quantitySelected);
      // product.blockedFund -= Number(item.amount);

      // //add details in inprogress
      //   const {id, ...rest} = item;
      //   product.inProcessOrders.push({
      //     data: rest,
      //     orderId: sales._id.toString(),
      //     type: "sales",
      //     createdAt: new Date(),
      //   });

      //   await product.save();
      // }

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
    try {
      const List = await Sales.find({
        status: { $ne: "deleted" },
      }).sort({
        createdAt: -1,
      });

      // fetch customer by id and append in list object
      const customerList = await Customer.find({
        _id: { $in: List.map((item) => item.customer) },
      });

      const list = List.map((item) => {
        const customer = customerList.find(
          (c) => c._id.toString() === item.customer.toString()
        );
        return {
          ...item._doc,
          customer: {
            _id: customer._id,
            name: customer.name,
            customerCode: customer.customerCode,
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

  // If no route is matched
  return NextResponse.json(
    {
      status: "fail",
      message: "Invalid route",
    },
    { status: StatusCodes.INTERNAL_SERVER_ERROR }
  );
}
