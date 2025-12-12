"use server";
import { revalidatePath } from "next/cache";
import { api } from "@/config/axios.config";

export async function revalidateCurrentPath(path) {
  revalidatePath(path);
}

export async function getCustomerList(session) {
  try {
    //remove image field from session
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user)
    };
    
    const payload = {
      route: "getCustomerList",
      session: sessionNew
    };
    
      // console.log("Payload action:", payload);
      const response = await api.post("/account/controller/main", payload);
      revalidatePath("/orders/outward");
    return response.data;
  } catch (error) {
    console.error("Error fetching list:", error);
    return { status: "fail", success: false, message: error?.response?.data?.message || error?.message || error?.response?.data?.error || "Something went wrong!" };
  }
}
export async function getSupplierList(session) {
  try {
    //remove image field from session
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user)
    };
    
    const payload = {
      route: "getSupplierList",
      session: sessionNew
    };
    
      // console.log("Payload action:", payload);
      const response = await api.post("/account/controller/main", payload);
    return response.data;
  } catch (error) {
    console.error("Error fetching list:", error);
    return { status: "fail", success: false, message: error?.response?.data?.message || error?.message || error?.response?.data?.error || "Something went wrong!" };
  }
}
export async function getCustomerBy_Id(id, session) {
  try {
    console.log('called')
    //remove image field from session
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "getCustomerBy_Id",
      id,
      session: sessionNew,
    };

    console.log("Payload action:", payload);
    const response = await api.post("/account/controller/main", payload);
    return response.data;
  } catch (error) {
    console.error("Error fetching customer:", error);
    return {
      status: "fail",
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        error.response?.data?.error ||
        "Something went wrong!",
    };
  }
}
export async function getSupplierBy_Id(id, session) {
  try {
    console.log('called')
    //remove image field from session
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "getSupplierBy_Id",
      id,
      session: sessionNew,
    };

    console.log("Payload action:", payload);
    const response = await api.post("/account/controller/main", payload);
    return response.data;
  } catch (error) {
    console.error("Error fetching list:", error);
    return {
      status: "fail",
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        error.response?.data?.error ||
        "Something went wrong!",
    };
  }
}


