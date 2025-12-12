"use server";

import { uploadImage } from "@/action/cloudinary";
import {createCustomer_Sales,deleteCustomer_Sales,createSalesOrder_Sales,createReturnOrder_Sales} from "@/config/main.config.js";
import { revalidatePath } from "next/cache";

export async function createNewCustomerAction_Sales(formData, session) {
  try {
//     const excludeFields = ["profileImage"]; // Fields to exclude

// const obj = Object.fromEntries(
//   [...formData.entries()].filter(([key]) => !excludeFields.includes(key))
// );

    // Handle profile image upload
    // const file = formData.get("profileImage");
    // if (file instanceof File) {
    //   const options = {
    //     folder: "customer_profile",  // Set custom folder for the image
    //   };

    //   // Call the utility function to upload the image with options
    //   const result = await uploadImage(file, options);
    //   obj.image = result.url;
    //   obj.imagePublicId = result.public_id;
    // } else {
    //   return { status: "fail", message: "Profile image is required" };
    // }




    // Here you would call your API to save the customer data
    const response = await createCustomer_Sales(formData,session);
   
    
    revalidatePath("/sales/customers/add-customer");
    return { status: "success", message: "Customer created successfully"};
  } catch (error) {
    console.error("Error creating new customer:", error);
    return { status: "fail", message: error.message };
  }
}


export async function deleteCustomerAction_Sales(id,session) {
  try {
    const response = await deleteCustomer_Sales(id,session);
    revalidatePath("/sales/customers");
    return response;
  } catch (error) {
    console.error("Error deleting customer:", error);
   
    return error.response.data;
  }
}

export async function createSalesOrderAction_Sales(data, session) {
  try {
    const response = await createSalesOrder_Sales(data,session);
    revalidatePath("/sales/orders/outwards");
    return response;
  } catch (error) {
    console.error("Error creating new seller:", error);
    return { status: "error", success: false, message: error.response.data.message || error.message };
  }
}
export async function createReturnOrderAction_Sales(data, session) {
  try {
    const response = await createReturnOrder_Sales(data,session);
    revalidatePath("/sales/orders/outwards");
    return response;
  } catch (error) {
    console.error("Error creating new return order:", error);
    return { status: "error", success: false, message: error.response.data.message || error.message };
  }
}
