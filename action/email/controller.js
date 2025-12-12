"use server";
import { revalidatePath } from "next/cache";
import { api } from "@/config/axios.config";

export async function revalidateCurrentPath(path) {
  revalidatePath(path);
}


//ROUTE: /email/main
//FROM: /email
export async function getMails(session) {
  try {
    //remove image field from session
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "getMails",
      session: sessionNew,
    };

    // console.log("Payload action:", payload);
    const response = await api.post("/email/main", payload);
    return response.data;
  } catch (error) {
    // console.error("Error fetching list:", error);
    return {
      status: "fail",
      success: false,
      message:
        error.response.data.message ||
        error.message ||
        error.response.data.error ||
        "Something went wrong!",
    };
  }
}

//ROUTE: /email/main
//FROM: /email
export async function getMailSetup(session) {
  try {
    //remove image field from session
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "getMailSetup",
      session: sessionNew,
    };

    // console.log("Payload action:", payload);
    const response = await api.post("/email/main", payload);
    return response.data;
  } catch (error) {
    console.error("Error fetching mail setup:", error);
    return {
      status: "fail",
      success: false,
      message:
        error.response.data.message ||
        error.message ||
        error.response.data.error ||
        "Something went wrong!",
    };
  }
}


//ROUTE: /email/main
//FROM: /email
export async function createMailSetup(data,session) {
  try {
    
    //remove image field from session
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "createMailSetup",
      data,
      session: sessionNew,
    };

    // console.log("Payload action:", payload);
    const response = await api.post("/email/main", payload);
    return response.data;
  } catch (error) {
    console.error("Error fetching mail setup:", error);
    return {
      status: "fail",
      success: false,
      message:
        error.response.data.message ||
        error.message ||
        error.response.data.error ||
        "Something went wrong!",
    };
  }
}


//Route: /email/main
//FROM: /email
export async function deleteMail(id,session) {
  try {
    
    //remove image field from session
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "deleteMail",
      id,
      session: sessionNew,
    };

    // console.log("Payload action:", payload);
    const response = await api.post("/email/main", payload);
    return response.data;
  } catch (error) {
    console.error("Error fetching mail delete:", error);
    return {
      status: "fail",
      success: false,
      message:
        error.response.data.message ||
        error.message ||
        error.response.data.error ||
        "Something went wrong!",
    };
  }
}

//Route: /email/main
//FROM: /email
export async function resetMailSetup(session) {
  try {

    console.log('called setup',session)

    
    
    //remove image field from session
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "resetMailSetup",
      session: sessionNew,
    };

    console.log("Payload action:", payload);
    const response = await api.post("/email/main", payload);
    return response.data;
  } catch (error) {
    console.error("Error fetching reset mail setup:", error);
    return {
      status: "fail",
      success: false,
      message:
        error.response.data.message ||
        error.message ||
        error.response.data.error ||
        "Something went wrong!",
    };
  }
}



//ROUTE: /email/main
//FROM: /email
export async function sendMail(data,session) {
  try {
    
    //remove image field from session
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "sendMail",
      data,
      session: sessionNew,
    };

    // console.log("Payload action:", payload);
    const response = await api.post("/email/main", payload);
    return response.data;
  } catch (error) {
    console.error("Error fetching mail send:", error);
    return {
      status: "fail",
      success: false,
      message:
        error.response.data.message ||
        error.message ||
        error.response.data.error ||
        "Something went wrong!",
    };
  }
}

