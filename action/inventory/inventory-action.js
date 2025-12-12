"use server";

import { uploadImage } from "@/action/cloudinary";
import {
  createNewSku_Inventory,
  createNewSkus_Inventory,
  confirmPurchaseOrder_Inventory_Purchase,
  reConfirmPurchaseOrder_Inventory_Purchase,
  cancelPurchaseOrder_Inventory_Purchase,
  deletePurchaseOrder_Inventory_Purchase,
  confirmSalesOrder_Inventory_Sales,
  deleteSalesOrder_Inventory_Sales
} from "@/config/main.config.js";
import { revalidatePath } from "next/cache";

export async function createNewSkuAction_Inventory(formData, session) {
  try {
    // const obj = {
    //   productName: formData.get("productName"),
    //   skucode: formData.get("skucode"),
    //   category: formData.get("category"),
    //   subCategory: formData.get("subCategory"),
    //   shortDescription: formData.get("shortDescription"),
    //   longDescription: formData.get("longDescription"),
    //   image:"",
    //   imagePublicId:"",
    // }

    // const file = formData.get("image");
    // if (file instanceof File) {
    //   const options = {
    //     folder: "inventory_images",  // Set custom folder for the image
    //     // transformation: [
    //     //   { width: 500, height: 500, crop: "scale" } // Apply image transformations (optional)
    //     // ]
    //   };

    //   // Call the utility function to upload the image with options
    //   const result = await uploadImage(file, options);
    //   obj.image = result.url;
    //   obj.imagePublicId = result.public_id;

    // } else {
    //   return { status: "fail", message: "Image upload error occured" };
    // }

    // const response = await createNewSku_Inventory(obj,session);
    const response = await createNewSku_Inventory(formData,session);
    revalidatePath("/inventory/stock/add-item");
    return response;
  } catch (error) {
    console.error("Error creating new SKU:", error);
    return { status: "error", success: false, message: error.message };
  }
}

export async function createNewSkusAction_Inventory(data, session) {
  try {
    const response = await createNewSkus_Inventory(data,session);
    revalidatePath("/inventory/stock/add-items");
    return response;
  } catch (error) {
    console.error("Error creating new SKUs:", error);
    return { status: "error", success: false, message: error.message };
  }
}




//order-confirm,reconfirm,cancel,delete --------------start

export async function confirmPurchaseOrderAction_Inventory_Purchase(data, session) {
  try {
    const response = await confirmPurchaseOrder_Inventory_Purchase(data,session);
    revalidatePath(`/inventory/purchase/orders/confirm-order/${data.id}`);
    return response;
  } catch (error) {
    console.error("Error creating new SKUs:", error);
    return { status: "error", success: false, message: error.message };
  }
}


export async function reConfirmPurchaseOrderAction_Inventory_Purchase(id,session) {
  try {
    const response = await reConfirmPurchaseOrder_Inventory_Purchase(id,session);
    revalidatePath(`/inventory/purchase/orders`);
    return response;
  } catch (error) {
    console.error("Error reconfirming purchase order:", error);
    return { status: "error", success: false, message: error.response.data.message || error.message };
  }
}


export async function cancelPurchaseOrderAction_Inventory_Purchase(id,session) {
  try {
    const response = await cancelPurchaseOrder_Inventory_Purchase(id,session);
    revalidatePath(`/inventory/purchase/orders`);
    return response;
  } catch (error) {
    console.error("Error canceling purchase order:", error);
    return { status: "error", success: false, message: error.response.data.message || error.message };
  }
}


export async function deletePurchaseOrderAction_Inventory_Purchase(id,session) {
  try {
    const response = await deletePurchaseOrder_Inventory_Purchase(id,session);
    revalidatePath(`/inventory/purchase/orders`);
    return response;
  } catch (error) {
    console.error("Error deleting purchase order:", error);
    return { status: "error", success: false, message: error.response.data.message || error.message };
  }
}

//order-confirm,reconfirm,cancel,delete --------------end


//order-confirm,reconfirm,cancel,delete --------------start

export async function confirmSalesOrderAction_Inventory_Sales(data, session) {
  try {
    const response = await confirmSalesOrder_Inventory_Sales(data,session);
    revalidatePath(`/inventory/sales/orders`);
    return response;
  } catch (error) {
    console.error("Error confirming sales order:", error);
    return { status: "error", success: false, message: error.message };
  }
}

export async function deleteSalesOrderAction_Inventory_Sales(id, session) {
  try {
    const response = await deleteSalesOrder_Inventory_Sales(id,session);
    revalidatePath(`/inventory/sales/orders`);
    return response;
  } catch (error) {
    console.error("Error deleting sales order:", error);
    return { status: "error", success: false, message: error.message };
  }
}



//order-confirm,reconfirm,cancel,delete --------------end