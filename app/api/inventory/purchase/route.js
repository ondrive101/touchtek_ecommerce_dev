import { NextResponse, NextRequest } from "next/server";
import { StatusCodes } from "http-status-codes";
import dbConnect from "@/lib/mongoose";
import User from "@/lib/models/User";
import Product from "@/lib/models/Product";
import { hashPassword } from "@/lib/utils/password";
import Series from "@/lib/models/Series";
import Seller from "@/lib/models/Seller";
import PurchaseOrders from "@/lib/models/PurchaseOrders";

/**
 * POST /api/inventory/purchase
 *
 * Get purchase orders list
 * or get purchase order by id
 *
 * @param {Object} reqBody - request body
 * @param {string} reqBody.session - user session
 * @param {string} reqBody.route - route name (getOrdersList, getOrderById)
 * @param {string} [reqBody.id] - purchase order id (required if route is getOrderById)
 *
 * @returns {NextResponse}
 */
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
  if (user.role !== "inventory") {
    return NextResponse.json(
      {
        status: "fail",
        message: "Unauthorized, please login",
      },
      { status: StatusCodes.UNAUTHORIZED }
    );
  }
  if (reqBody.route === "getOrdersList") {
    try {
      const List = await PurchaseOrders.find({}).sort({
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
  if (reqBody.route === "getOrderById") {
    try {
      const order = await PurchaseOrders.findOne({ _id: reqBody.id });
      if (!order) {
        return NextResponse.json(
          {
            status: "fail",
            message: "Order not found",
          },
          { status: StatusCodes.NOT_FOUND }
        );
      }
      return NextResponse.json({
        status: "success",
        message: "return successfully",
        data: order,
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

  if (reqBody.route === "confirmOrder") {
    try {
      const order = await PurchaseOrders.findOne({ _id: reqBody.data.id });
      if (!order) {
        return NextResponse.json(
          {
            status: "fail",
            message: "Order not found",
          },
          { status: StatusCodes.NOT_FOUND }
        );
      }

      // update reqBody.data.items into order.items
      order.items = reqBody.data.items;
      order.status = "received";
      await order.save();

      //update object in product
      // for (const item of order.items) {
      //   const product = await Product.findOne({ productCode: item.itemCode });
      //   if (!product) {
      //     return NextResponse.json(
      //       {
      //         status: "fail",
      //         message: "Product not found",
      //       },
      //       { status: StatusCodes.NOT_FOUND }
      //     );
      //   }
      //   // product.quantity += Number(item.receivedQuantity);
      //   // product.blockedFund += Number(item.rate) * Number(item.receivedQuantity);
      //   // product.confirmedOrders.push({
      //     //   data: rest,
      //     //   orderId: order._id.toString(),
      //     //   type: "purchase",
      //     //   createdAt: new Date(),
      //     // });
          
      //     //update initail object
      //   const { id, ...rest } = item;
      //   product.initial.quantity += Number(item.receivedQuantity);
      //   product.initial.amount += Number(item.rate) * Number(item.receivedQuantity);
      //   product.initial.orders.push({
      //     data: rest,
      //     orderId: order._id.toString(),
      //     type: "purchase",
      //     createdAt: new Date(),
      //   });

      //   //remove from inProcessOrders
      //   product.inProcessOrders = product.inProcessOrders.filter(
      //     (Item) => Item.orderId !== order._id.toString()
      //   );
      //   product.markModified("inProcessOrders");
      //   // product.markModified("confirmedOrders");
      //   product.markModified("initial");
      //   await product.save();
      // }

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
  if (reqBody.route === "reConfirmOrder") {
    try {
      const order = await PurchaseOrders.findOne({ _id: reqBody.id });
      if (!order) {
        return NextResponse.json(
          {
            status: "fail",
            message: "Order not found",
          },
          { status: StatusCodes.NOT_FOUND }
        );
      }

      // Process product updates
      const productUpdates = await Promise.all(
        order.items.map(async (item) => {
          const product = await Product.findOne({ productCode: item.itemCode });

          if (!product) {
            return NextResponse.json(
              {
                status: "fail",
                message: "Product not found",
              },
              { status: StatusCodes.NOT_FOUND }
            );
          }

          // Reverse the added quantity and amount
          // product.quantity -= Number(item.receivedQuantity);
          // product.blockedFund -= Number(item.rate) * Number(item.receivedQuantity);
          // product.confirmedOrders = product.confirmedOrders.filter(
          //   (Item) => Item.orderId !== order._id.toString()
          // );


          //remove from initail orders
          const { id, ...rest } = item;
          product.initial.quantity -= Number(item.receivedQuantity);
          product.initial.amount -= Number(item.rate) * Number(item.receivedQuantity);
          product.initial.orders = product.initial.orders.filter(
            (Item) => Item.orderId !== order._id.toString()
          );
        //push item again in inProcessOrders
          product.inProcessOrders.push({
            data: rest,
            orderId: order._id.toString(),
            type: "purchase",
            createdAt: new Date(),
          });

          product.markModified("inProcessOrders");
          product.markModified("initial");
          await product.save();
        })
      );

      // Check for errors in product updates
      if (productUpdates.some((result) => result instanceof Error)) {
        return NextResponse.json(
          {
            status: "fail",
            message: "An error occurred while updating product",
          },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

      //update all items receivedStatus and receivedQuantity
      order.items.forEach((item) => {
        item.receivedStatus = "";
        item.receivedQuantity = 0;
      });
      order.markModified("items");

      // Update order status
      order.status = "in-progress";
      await order.save();

      return NextResponse.json({
        status: "success",
        message: "Order reconfirmed successfully",
      });
    } catch (e) {
      console.error(e);
      return NextResponse.json(
        {
          status: "fail",
          message: e.message || "An error occurred...",
        },
        { status: StatusCodes.INTERNAL_SERVER_ERROR }
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
