import { NextResponse, NextRequest } from "next/server";
import { StatusCodes } from "http-status-codes";
import dbConnect from "@/lib/mongoose";
import User from "@/lib/models/User";
import Product from "@/lib/models/Product";
import { hashPassword } from "@/lib/utils/password";
import Series from "@/lib/models/Series";
import Seller from "@/lib/models/Seller";
import PurchaseOrders from "@/lib/models/PurchaseOrders";
import Sales from "@/lib/models/Sales";
import Customer from "@/lib/models/Customer";

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

  if (reqBody.route === "confirmOrder") {
    try {
      console.log(reqBody);
      const order = await Sales.findOne({ _id: reqBody.data.id });
      if (!order) {
        return NextResponse.json(
          {
            status: "fail",
            message: "Order not found",
          },
          { status: StatusCodes.NOT_FOUND }
        );
      }

      // create object to upload
      const historyArray = [
        ...order.statusHistory,
        {
          status: reqBody.data.status,
          createdBy: user._id,
          createdByName: user.name,
          createdAt: new Date(),
        },
      ];

      const obj = {
        status: reqBody.data.status,
        statusHistory: historyArray,
      };

      if (
        reqBody.data.status === "partial-return" ||
        reqBody.data.status === "full-return"
      ) {
        obj.return = {
          ...order.return,
          updatedAt: new Date(),
          data: {
            ...order.return.data,
            items: reqBody.data.returnItems,
            restockAmount: reqBody.data.restockAmount,
            refundAmount: reqBody.data.refundAmount,
          },
        };
      }


      // update status of selected order
      const updatedOrder = await Sales.findByIdAndUpdate(order._id, obj, {
        new: true,
      });

   

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
      //   const {id, ...rest} = item;
      //   product.confirmedOrders.push({
      //     data: rest,
      //     orderId: order._id.toString(),
      //     type: "sales",
      //     createdAt: new Date(),
      //   });
      //   product.inProcessOrders = product.inProcessOrders.filter(
      //     (Item) => Item.orderId !== order._id.toString()
      //   );
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

  if (reqBody.route === "deleteOrder") {
    try {
      const order = await Sales.findOne({ _id: reqBody.id });
      if (!order) {
        return NextResponse.json(
          {
            status: "fail",
            message: "Order not found",
          },
          { status: StatusCodes.NOT_FOUND }
        );
      }

      //update object in product
      for (const item of order.items) {
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
        product.quantity += Number(item.quantitySelected);
        product.blockedFund += Number(item.amount);

        product.inProcessOrders = product.inProcessOrders.filter(
          (Item) => Item.orderId !== order._id.toString()
        );
        await product.save();
      }

      order.status = "deleted";
      await order.save();

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
