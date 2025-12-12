"use server";
import { revalidatePath } from "next/cache";
import { api } from "@/config/axios.config";

export async function revalidateCurrentPath(path) {
  revalidatePath(path);
}

export async function getEmployeeList(session) {
  try {
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "getEmployeeList",
      session: sessionNew,
    };


    const response = await api.post("/reqQ/controller/main", payload);
    return response.data;
  } catch (error) {
    console.error("Error getting employee list:", error);
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


export async function getNotificationMessages(data, session) {
  try {
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "getNotificationMessages",
      data,
      session: sessionNew,
    };


    const response = await api.post("/reqQ/controller/main", payload);
    return response.data;
  } catch (error) {
    console.error("Error getting notification messages:", error);
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



export async function getUserProfile(session) {
  try {
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "getUserProfile",
      session: sessionNew,
    };


    const response = await api.post("/reqQ/controller/main", payload);
    return response.data;
  } catch (error) {
    console.error("Error getting user profile:", error);
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




export async function editProfile(data,session) {
  try {
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "editProfile",
      data,
      session: sessionNew,
    };


    const response = await api.post("/reqQ/controller/main", payload);
    return response.data;
  } catch (error) {
    console.error("Error getting employee list:", error);
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


export async function createStickyNote(data,session) {
  try {
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "createStickyNote",
      data,
      session: sessionNew,
      createdByDepartment: {
        employeeId: session.user.id,
        employeeCode: session.user.employeeCode,
        employeeName: session.user.name,
        employeeImage: session.user.image,
      },
    };


    const response = await api.post("/reqQ/controller/main", payload);
    return response.data;
  } catch (error) {
    console.error("Error creating sticky note:", error);
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

export async function getStickyNotes(session) {
  try {
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "getStickyNotes",
      session: sessionNew,
    };


    const response = await api.post("/reqQ/controller/main", payload);
    return response.data;
  } catch (error) {
    console.error("Error getting sticky notes:", error);
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
export async function updateStickyNote(data,session) {
  try {
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "updateStickyNote",
      data,
      session: sessionNew,
      createdByDepartment: {
        employeeId: session.user.id,
        employeeCode: session.user.employeeCode,
        employeeName: session.user.name,
        employeeImage: session.user.image,
      },
    };


    const response = await api.post("/reqQ/controller/main", payload);
    return response.data;
  } catch (error) {
    console.error("Error updating sticky note:", error);
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

export async function updateProfileImage(formData, session) {
  try {
    const payload = new FormData();
    for (const [key, value] of formData.entries()) {
      payload.append(key, value);
    }
    payload.append("route", "updateProfileImage");
    payload.append("folder", "profile");
    payload.append("session", JSON.stringify(session));

    console.log("Test response:", payload);
    const response = await api.post("/reqQ/controller/image", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating profile image:", error);
    return {
      status: "fail",
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        error.response?.data?.error ||
        "Something went wrong! CODE:100",
    };
  }
}

