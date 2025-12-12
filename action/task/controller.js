"use server";
import { revalidatePath } from "next/cache";
import { api } from "@/config/axios.config";

export async function revalidateCurrentPath(path) {
  revalidatePath(path);
}


export async function getProjects(session) {
  try {
    //remove image field from session
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "getProjects",
      session: sessionNew,
    };

    // console.log("Payload action:", payload);
    const response = await api.post("/kanban/main", payload);

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

export async function deleteProject(id,session) {
  try {
    
    //remove image field from session
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "deleteProject",
      id,
      session: sessionNew,
    };

    // console.log("Payload action:", payload);
    const response = await api.post("/kanban/main", payload);
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

export async function editProject(data,session) {
  try {
    //remove image field from session
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "editProject",
      data,
      session: sessionNew,
    };

    // console.log("Payload action:", payload);
    const response = await api.post("/kanban/main", payload);
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


export async function createUpdateProject(data,session) {
  try {
    //remove image field from session
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "createUpdateProject",
      data,
      session: sessionNew,
    };

    // console.log("Payload action:", payload);
    const response = await api.post("/kanban/main", payload);
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


export async function createUpdateTodo(data,session) {
  try {
    //remove image field from session
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "createUpdateTodo",
      data,
      session: sessionNew,
    };

    // console.log("Payload action:", payload);
    const response = await api.post("/kanban/main", payload);
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


export async function deleteTodo(data,session) {
  try {
    
    //remove image field from session
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "deleteTodo",
      data,
      session: sessionNew,
    };

    // console.log("Payload action:", payload);
    const response = await api.post("/kanban/main", payload);
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

// --------------------------------------------------------------------------
export async function getTaskGroups(session) {
  try {
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "getTaskGroups",
      session: sessionNew,
    };

    const response = await api.post("/kanban/main", payload);

    return response.data;
  } catch (error) {
    console.error("Error fetching task groups:", error);
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

export async function createTaskProject(data,session) {
  try {
    //remove image field from session
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "createTaskProject",
      data,
      session: sessionNew,
    };

    console.log("Payload action:", payload);
    const response = await api.post("/kanban/main", payload);
    return response.data;
  } catch (error) {
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

export async function getTaskProject(id, filter, session) {

  try {
    console.log('calling task projects')
    //remove image field from session
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "getTaskProject",
      id,
      filter,
      session: sessionNew,
    };

    const response = await api.post("/kanban/main", payload);

    return response.data;
  } catch (error) {
    console.error("Error fetching task project:", error);
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

export async function getDepartmentEmployees(session) {
  try {
    //remove image field from session
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "getDepartmentEmployees",
      session: sessionNew,
    };

    // console.log("Payload action:", payload);
    const response = await api.post("/kanban/main", payload);
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

export async function getEmployeeAndProjectist(session) {
  try {
    //remove image field from session
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "getEmployeeAndProjects",
      session: sessionNew,
    };

    // console.log("Payload action:", payload);
    const response = await api.post("/kanban/main", payload);
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

export async function createTask(data, session) {
  try {
    //remove image field from session
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "createTask",
      data,
      session: sessionNew,
    };

    console.log("Payload action for create task:", payload);
    const response = await api.post("/kanban/main", payload);
    return response.data;
  } catch (error) {
    console.error("Error creating task:", error);
    return {
      status: "fail",
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        error.response?.data?.error ||
        "Something went wrong",
    };
  }
}

export async function updateTask(data, session) {
  try {
    //remove image field from session
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "updateTask",
      data,
      session: sessionNew,
    };

    console.log("Payload action for update task:", payload);
    const response = await api.post("/kanban/main", payload);
    return response.data;
  } catch (error) {
    console.error("Error updating task:", error);
    return {
      status: "fail",
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        error.response?.data?.error ||
        "Something went wrong! CODE:129",
    };
  }
}

export async function addTaskFile(formData, session) {
  try {
    const payload = new FormData();
    for (const [key, value] of formData.entries()) {
      payload.append(key, value);
    }
    payload.append("route", "addTaskFile");
    payload.append("session", JSON.stringify(session));

    console.log("Test response:", payload);
    const response = await api.post("/kanban/image", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating new SKU:", error);
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

export async function updateSprint(data,session) {
  try {
    //remove image field from session
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "updateSprint",
      data,
      session: sessionNew,
    };

    console.log("Payload action:", payload);
    const response = await api.post("/kanban/main", payload);
    return response.data;
  } catch (error) {
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
// --------------------------------------------------------------------------

