"use server";
import {createUser_SuperAdmin,deleteUser_SuperAdmin,editUser_SuperAdmin} from "@/config/main.config.js";
import { revalidatePath } from "next/cache";



export async function getUserListAdminAction(currentPage, rowsPerPage,token) {
  try {
    const response = await getUserListAdmin(currentPage, rowsPerPage,token);
    revalidatePath("/super/users");
    return response;
  } catch (error) {
    console.error("Error getting list of users:", error);
   
    return error.response.data;
  }
}

export async function createUserAction_SuperAdmin(data,session) {
    try {
      const response = await createUser_SuperAdmin(data,session);
      revalidatePath("/super/users");
      return response;
    } catch (error) {
      console.error("Error creating user:", error);
     
      return error.response.data;
    }
}

export async function deleteUserAction_SuperAdmin(id,session) {
  try {
    const response = await deleteUser_SuperAdmin(id,session);
    revalidatePath("/super/users");
    return response;
  } catch (error) {
    console.error("Error creating user:", error);
   
    return error.response.data;
  }
}


export async function editUserAction_SuperAdmin(id,data,session) {
  try {
    const response = await editUser_SuperAdmin(id,data,session);
    revalidatePath("/super/users");
    return response;
  } catch (error) {
    console.error("Error creating user:", error);
   
    return error.response.data;
  }
}