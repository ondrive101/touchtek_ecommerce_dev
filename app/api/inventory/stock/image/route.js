import { NextResponse, NextRequest } from "next/server";
import { StatusCodes } from "http-status-codes";
import dbConnect from "@/lib/mongoose";
import User from "@/lib/models/User";
import Product from "@/lib/models/Product";
import Series from "@/lib/models/Series";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Utility function to upload buffer to Cloudinary
const uploadToCloudinary = (buffer, options) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error)
          reject(new Error("Cloudinary upload failed: " + error.message));
        else resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// Session validation function
const validateSession = async (session) => {
  if (!session || !session.user || !session.user.id) {
    return { valid: false, message: "Unauthorized, please login" };
  }

  const user = await User.findOne({ userID: session.user.id });
  if (!user) {
    return { valid: false, message: "Unauthorized, please login" };
  }

  if (user.role !== "inventory") {
    return { valid: false, message: "Unauthorized, please login" };
  }

  return { valid: true, user };
};

export async function POST(request) {
  try {
    await dbConnect();
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      // Parse multipart/form-data
      const formData = await request.formData();
      const fields = {};
      const files = {};

      // Log raw formData for debugging
    // Log raw FormData entries
    const entries = [...formData.entries()];
    console.log("Raw FormData entries:", entries);

      // for (const [key, value] of formData.entries()) {
      //   console.log("Key:", key, "Value:", value);
      //   if (value instanceof File) {
      //     files[key] = {
      //       name: value.name,
      //       type: value.type,
      //       size: value.size,
      //       buffer: Buffer.from(await value.arrayBuffer()),
      //     };
      //   } else {
      //     fields[key] = value;
      //   }
      // }
      for (const [key, value] of entries) {
        console.log(`Processing key: ${key}, value type: ${typeof value}`);
        // Check if value is a file-like object
        if (value && typeof value.arrayBuffer === "function") {
          console.log(`File detected for key: ${key}`, {
            name: value.name,
            type: value.type,
            size: value.size,
          });
          files[key] = {
            name: value.name,
            type: value.type,
            size: value.size,
            buffer: Buffer.from(await value.arrayBuffer()),
          };
        } else {
          console.log(`Field detected for key: ${key}`, value);
          fields[key] = value;
        }
      }

      const { route, session: sessionString, ...rest } = fields;

      // Validate route
      if (!route) {
        return NextResponse.json(
          { status: "fail", message: "Route is required" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

      // Validate and parse session
      if (!sessionString) {
        return NextResponse.json(
          { status: "fail", message: "Unauthorized, please login" },
          { status: StatusCodes.UNAUTHORIZED }
        );
      }

      let session;
      try {
        session = JSON.parse(sessionString);
      } catch (error) {
        return NextResponse.json(
          { status: "fail", message: "Invalid session format" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

      const sessionValidation = await validateSession(session);
      // Check session validation
      if (!sessionValidation.valid) {
        return NextResponse.json(
          { status: "fail", message: sessionValidation.message },
          { status: StatusCodes.UNAUTHORIZED }
        );
      }

      // Validate file
      if (!files.image) {
        return NextResponse.json(
          { status: "fail", message: "No image provided" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

      // Prepare SKU data
      const data = {
        ...rest,
        image: "",
        imagePublicId: "",
      };

      // Upload file to Cloudinary
      const options = { folder: "inventory_images" };
      const result = await uploadToCloudinary(files.image.buffer, options);
      data.image = result.url;
      data.imagePublicId = result.public_id;

      console.log("in route", route, sessionValidation);

      if (route === "createNewSku") {
        const {
          productName,
          skucode,
          category,
          subCategory,
          shortDescription,
          longDescription,
          image,
          imagePublicId,
        } = data;

        // Validate required fields
        if (
          !productName ||
          !skucode ||
          !category ||
          !subCategory ||
          !shortDescription ||
          !longDescription ||
          !image ||
          !imagePublicId
        ) {
          return NextResponse.json(
            { status: "fail", message: "Missing required fields" },
            { status: StatusCodes.BAD_REQUEST }
          );
        }
        //check item already added with skucode
        const isProductExist = await Product.findOne({ skucode });
        if (isProductExist) {
          return NextResponse.json(
            {
              status: "fail",
              message:
                "Item already exists with this skucode! use another skucode",
            },
            { status: StatusCodes.BAD_REQUEST }
          );
        }

        const isFirstProduct = (await Product.countDocuments()) === 0;
        const series = await Series.findOne();

        // create object to upload
        const obj = {
          productName,
          category,
          subCategory,
          shortDescription,
          longDescription,
          image,
          imagePublicId,
          skucode,
          productCode: isFirstProduct ? 1000 : series.productCode + 1,
          status: "active",
          approvals: {
            initial: {
              status: "approved",
              approvedBy: "",
              approvedAt: "",
            },
          },
          createdBy: sessionValidation.user._id,
          createdByName: sessionValidation.user.name,
        };

        // create product series or update
        await Series.updateOne({}, { $set: { productCode: obj.productCode } });

        const product = await Product.create(obj);

        if (!product) {
          return NextResponse.json(
            { status: "fail", message: "unable to create product" },
            { status: StatusCodes.BAD_REQUEST }
          );
        }
        return NextResponse.json(
          {
            status: "success",
            message: "Product created successfully",
          },
          { status: StatusCodes.OK }
        );
      }

      // If no route is matched
      return NextResponse.json(
        { status: "fail", message: "Invalid route" },
        { status: StatusCodes.INTERNAL_SERVER_ERROR }
      );
    }
    return NextResponse.json(
      { status: "fail", message: "Unsupported Content-Type" },
      { status: StatusCodes.UNSUPPORTED_MEDIA_TYPE }
    );
  } catch (error) {
    console.error("Error in API route:", error);
    // If no route is matched
    return NextResponse.json(
      {
        status: "fail",
        message: error.message || "An error occurred...",
      },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
