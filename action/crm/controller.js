"use server";
import { revalidatePath } from "next/cache";
import { api } from "@/config/axios.config";

export async function revalidateCurrentPath(path) {
  revalidatePath(path);
}




//ERROR CODE:102
//ROUTE: /crm/controller/main
//FROM: /orders
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
      const response = await api.post("/crm/controller/main", payload);
      revalidatePath("/orders/outward");
    return response.data;
  } catch (error) {
    console.error("Error fetching list:", error);
    return { status: "fail", success: false, message: error.response.data.message || error.message || error.response.data.error || "Something went wrong! CODE:102" };
  }
}


//ERROR CODE:103
//ROUTE: /crm/controller/main
//FROM: /orders
export async function getProductList(session) {
  try {
    //remove image field from session
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user)
    };
    
    const payload = {
      route: "getProductList",
      session: sessionNew
    };
    
      // console.log("Payload action:", payload);
      const response = await api.post("/crm/controller/main", payload);
      revalidatePath("/orders/outward");
    return response.data;
  } catch (error) {
    console.error("Error fetching list:", error);
    return { status: "fail", success: false, message: error.response.data.message || error.message || error.response.data.error || "Something went wrong! CODE:103" };
  }
}


//ERROR CODE:104
//ROUTE: /crm/controller/main
//FROM: /orders
export async function createSalesOrder(data, session,revalidateRoute) {
  try {
    //remove image field from session
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "createSalesOrder",
      data,
      session: sessionNew,
    };

    // console.log("Payload action:", payload);
    const response = await api.post("/crm/controller/main", payload);
    revalidatePath(revalidateRoute);
    return response.data;
  } catch (error) {
    console.error("Error creating sales order:", error);
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
//ROUTE: /crm/controller/main
//FROM: /orders
export async function getSalesOrderList(session) {
  try {
    //remove image field from session
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "getSalesOrderList",
      session: sessionNew,
    };

    // console.log("Payload action:", payload);
    const response = await api.post("/crm/controller/main", payload);
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
        "Something went wrong! CODE:105",
    };
  }
}



//ERROR CODE:106
//ROUTE: /crm/controller/main
//FROM: /orders
export async function updateSalesOrderStage(data, session) {
  try {
    //remove image field from session
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "updateSalesOrderStage",
      data,
      session: sessionNew,
    };

    // console.log("Payload action:", payload);
    const response = await api.post("/crm/controller/main", payload);
    // revalidatePath(revalidateRoute);
    return response.data;
  } catch (error) {
    console.error("Error updating sales order:", error);
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
//ROUTE: /crm/controller/main
//FROM: /orders
export async function deleteCancelReOpenSalesOrder(data, session) {
  try {
    //remove image field from session
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "deleteCancelReopenSalesOrder",
      data,
      session: sessionNew,
    };

    // console.log("Payload action:", payload);
    const response = await api.post("/crm/controller/main", payload);
    return response.data;
  } catch (error) {
    console.error("Error deleting sales order:", error);
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




//ERROR CODE:108
//ROUTE: /crm/controller/main
//FROM: /orders
export async function createSalesReturnOrder(data, session,revalidateRoute) {
  try {
    //remove image field from session
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "createSalesReturnOrder",
      data,
      session: sessionNew,
    };

    // console.log("Payload action:", payload);
    const response = await api.post("/crm/controller/main", payload);
    revalidatePath(revalidateRoute);
    return response.data;
  } catch (error) {
    console.error("Error creating sales return order:", error);
    return {
      status: "fail",
      success: false,
      message:
        error.response.data.message ||
        error.message ||
        error.response.data.error ||
        "Something went wrong! CODE:108",
    };
  }
}





//ERROR CODE:109
//ROUTE: /crm/controller/main
//FROM: /orders
export async function updateSalesReturnOrderStage(data, session) {
  try {
    //remove image field from session
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "updateSalesReturnOrderStage",
      data,
      session: sessionNew,
    };

    // console.log("Payload action:", payload);
    const response = await api.post("/crm/controller/main", payload);
    // revalidatePath(revalidateRoute);
    return response.data;
  } catch (error) {
    console.error("Error updating sales order:", error);
    return {
      status: "fail",
      success: false,
      message:
        error.response.data.message ||
        error.message ||
        error.response.data.error ||
        "Something went wrong! CODE:109",
    };
  }
}











