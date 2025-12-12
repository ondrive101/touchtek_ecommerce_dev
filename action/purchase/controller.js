"use server";
import { revalidatePath } from "next/cache";
import { api } from "@/config/axios.config";

//ERROR CODE:101
//ROUTE: /purchase/controller/main
//FROM: /orders
export async function getSupplierList(session) {
  try {
    //remove image field from session
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "getSupplierList",
      session: sessionNew,
    };

    // console.log("Payload action:", payload);
    const response = await api.post("/purchase/controller/main", payload);
    revalidatePath("/orders");
    return response.data;
  } catch (error) {
    console.error("Error fetching list:", error);
    return {
      status: "fail",
      success: false,
      message:
        error.response.data.message ||
        error.message ||
        error.response.data.error ||
        "Something went wrong! CODE:102",
    };
  }
}

//ERROR CODE:102
//ROUTE: /purchase/controller/main
//FROM: /orders
export async function getProductList(session) {
  try {
    //remove image field from session
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "getProductList",
      session: sessionNew,
    };

    // console.log("Payload action:", payload);
    const response = await api.post("/purchase/controller/main", payload);
    revalidatePath("/orders");
    return response.data;
  } catch (error) {
    console.error("Error fetching list:", error);
    return {
      status: "fail",
      success: false,
      message:
        error.response.data.message ||
        error.message ||
        error.response.data.error ||
        "Something went wrong! CODE:103",
    };
  }
}

//ERROR CODE:103
//ROUTE: /superadmin/controller/main
//FROM: /orders
export async function createPurchaseOrder(data, session) {
  try {
    //remove image field from session
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "createPurchaseOrder",
      data,
      session: sessionNew,
    };

    // console.log("Payload action:", payload);
    const response = await api.post("/purchase/controller/main", payload);
    revalidatePath("/orders");
    return response.data;
  } catch (error) {
    console.error("Error creating purchase order:", error);
    return {
      status: "fail",
      success: false,
      message:
        error.response.data.message ||
        error.message ||
        error.response.data.error ||
        "Something went wrong! CODE:103",
    };
  }
}

//ERROR CODE:104
//ROUTE: /purchase/controller/main
//FROM: /orders
export async function getPurchaseOrderList(session) {
  try {
    //remove image field from session
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "getPurchaseOrderList",
      session: sessionNew,
    };

    // console.log("Payload action:", payload);
    const response = await api.post("/purchase/controller/main", payload);
    revalidatePath("/orders");
    return response.data;
  } catch (error) {
    console.error("Error fetching list:", error);
    return {
      status: "fail",
      success: false,
      message:
        error.response.data.message ||
        error.message ||
        error.response.data.error ||
        "Something went wrong! CODE:104",
    };
  }
}

//ERROR CODE:105
//ROUTE: /purchase/controller/main
//FROM: /orders
export async function deletePurchaseOrder(id, session) {
  try {
    //remove image field from session
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "deletePurchaseOrder",
      id,
      session: sessionNew,
    };

    // console.log("Payload action:", payload);
    const response = await api.post("/purchase/controller/main", payload);
    revalidatePath("/orders");
    return response.data;
  } catch (error) {
    console.error("Error deleting purchase order:", error);
    return {
      status: "fail",
      success: false,
      message:
        error.response.data.message ||
        error.message ||
        error.response.data.error ||
        "Something went wrong! CODE:105",
    };
  }
}

//ERROR CODE:106
//ROUTE: /superadmin/controller/main
//FROM: /orders
export async function confirmPurchaseOrder(data, session, revalidateRoute) {
  try {
    //remove image field from session
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "confirmPurchaseOrder",
      data,
      session: sessionNew,
    };

    // console.log("Payload action:", payload);
    const response = await api.post("/purchase/controller/main", payload);
    revalidatePath(revalidateRoute);
    return response.data;
  } catch (error) {
    console.error("Error confirming purchase order:", error);
    return {
      status: "fail",
      success: false,
      message:
        error.response.data.message ||
        error.message ||
        error.response.data.error ||
        "Something went wrong! CODE:106",
    };
  }
}


//ERROR CODE:107
//ROUTE: /purchase/controller/main
//FROM: /orders
export async function deletePurchaseReceipt(data, session,revalidateRoute) {
  try {
    //remove image field from session
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "deletePurchaseReceipt",
      data,
      session: sessionNew,
    };

    // console.log("Payload action:", payload);
    const response = await api.post("/purchase/controller/main", payload);
    revalidatePath(revalidateRoute);
    return response.data;
  } catch (error) {
    console.error("Error deleting purchase order receipt:", error);
    return {
      status: "fail",
      success: false,
      message:
        error.response.data.message ||
        error.message ||
        error.response.data.error ||
        "Something went wrong! CODE:107",
    };
  }
}