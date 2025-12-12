"use server";

import { uploadImage } from "@/action/cloudinary";
import {createNewSeller_Purchase,createNewOrder_Purchase} from "@/config/main.config.js";
import { revalidatePath } from "next/cache";


export async function createNewSellerAction_Purchase(data, session) {
  try {
    const response = await createNewSeller_Purchase(data,session);
    revalidatePath("/purchase/orders/create-new-order");
    return response;
  } catch (error) {
    console.error("Error creating new seller:", error);
    return { status: "error", success: false, message: error.message };
  }
}

export async function createNewOrderAction_Purchase(data, session) {
  try {
    const response = await createNewOrder_Purchase(data,session);
    revalidatePath("/purchase/orders/create-new-order");
    return response;
  } catch (error) {
    console.error("Error creating new seller:", error);
    return { status: "error", success: false, message: error.message };
  }
}

