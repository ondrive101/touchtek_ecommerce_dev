import { NextResponse, NextRequest } from "next/server";
import { StatusCodes } from "http-status-codes";
import dbConnect from "@/lib/mongoose";
import User from "@/lib/models/User";
import Product from "@/lib/models/Product";
import { hashPassword } from "@/lib/utils/password";
import Series from "@/lib/models/Series";
import PurchaseOrders from "@/lib/models/PurchaseOrders";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import Sales from "@/lib/models/Sales";
import {
  processPurchaseOrders,
  processSalesOrders,
  processReturnOrders,
} from "@/app/utils/stockUtils";
import { revalidatePath } from "next/cache";

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
  // if (reqBody.route === "createNewSku") {
  //   try {
  //     const {
  //       productName,
  //       skucode,
  //       category,
  //       subCategory,
  //       shortDescription,
  //       longDescription,
  //       image,
  //       imagePublicId,
  //     } = reqBody.data;

  //     // Validate required fields
  //     if (
  //       !productName ||
  //       !skucode ||
  //       !category ||
  //       !subCategory ||
  //       !shortDescription ||
  //       !longDescription ||
  //       !image ||
  //       !imagePublicId
  //     ) {
  //       return NextResponse.json(
  //         { status: "fail", message: "Missing required fields" },
  //         { status: StatusCodes.BAD_REQUEST }
  //       );
  //     }

  //     //check item already added with skucode
  //     const isProductExist = await Product.findOne({ skucode });
  //     if (isProductExist) {
  //       return NextResponse.json(
  //         { status: "fail", message: "Item already exists with this skucode! use another skucode" },
  //         { status: StatusCodes.BAD_REQUEST }
  //       );
  //     }

  //     const isFirstProduct = (await Product.countDocuments()) === 0;
  //     const series = await Series.findOne();

  //     // create object to upload
  //     const obj = {
  //       productName,
  //       category,
  //       subCategory,
  //       shortDescription,
  //       longDescription,
  //       image,
  //       imagePublicId,
  //       skucode,
  //       productCode: isFirstProduct ? 1000 : series.productCode + 1,
  //       status: "active",
  //       approvals: {
  //         initial: {
  //           status: "approved",
  //           approvedBy: "",
  //           approvedAt: "",
  //         },
  //       },
  //       createdBy: user._id,
  //       createdByName: user.name,
  //     };

  //     // create product series or update
  //     await Series.updateOne({}, { $set: { productCode: obj.productCode } });

  //     const product = await Product.create(obj);

  //     if (!product) {
  //       return NextResponse.json(
  //         { status: "fail", message: "unable to create product" },
  //         { status: StatusCodes.BAD_REQUEST }
  //       );
  //     }

  //     return NextResponse.json(
  //       {
  //         status: "success",
  //         message: "Product created successfully",
  //       },
  //       { status: StatusCodes.OK }
  //     );
  //   } catch (e) {
  //     return NextResponse.json(
  //       {
  //         status: "fail",
  //         message: e.message || "An error occurred...",
  //       },
  //       { status: StatusCodes.BAD_REQUEST }
  //     );
  //   }
  // }
  if (reqBody.route === "createNewSkus") {
    try {
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
  if (reqBody.route === "getProductList") {
    try {
      const List = await Product.find({}).sort({
        createdAt: -1,
      });

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

          // Return the final structured object for the product
          return {
            ...product._doc,
            main, // Include main stock details
            returns, // Include return details
          };
        })
      );



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
  if (reqBody.route === "getProductBy_Id") {
    try {
      const product = await Product.findOne({ _id: reqBody.id });

      if (!product) {
        return NextResponse.json(
          {
            status: "fail",
            message: "Product not found",
          },
          { status: StatusCodes.NOT_FOUND }
        );
      }

      // Query Purchase Orders
      const purchaseOrders = await PurchaseOrders.find({
        "items.itemCode": product.productCode,
        status: "received",
      });

      // Query Sales Orders
      const salesOrders = await Sales.find({
        "initial.data.items.productCode": product.productCode,
      });

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

      // Use utils to process orders
      processPurchaseOrders(purchaseOrders, product, main);
      processSalesOrders(salesOrders, product, main);
      processReturnOrders(salesOrders, product, main, returns);

      return NextResponse.json({
        status: "success",
        message: "return successfully",
        data: {
          product,
          main,
          returns,
          purchaseOrders,
          salesOrders,
        },
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
