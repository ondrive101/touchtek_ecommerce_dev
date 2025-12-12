import { NextResponse, NextRequest } from "next/server";
import { StatusCodes } from "http-status-codes";
import dbConnect from "@/lib/mongoose";
import User from "@/lib/models/User";
import Product from "@/lib/models/Product";
import Employee from "@/lib/models/Employee";
import Supplier from "@/lib/models/Supplier";
import Department from "@/lib/models/Department";
import Customer from "@/lib/models/Customer";
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
const validateSession = async (session, role) => {
  console.log("Validating session...");
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

 
  if (department.name !== role) {
    console.log("Role mismatch");
    return {
      valid: false,
      stage: "sv3",
      message: "Unauthorized, please login",
    };
  }

  console.log("Session validated successfully");
  return { valid: true, user: { ...matchedEmployee, team: matchedTeam, department:{name:department.name, code:department.code} } };
};

export async function POST(request) {
  try {
    console.log('called in server api')
    await dbConnect();
  
    const contentType = request.headers.get("content-type") || "";
    console.log("Content-Type:", contentType);



    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { status: "fail", message: "Unsupported Content-Type" },
        { status: StatusCodes.UNSUPPORTED_MEDIA_TYPE }
      );
    }


    // Attempt to parse FormData with additional debugging
    let formData;
    try {
      formData = await request.formData();
      console.log("FormData parsed successfully");
    } catch (parseError) {
      console.error("FormData parsing failed:", parseError);
      throw new Error("Failed to parse body as FormData");
    }



    if (contentType.includes("multipart/form-data")) {
      console.log("FormData:", formData);
      const fields = {};
      const files = {};

    // Log raw FormData entries
    const entries = [...formData.entries()];


    console.log('called in server')
  

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

      const { route, folder, session: sessionString, ...rest } = fields;

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

      const sessionValidation = await validateSession(session, "admin");
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
      const options = { folder: folder + "_images" };
      const result = await uploadToCloudinary(files.image.buffer, options);
      data.image = result.url;
      data.imagePublicId = result.public_id;



      if (route === "createNewSku") {
        const {
          productName,
          skucode,
          category,
          subCategory,
          shortDescription,
          longDescription,
          type,
          image,
          imagePublicId,
          chargerType,
          cableType,
          lithiumType,
        } = data;

        // Validate required fields
        if (
          !productName ||
          !skucode ||
          !category ||
          !subCategory ||
          !shortDescription ||
          !type ||
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
          data: [],
          type,
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
          createdByDepartment: {
            departmentId: sessionValidation.user.department.code,
            teamId: sessionValidation.user.team.teamID,
            employeeId: sessionValidation.user.employeeCode,
          },
        };

        
        if (subCategory === "Chargers") {
          obj.data.push({
            type: "Chargers",
            data: {
              isCharger: true,
              isCable: chargerType === "with-cable",
              chargerType: chargerType,
              cableType: cableType || "",
            },
          });
        }

        if (subCategory === "Lithium") {
          obj.data.push({
            type: "Lithium",
            data: {
             lithiumType: lithiumType,
            },
          });
        }

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
      if (route === "createEmployee") {
        console.log('data in route', data);

              //check item already added with email
              const isExist = await Employee.findOne({ email: data.email });
              if (isExist) {
                return NextResponse.json(
                  {
                    status: "fail",
                    message:
                      "Employee already exists with this email! use another email",
                  },
                  { status: StatusCodes.BAD_REQUEST }
                );
              }
              //check item already added with email
              const isExistCode = await Employee.findOne({ employeeCode: data.employeeCode });
              if (isExistCode) {
                return NextResponse.json(
                  {
                    status: "fail",
                    message:
                      "Employee already exists with this employee code! use another employee code",
                  },
                  { status: StatusCodes.BAD_REQUEST }
                );
              }

        

        const isFirstEmployee = (await Employee.countDocuments()) === 0;
        const series = await Series.findOne();

        // create object to upload
        const obj = {
          ...data,
          empCode: isFirstEmployee ? 1 : series.empCode + 1,
          status: "active",
          createdByName: sessionValidation.user.name,
          createdByDepartment: {
            departmentId: sessionValidation.user.department.code,
            teamId: sessionValidation.user.team.teamID,
            employeeId: sessionValidation.user.employeeCode,
            connectionID: sessionValidation.user.connectionID,
          },
        };

        // create product series or update
        await Series.updateOne({}, { $set: { empCode: obj.empCode } });

        const employee = await Employee.create(obj);

        if (!employee) {
          return NextResponse.json(
            { status: "fail", message: "unable to create employee" },
            { status: StatusCodes.BAD_REQUEST }
          );
        }
        return NextResponse.json(
          {
            status: "success",
            message: "Employee created successfully",
          },
          { status: StatusCodes.OK }
        );
      }
      if (route === "createNewCustomer") {
        const {
          productName,
          name,
          customerId,
          email,
          contactNumber,
          alternativeContactNumber,
          employeeInformed,
          gender,
          dateOfBirth,
          streetAddress,
          city,
          pinCode,
          country,
          state,
          billingAddressSame,
          aadharCard,
          panCard,
          creditDurationLimit,
          creditLimit,
          customerCategory,
          customerType,
          // distributorName,
          // dealerName,
          image,
          imagePublicId,
        } = data;

        // Validate required fields
        if (
          !name ||
          !customerId ||
          !email ||
          !contactNumber ||
          !gender ||
          !dateOfBirth ||
          !streetAddress ||
          !city ||
          !pinCode ||
          !country ||
          !state ||
          !billingAddressSame ||
          !aadharCard ||
          !panCard ||
          !creditDurationLimit ||
          !creditLimit ||
          !customerCategory ||
          !customerType ||
          // !distributorName ||
          // !dealerName ||
          !image ||
          !imagePublicId
        ) {
          return NextResponse.json(
            { status: "fail", message: "Missing required fields" },
            { status: StatusCodes.BAD_REQUEST }
          );
        }
        //check item already added with customerId
        const isCustomerExist = await Customer.findOne({ customerId });
        if (isCustomerExist) {
          return NextResponse.json(
            {
              status: "fail",
              message:
                "Customer already exists with this customerId! use another customerId",
            },
            { status: StatusCodes.BAD_REQUEST }
          );
        }

        const isFirstCustomer = (await Customer.countDocuments()) === 0;
        const series = await Series.findOne();

        // create object to upload
        const obj = {
          name,
          customerId,
          email,
          contactNumber,
          alternativeContactNumber,
          employeeInformed:{isRefer:"No",referBy:"",referId:""},
          gender,
          dateOfBirth,
          streetAddress,
          city,
          pinCode,
          country,
          state,
          billingAddressSame,
          aadharCard,
          panCard,
          creditDurationLimit,
          creditLimit,
          customerCategory,
          customerType,
          distributorName:data.distributorName || "",
          dealerName:data.dealerName || "",
          image,
          imagePublicId,
          customerSeries: isFirstCustomer ? 1 : series.customer + 1,
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
        await Series.updateOne({}, { $set: { customer: obj.customerSeries } });

        const customer = await Customer.create(obj);

        if (!customer) {
          return NextResponse.json(
            { status: "fail", message: "unable to create customer" },
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

      if (route === "createSupplier") {
        const {
          name,
          supplierId,
          email,
          contactNumber,
          alternativeContactNumber,
          employeeInformed,
          gender,
          type,
          category,
          subCategory,
          streetAddress,
          city,
          pinCode,
          country,
          state,
          billingAddressSame,
          image,
          imagePublicId,
        } = data;

        // Validate required fields
        if (
          !name ||
          !supplierId ||
          !employeeInformed ||
          !email ||
          !contactNumber ||
          !gender ||
          !streetAddress ||
          !city ||
          !pinCode ||
          !country ||
          !state ||
          !billingAddressSame ||
          !image ||
          !imagePublicId||
          !type||
          !category||
          !subCategory
        ) {
          return NextResponse.json(
            { status: "fail", message: "Missing required fields" },
            { status: StatusCodes.BAD_REQUEST }
          );
        }
        //check item already added with customerId
        const isSupplierExist = await Supplier.findOne({ supplierId });
        if (isSupplierExist) {
          return NextResponse.json(
            {
              status: "fail",
              message:
                "Supplier already exists with this supplierId! use another supplierId",
            },
            { status: StatusCodes.BAD_REQUEST }
          );
        }

        const isFirstSupplier = (await Supplier.countDocuments()) === 0;
        const series = await Series.findOne();
        
        // create object to upload
        const obj = {
          type,
          category,
          subCategory,
          name,
          supplierId,
          email,
          contactNumber,
          alternativeContactNumber,
          employeeInformed: { isRefer: "No", referBy: "", referId: "" },
          gender,
          streetAddress,
          city,
          pinCode,
          country,
          state,
          billingAddressSame,
          image,
          imagePublicId,
          supplierSeries: isFirstSupplier ? 1 : series.supplier + 1,
          status: "active",
          createdByDepartment: {
            departmentId: sessionValidation.user.department.code,
            teamId: sessionValidation.user.team.teamID,
            employeeId: sessionValidation.user.employeeCode,
          },
          approvals: {
            initial: {
              status: "approved",
              approvedBy: "",
              approvedAt: "",
            },
          },
        };

        // create product series or update
        await Series.updateOne({}, { $set: { supplier: obj.supplierSeries } });

        const supplier = await Supplier.create(obj);

        if (!supplier) {
          return NextResponse.json(
            { status: "fail", message: "unable to create supplier" },
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
