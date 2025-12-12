import { NextResponse, NextRequest } from "next/server";
import { StatusCodes } from "http-status-codes";
import dbConnect from "@/lib/mongoose";
import User from "@/lib/models/User";
import Product from "@/lib/models/Product";
import Supplier from "@/lib/models/Supplier";
import { hashPassword } from "@/lib/utils/password";
import { generatCode } from "@/lib/utils/required";
import Department from "@/lib/models/Department";
import Series from "@/lib/models/Series";
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

  const sessionValidation = await validateSession(reqBody.session, "admin");

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
    console.log("Fetching product list...");
    try {
      const list = await Product.find({}).sort({
        createdAt: -1,
      });

      // Map over the list to create a new array with the main property
      const processedList = list.map((item) => ({
        ...item._doc,
        main: Array.isArray(item.data)
          ? item.data.find((data) => data.type === "base") || null
          : null,
      }));

      return NextResponse.json({
        status: "success",
        message: "return successfully",
        data: processedList,
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
      const product = await Product.findOne({ _id: reqBody.id }).lean();

      if (!product) {
        return NextResponse.json(
          {
            status: "fail",
            message: "Product not found",
          },
          { status: StatusCodes.NOT_FOUND }
        );
      }
      // Add main property
      const processedProduct = {
        ...product,
        main: Array.isArray(product.data)
          ? product.data.find((data) => data.type === "base") || null
          : null,
      };

      // Query Purchase Orders (use .lean() for performance)
      const purchaseOrders = await Purchase.find({
        "data.previousReceipts.items.productCode": product.productCode || null,
      }).lean();

      // Query Sales Orders (use .lean() for performance)
      const salesOrders = await Sales.find({
        "data.items.productCode": product.productCode || null,
      }).lean();

      return NextResponse.json({
        status: "success",
        message: "return successfully",
        data: {
          product: processedProduct,
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

  if (reqBody.route === "deleteProduct") {
    try {
      const remove = await Product.findByIdAndDelete(reqBody.id);
      if (!remove) {
        return NextResponse.json(
          {
            status: "fail",
            message: "product not found",
          },
          { status: StatusCodes.NOT_FOUND }
        );
      }

      return NextResponse.json({
        status: "success",
        message: "deleted successfully",
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

  if (reqBody.route === "getEmployeeList") {
    try {
      const List = await Employee.find({}).sort({
        // createdAt: -1,
      });

      console.log("Employee list fetched successfully:", List.length);

      return NextResponse.json({
        status: "success",
        message: "return successfully",
        data: List,
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

  if (reqBody.route === "deleteEmployee") {
    try {
      const remove = await Employee.findByIdAndDelete(reqBody.id);
      if (!remove) {
        return NextResponse.json(
          {
            status: "fail",
            message: "employee not found",
          },
          { status: StatusCodes.NOT_FOUND }
        );
      }

      return NextResponse.json({
        status: "success",
        message: "deleted successfully",
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

  if (reqBody.route === "addBulkEmployee") {
    console.log("Adding bulk employee...", reqBody.data);
    try {
      // Check if we should delete previous data (assuming a flag in reqBody)
      const deletePrevious = reqBody.deletePrevious === true;

      // Function to generate a unique empCode (e.g., EMP-XXXX)
      const generateEmpCode = async () => {
        const series = await Series.findOne();
        const isFirstEmployee = (await Employee.countDocuments()) === 0;
        return isFirstEmployee ? 1 : series.empCode + 1;
      };

      // If deletePrevious is true, remove all existing employees
      if (deletePrevious) {
        await Employee.deleteMany({});
        // Reset the series empCode to 0 since we're starting fresh
        await Series.updateOne({}, { $set: { empCode: 0 } });
      }

      for (const item of reqBody.data) {
        // Check if email already exists
        const isExist = await Employee.findOne({ email: item.email });
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

        // Check if employee code already exists
        const isExistCode = await Employee.findOne({
          employeeCode: item.employeeCode,
        });
        if (isExistCode) {
          return NextResponse.json(
            {
              status: "fail",
              message: `Employee already exists with this employee code! use another employee code! CODE:${item.employeeCode}`,
            },
            { status: StatusCodes.BAD_REQUEST }
          );
        }

        // Generate unique empCode and add it to the item
        const empCode = await generateEmpCode();
        const employeeData = {
          ...item, // Spread existing item properties
          empCode, // Add the generated empCode
          status: "active",
          data: {
            base: "",
          },
          createdByName: sessionValidation.user.name,
          createdByDepartment: {
            departmentId: sessionValidation.user.department.code,
            teamId: sessionValidation.user.team.teamID,
            employeeId: sessionValidation.user.employeeCode,
            connectionID: sessionValidation.user.connectionID,
          },
        };

        // Create and save new employee
        const employee = new Employee(employeeData);
        await employee.save();

        // Update series
        await Series.updateOne({}, { $set: { empCode: empCode } });
      }

      return NextResponse.json(
        {
          status: "success",
          message: "All employees added successfully",
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

  if (reqBody.route === "getCustomerList") {
    console.log("Fetching customers list...");
    try {
      const List = await Customer.find({}).sort({
        // createdAt: -1,
      });

      console.log("Customers list fetched successfully:", List.length);

      // Use Promise.all to await all asynchronous operations inside map
      const list = await Promise.all(
        List.map(async (customer) => {
          // Return the final structured object for the product
          return {
            ...customer._doc,
          };
        })
      );

      console.log("Customer list processed successfully:", list.length);

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

  if (reqBody.route === "deleteCustomer") {
    try {
      const remove = await Customer.findByIdAndDelete(reqBody.id);
      if (!remove) {
        return NextResponse.json(
          {
            status: "fail",
            message: "employee not found",
          },
          { status: StatusCodes.NOT_FOUND }
        );
      }

      return NextResponse.json({
        status: "success",
        message: "deleted successfully",
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

  if (reqBody.route === "addBulkCustomers") {
    console.log("Adding bulk customers...", reqBody.data);
    try {
      // Check if we should delete previous data (assuming a flag in reqBody)
      const deletePrevious = reqBody.deletePrevious === true;

      // Function to generate a unique empCode (e.g., EMP-XXXX)
      const generateSeries = async () => {
        const series = await Series.findOne();
        const isFirst = (await Customer.countDocuments()) === 0;
        return isFirst ? 1 : series.customer + 1;
      };

      // If deletePrevious is true, remove all existing employees
      if (deletePrevious) {
        await Customer.deleteMany({});
        // Reset the series empCode to 0 since we're starting fresh
        await Series.updateOne({}, { $set: { customer: 0 } });
      }

      for (const item of reqBody.data) {
        // Check if email already exists
        const isExist = await Customer.findOne({ email: item.email });
        if (isExist) {
          return NextResponse.json(
            {
              status: "fail",
              message:
                "Customer already exists with this email! use another email",
            },
            { status: StatusCodes.BAD_REQUEST }
          );
        }

        // Check if employee code already exists
        const isExistCode = await Customer.findOne({
          customerId: item.customerId,
        });
        if (isExistCode) {
          return NextResponse.json(
            {
              status: "fail",
              message: `Customer already exists with this customer id! use another customer id! ID:${item.customerId}`,
            },
            { status: StatusCodes.BAD_REQUEST }
          );
        }

        // Generate unique empCode and add it to the item
        const customerSeries = await generateSeries();
        const customerData = {
          ...item, // Spread existing item properties
          customerSeries, // Add the generated empCode
          distributorName: item.distributorName || "",
          dealerName: item.dealerName || "",
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

        // Create and save new customer
        const customer = new Customer(customerData);
        await customer.save();

        // Update series
        await Series.updateOne({}, { $set: { customer: customerSeries } });
      }

      return NextResponse.json(
        {
          status: "success",
          message: "All customers added successfully",
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

  if (reqBody.route === "createDepartment") {
    try {
      console.log("Creating department...");
      // Step 1: Extract data
      const { name } = reqBody.data;
      const code = generatCode(3, 2);

      // Step 2: Validate required fields
      if (!name) {
        return NextResponse.json(
          { message: "Missing required fields" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }
      // Step 3: Check if department or code already exists
      const [existingByName, existingByCode] = await Promise.all([
        Department.findOne({ name }),
        Department.findOne({ code }),
      ]);

      if (existingByName) {
        return NextResponse.json(
          { status: "fail", message: "Department already exists" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

      if (existingByCode) {
        return NextResponse.json(
          { status: "fail", message: "Department code already exists" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

      // Step 4: Set department series
      const isFirstDepartment = (await Department.countDocuments()) === 0;
      const series = await Series.findOne();
      const departmentSeries = isFirstDepartment
        ? 1
        : (series.department || 0) + 1;

      // Step 5: Create initial department
      const departmentObj = {
        name: reqBody.data.name.toLowerCase(),
        teams: [
          {
            title: "admin",
            teamID: nanoid(24),
            attachedEmployees: [],
            status: "active",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        status: "active",
        code, // Assuming `generateCode` is defined/imported
        series: departmentSeries,
      };

      await Series.updateOne({}, { $set: { department: departmentSeries } });

      // Step 6: Create the department
      const department = await Department.create(departmentObj);
      if (!department) {
        return NextResponse.json(
          {
            status: "fail",
            message: "Failed to create department",
          },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

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

  if (reqBody.route === "getDepartmentList") {
    console.log("Fetching department list...");
    try {
      const List = await Department.find({}).sort({
        createdAt: -1,
      });

      console.log("Department list fetched successfully:", List.length);

      // Use Promise.all to await all asynchronous operations inside map
      const list = await Promise.all(
        List.map(async (department) => {
          // Return the final structured object for the product
          return {
            ...department._doc,
          };
        })
      );

      console.log("Department list processed successfully:", list.length);

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

  if (reqBody.route === "getDepartmentById") {
    console.log("Fetching department list...");
    try {
      const department = await Department.findById(reqBody.id);

      console.log("Department fetched successfully:");

      return NextResponse.json({
        status: "success",
        message: "return successfully",
        data: department,
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

  if (reqBody.route === "attachEmployees") {
    try {
      const { departmentId, team, employeeId, email, password } = reqBody.data;

      // Step 1: Validate required fields
      if (!departmentId || !team || !employeeId || !email || !password) {
        return NextResponse.json(
          { message: "Missing required fields" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

  

      // Step 2: find department and employee
      const [department, employee] = await Promise.all([
        Department.findById(departmentId),
        Employee.findById(employeeId),
      ]);

      if (!department || !employee) {
        return NextResponse.json({
          status: "fail",
          message: "Department or Employee not found",
        });
      }

          // restrict action if already added in any department
          const isAlreadyAdded = await Department.findOne({
            "teams.attachedEmployees.employeeCode":
            employee.employeeCode,
          });
    
          if (isAlreadyAdded) {
            return NextResponse.json(
              {
                status: "fail",
                message: `employee already connected in any of department! user cannot be added in multiple department at once`,
              },
              { status: StatusCodes.BAD_REQUEST }
            );
          }

      // Step 3: Hash default admin password
      const hashedPassword = await hashPassword(password);
      if (!hashedPassword) {
        throw new Error("Failed to hash password");
      }

      const empObj = {
        employeeCode: employee.employeeCode,
        connectionID: nanoid(24),
        name: employee.name,
        email: email, //login email
        rights: {
          default: true,
        },
        password: hashedPassword, //login password
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      //find team in department
      const teamIndex = department.teams.findIndex(
        (t) => t.title.trim().toLowerCase() === team.title.trim().toLowerCase()
      );

      if (teamIndex === -1) {
        return NextResponse.json({
          status: "fail",
          message: "Team not found in department",
        });
      }

      //push employee in team
      department.teams[teamIndex].attachedEmployees.push(empObj);

      // Step 5: Update department
      department.markModified(`teams.${teamIndex}.attachedEmployees`);
      await department.save();

      // Step 6: update department login mail in employee object
      employee.data.departmentEmail = email;
      employee.markModified("data");
      await employee.save();

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

  if (reqBody.route === "detachEmployee") {
    try {
      const { departmentId, team, employeeCode } = reqBody.data;

      // Step 1: Validate required fields
      if (!departmentId || !team || !employeeCode) {
        return NextResponse.json(
          { message: "Missing required fields" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

      // Step 2: Find department
      const department = await Department.findById(departmentId);
      if (!department) {
        return NextResponse.json({
          status: "fail",
          message: "Department not found",
        });
      }

      // Step 3: Find team in department
      const teamIndex = department.teams.findIndex(
        (t) => t.title.trim().toLowerCase() === team.trim().toLowerCase()
      );

      if (teamIndex === -1) {
        return NextResponse.json({
          status: "fail",
          message: "Team not found in department",
        });
      }

      // Step 4: Remove employee from the team
      department.teams[teamIndex].attachedEmployees = department.teams[
        teamIndex
      ].attachedEmployees.filter((emp) => emp.employeeCode !== employeeCode);

      // Step 5: Save changes
      department.markModified(`teams.${teamIndex}.attachedEmployees`);
      await department.save();
          // Step 6: update department login mail in employee object
          const employee = await Employee.findOne({
            employeeCode,
          });
          employee.data.departmentEmail = '';
          employee.markModified("data");
          await employee.save();

      return NextResponse.json({
        status: "success",
        message: "Employee detached successfully",
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

  if (reqBody.route === "createTeam") {
    try {
      const { departmentId, title } = reqBody.data;

      // Step 1: Validate required fields
      if (!departmentId || !title) {
        return NextResponse.json(
          { message: "Missing required fields" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }
      // Step 2: find department
      const department = await Department.findById(departmentId);

      if (!department) {
        return NextResponse.json({
          status: "fail",
          message: "Department not found",
        });
      }

      // add team in department
      department.teams.push({
        title: title.toLowerCase(),
        teamID: nanoid(24),
        attachedEmployees: [],
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Step 5: Update department
      department.markModified("teams");
      await department.save();
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

  if (reqBody.route === "deleteTeam") {
    try {
      const { departmentId, team } = reqBody.data;

      // Step 1: Validate required fields
      if (!departmentId || !team) {
        return NextResponse.json(
          { message: "Missing required fields" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }
      // Step 2: find department
      const department = await Department.findById(departmentId);

      if (!department) {
        return NextResponse.json({
          status: "fail",
          message: "Department not found",
        });
      }

      // Step 3: Remove team from department
      department.teams = department.teams.filter((t) => t.title !== team.title);

      // Step 4: Update department
      department.markModified("teams");
      await department.save();
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

  if (reqBody.route === "editTeam") {
    try {
      const { departmentId, team, title, status } = reqBody.data;

      // Step 1: Validate required fields
      if (!departmentId || !team || !title || !status) {
        return NextResponse.json(
          { message: "Missing required fields" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }
      // Step 2: find department
      const department = await Department.findById(departmentId);

      if (!department) {
        return NextResponse.json({
          status: "fail",
          message: "Department not found",
        });
      }

      // Step 3: Update team in department
      const teamIndex = department.teams.findIndex(
        (t) => t.title.trim().toLowerCase() === team.title.trim().toLowerCase()
      );

      if (teamIndex === -1) {
        return NextResponse.json({
          status: "fail",
          message: "Team not found in department",
        });
      }

      // Step 4: Update team
      department.teams[teamIndex] = {
        ...department.teams[teamIndex],
        title: title.toLowerCase(),
        status: status,
      };

      // Step 5: Update department
      department.markModified("teams");
      await department.save();
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

  if (reqBody.route === "editTeamMember") {
    try {
      const { departmentId, team, employeeCode, email, status, rights } =
        reqBody.data;

      // Step 1: Validate required fields
      if (
        !departmentId ||
        !team ||
        !employeeCode ||
        !email ||
        !status ||
        !rights
      ) {
        return NextResponse.json(
          { message: "Missing required fields" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }
      // Step 2: find department
      const department = await Department.findById(departmentId);

      if (!department) {
        return NextResponse.json({
          status: "fail",
          message: "Department not found",
        });
      }

      // Step 3: Update team in department
      const teamIndex = department.teams.findIndex(
        (t) => t.title.trim().toLowerCase() === team.title.trim().toLowerCase()
      );

      if (teamIndex === -1) {
        return NextResponse.json({
          status: "fail",
          message: "Team not found in department",
        });
      }

      // find team member and update their details
      const teamMemberIndex = department.teams[
        teamIndex
      ].attachedEmployees.findIndex((emp) => emp.employeeCode === employeeCode);

      if (teamMemberIndex === -1) {
        return NextResponse.json({
          status: "fail",
          message: "Team member not found in team",
        });
      }

      // Step 4: Update team member
      department.teams[teamIndex].attachedEmployees[teamMemberIndex] = {
        ...department.teams[teamIndex].attachedEmployees[teamMemberIndex],
        email: email,
        status: status,
        rights: {
          default: true,
        },
      };

      // if reqBody has password then update password
      if (reqBody.data.password) {
        const hashedPassword = await hashPassword(reqBody.data.password);
        department.teams[teamIndex].attachedEmployees[
          teamMemberIndex
        ].password = hashedPassword;
      }

      // Step 5: Update department
      department.markModified("teams");
      await department.save();
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

  if (reqBody.route === "deleteDepartment") {
    try {
      const { departmentId } = reqBody.data;

      // Step 1: Validate required fields
      if (!departmentId) {
        return NextResponse.json(
          { message: "Missing required fields" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }
      // Step 2: find department and delete
      // find department and if it admin then dont delete show error
      const department = await Department.findById(departmentId);
      if (!department) {
        return NextResponse.json({
          status: "fail",
          message: "Department not found",
        });
      }
      if (department.name === "admin") {
        return NextResponse.json({
          status: "fail",
          message: "Cannot delete admin department",
        });
      }

      const reponse = await Department.findByIdAndDelete(departmentId);

      if (!reponse) {
        return NextResponse.json({
          status: "fail",
          message: "Department not found",
        });
      }

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

  if (reqBody.route === "addBulkSuppliers") {
    console.log("Adding bulk suppliers...", reqBody.data);
    try {
      // Check if we should delete previous data (assuming a flag in reqBody)
      const deletePrevious = reqBody.deletePrevious === true;

      // Function to generate a unique productCode (e.g., PROD-XXXX)
      const generateSeries = async () => {
        const series = await Series.findOne();
        const isFirst = (await Supplier.countDocuments()) === 0;
        return isFirst ? 1 : series.supplier + 1;
      };

      // If deletePrevious is true, remove all existing suppliers
      if (deletePrevious) {
        await Supplier.deleteMany({});
        // Reset the series supplierCode to 0 since we're starting fresh
        await Series.updateOne({}, { $set: { supplier: 0 } });
      }

      for (const item of reqBody.data) {
        // Check if product code already exists
        const isExistCode = await Supplier.findOne({
          supplierId: item.supplierId,
        });
        if (isExistCode) {
          return NextResponse.json(
            {
              status: "fail",
              message: `Supplier already exists with this supplier code! use another supplier code! ID:${item.supplierId}`,
            },
            { status: StatusCodes.BAD_REQUEST }
          );
        }

        // Generate unique productCode and add it to the item
        const supplierCode = await generateSeries();

        // create object to upload
        const obj = {
          type: item.type,
          category: item.category,
          subCategory: item.subCategory,
          name: item.name,
          supplierId: item.supplierId,
          email: item.email,
          contactNumber: item.contactNumber,
          alternativeContactNumber: item.alternativeContactNumber,
          employeeInformed: { isRefer: "No", referBy: "", referId: "" },
          gender: item.gender,
          streetAddress: item.streetAddress,
          city: item.city,
          pinCode: item.pinCode,
          country: item.country,
          state: item.state,
          billingAddressSame: item.billingAddressSame,
          image: item.image,
          imagePublicId: item.imagePublicId,
          supplierSeries: supplierCode,
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

        // Create and save new product
        const supplier = new Supplier(obj);
        await supplier.save();
        // Update series
        await Series.updateOne({}, { $set: { supplier: supplierCode } });
      }

      return NextResponse.json(
        {
          status: "success",
          message: "All suppliers added successfully",
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

  if (reqBody.route === "addBulkSkus") {
    console.log("Adding bulk product...", reqBody.data);
    try {
      // Check if we should delete previous data (assuming a flag in reqBody)
      const deletePrevious = reqBody.deletePrevious === true;

      // Function to generate a unique productCode (e.g., PROD-XXXX)
      const generateSeries = async () => {
        const series = await Series.findOne();
        const isFirst = (await Product.countDocuments()) === 0;
        return isFirst ? 1 : series.productCode + 1;
      };

      // If deletePrevious is true, remove all existing suppliers
      if (deletePrevious) {
        await Product.deleteMany({});
        // Reset the series productCode to 0 since we're starting fresh
        await Series.updateOne({}, { $set: { productCode: 0 } });
      }

      for (const item of reqBody.data) {
        // Check if product code already exists
        const isExistCode = await Product.findOne({
          skucode: item.skucode,
        });
        if (isExistCode) {
          return NextResponse.json(
            {
              status: "fail",
              message: `Product already exists with this sku code! use another sku code! ID:${item.skucode}`,
            },
            { status: StatusCodes.BAD_REQUEST }
          );
        }

        // Generate unique productCode and add it to the item
        const productCode = await generateSeries();

        // create object to upload
        const obj = {
          productName: item.productName,
          category: item.category,
          subCategory: item.subCategory,
          shortDescription: item.shortDescription,
          longDescription: item.longDescription,
          data: [],
          type: item.type,
          image: item.image,
          imagePublicId: item.imagePublicId,
          skucode: item.skucode,
          productCode,
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

        if (item.subCategory === "Chargers") {
          obj.data.push({
            type: "Chargers",
            data: {
              isCharger: true,
              isCable: item.chargerType === "with-cable",
              chargerType: item.chargerType,
              cableType: item.cableType || "",
            },
          });
        }

        if (item.subCategory === "Lithium") {
          obj.data.push({
            type: "Lithium",
            data: {
              lithiumType: item.lithiumType,
            },
          });
        }

        // Create and save new product
        const product = new Product(obj);
        await product.save();
        // Update series
        await Series.updateOne({}, { $set: { productCode } });
      }

      return NextResponse.json(
        {
          status: "success",
          message: "All products added successfully",
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

  if (reqBody.route === "getSupplierList") {
    console.log("Fetching supplier list...");
    try {
      const List = await Supplier.find({}).sort({
        // createdAt: -1,
      });

      console.log("Supplier list fetched successfully:", List.length);

      return NextResponse.json({
        status: "success",
        message: "return successfully",
        data: List,
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
        totalOrdersAverage,
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
