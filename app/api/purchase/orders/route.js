import { NextResponse, NextRequest } from "next/server";
import { StatusCodes } from "http-status-codes";
import dbConnect from "@/lib/mongoose";
import User from "@/lib/models/User";
import Product from "@/lib/models/Product";
import { hashPassword } from "@/lib/utils/password";
import Series from "@/lib/models/Series";
import Seller from "@/lib/models/Seller";
import PurchaseOrders from "@/lib/models/PurchaseOrders";
import { nanoid } from "nanoid";

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
  if (user.role !== "purchase") {
    return NextResponse.json(
      {
        status: "fail",
        message: "Unauthorized, please login",
      },
      { status: StatusCodes.UNAUTHORIZED }
    );
  }

  if (reqBody.route === "createNewSeller") {
    try {
      const { name, address, pincode, state } = reqBody.data;
      // Validate required fields
      if (!name || !address || !pincode || !state) {
        return NextResponse.json(
          { status: "fail", message: "Missing required fields" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

      const isFirstSeller = (await Seller.countDocuments()) === 0;
      const series = await Series.findOne();

      // create object to upload
      const obj = {
        sellerName: name,
        address,
        pincode,
        state,
        sellerCode: isFirstSeller ? 1 : series.sellerCode + 1,
        status: "inactive",
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
      await Series.updateOne({}, { $set: { sellerCode: obj.sellerCode } });

      const seller = await Seller.create(obj);

      if (!seller) {
        return NextResponse.json(
          { status: "fail", message: "unable to create new seller" },
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

  if (reqBody.route === "getSellersList") {
    try {
      const List = await Seller.find({}).sort({
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

  if (reqBody.route === "getProductList") {
    try {
      const List = await Product.find({}).sort({
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

  if (reqBody.route === "createNewOrder") {
    try {
      const { items, subTotal, seller } = reqBody.data;
      // // Validate required fields
      if (!items || !subTotal || !seller) {
        return NextResponse.json(
          { status: "fail", message: "Missing required fields" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

      const isFirstPurchaseOrder =
        (await PurchaseOrders.countDocuments()) === 0;
      const series = await Series.findOne();

      // add some fields in items
      items.forEach((item) => {
        item.uid = nanoid(16);
        item.receivedStatus = "";
        item.receivedQuantity = 0;
      });

      // create object to upload
      const obj = {
        items,
        subTotal,
        seller: {
          id: seller._id,
          name: seller.sellerName,
          address: seller.address,
          pincode: seller.pincode,
          state: seller.state,
        },
        poid: isFirstPurchaseOrder ? 1 : series.poid + 1,
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

      // create product series or update
      await Series.updateOne({}, { $set: { poid: obj.poid } });

      const order = await PurchaseOrders.create(obj);

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
}
