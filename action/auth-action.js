"use server";
import { registerUser, emailVerifyUser } from "@/config/user.config";
import { revalidatePath } from "next/cache";

export const addUser = async (data) => {
  
  try {
    const response = await registerUser(data);
    return response;
  } catch (error) {
    console.error("Error creating new user:", error);
    return { status: "fail", success: false, message: error.message };
  }
};
export const verifyUser = async (token) => {
  const response = await emailVerifyUser(token);
  
  return response;
};
