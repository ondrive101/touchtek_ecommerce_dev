"use server";
import { revalidatePath } from "next/cache";
import { api } from "@/config/axios.config";

export async function revalidateCurrentPath(path) {
  revalidatePath(path);
}

//ERROR CODE:100
//ROUTE: /superadmin/controller/image
//FROM: /multi-level/inventory/stock/add-item
export async function createNewSku_Inventory(formData, session) {
  try {
    const payload = new FormData();
    for (const [key, value] of formData.entries()) {
      payload.append(key, value);
    }
    payload.append("route", "createNewSku");
    payload.append("folder", "inventory");
    payload.append("session", JSON.stringify(session));

    console.log("Test response:", payload);
    const response = await api.post("/superadmin/controller/image", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    //   const response = await createNewSku_Inventory(formData,session);
    revalidatePath("/multi-level/inventory/stock/main");
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

//ERROR CODE:101
//ROUTE: /superadmin/controller/main
//FROM: /multi-level/inventory/stock
export async function getProductList_Inventory(session) {
  try {
    //remove image field from session
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "getProductList",
      session: sessionNew,
    };

    console.log("Payload action:", payload);
    const response = await api.post("/superadmin/controller/main", payload);
    revalidatePath("/multi-level/inventory/stock");
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
        "Something went wrong! CODE:101",
    };
  }
}

//ERROR CODE:102
//ROUTE: /superadmin/controller/main
//FROM: /multi-level/inventory/stock
export async function deleteProduct_Inventory(id, session) {
  try {
    //remove image field from session
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "deleteProduct",
      id,
      session: sessionNew,
    };

    console.log("Payload action:", payload);
    const response = await api.post("/superadmin/controller/main", payload);
    revalidatePath("/inventory/stock");
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    return {
      status: "fail",
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        error.response?.data?.error ||
        "Something went wrong! CODE:102",
    };
  }
}

//ERROR CODE:103
//ROUTE: /superadmin/controller/main
//FROM: /employee
export async function createEmployee(formData, session) {
  try {
    const payload = new FormData();
    for (const [key, value] of formData.entries()) {
      payload.append(key, value);
    }
    payload.append("route", "createEmployee");
    payload.append("folder", "employee");
    payload.append("session", JSON.stringify(session));

    console.log("Payload action", payload);
    const response = await api.post("/superadmin/controller/image", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error) {
    console.error("Error creating employee:", error);
    return {
      status: "fail",
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        error.response?.data?.error ||
        "Something went wrong! CODE:103",
    };
  }
}

//ERROR CODE:104
//ROUTE: /superadmin/controller/main
//FROM: /employee
export async function getEmployeeList(session) {
  try {
    //remove image field from session
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "getEmployeeList",
      session: sessionNew,
    };

    // console.log("Payload action:", payload);
    const response = await api.post("/superadmin/controller/main", payload);
    // revalidatePath("/employee");
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
        "Something went wrong! CODE:104",
    };
  }
}

//ERROR CODE:102
//ROUTE: /superadmin/controller/main
//FROM: /multi-level/inventory/stock
export async function deleteEmployee(id, session) {
  try {
    //remove image field from session
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "deleteEmployee",
      id,
      session: sessionNew,
    };

    console.log("Payload action:", payload);
    const response = await api.post("/superadmin/controller/main", payload);
    revalidatePath("/employee");
    return response.data;
  } catch (error) {
    console.error("Error deleting employee:", error);
    return {
      status: "fail",
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        error.response?.data?.error ||
        "Something went wrong! CODE:102",
    };
  }
}

//ERROR CODE:105
//ROUTE: /superadmin/controller/main
//FROM: /employee
export async function addBulkEmployee(data, session) {
  try {
    //remove image field from session
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "addBulkEmployee",
      data,
      deletePrevious: true,
      session: sessionNew,
    };

    console.log("Payload action:", payload);
    const response = await api.post("/superadmin/controller/main", payload);
    revalidatePath("/employee");
    return response.data;
  } catch (error) {
    console.error("Error adding bulk employee:", error);
    return {
      status: "fail",
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        error.response?.data?.error ||
        "Something went wrong! CODE:105",
    };
  }
}

//ERROR CODE:106
//ROUTE: /superadmin/controller/image
//FROM: /multi-level/sales/customers
export async function createNewCustomer_Sales(formData, session) {
  try {
    const payload = new FormData();
    for (const [key, value] of formData.entries()) {
      payload.append(key, value);
    }
    payload.append("route", "createNewCustomer");
    payload.append("folder", "sales/customers");
    payload.append("session", JSON.stringify(session));

    console.log("Payload action:", payload);
    const response = await api.post("/superadmin/controller/image", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error) {
    console.error("Error creating new customer:", error);
    return {
      status: "fail",
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        error.response?.data?.error ||
        "Something went wrong! CODE:106",
    };
  }
}

//ERROR CODE:107
//ROUTE: /superadmin/controller/main
//FROM: /multi-level/sales/customer
export async function getCustomerList_Sales(session) {
  try {
    //remove image field from session
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "getCustomerList",
      session: sessionNew,
    };

    console.log("Payload action:", payload);
    const response = await api.post("/superadmin/controller/main", payload);
    revalidatePath("/multi-level/sales/customers/main");
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
        "Something went wrong! CODE:107",
    };
  }
}

//ERROR CODE:108
//ROUTE: /superadmin/controller/main
//FROM: /multi-level/sales/customers
export async function deleteCustomer(id, session) {
  try {
    //remove image field from session
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "deleteCustomer",
      id,
      session: sessionNew,
    };

    // console.log("Payload action:", payload);
    const response = await api.post("/superadmin/controller/main", payload);
    revalidatePath("/multi-level/sales/customers/main");
    return response.data;
  } catch (error) {
    console.error("Error deleting customer:", error);
    return {
      status: "fail",
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        error.response?.data?.error ||
        "Something went wrong! CODE:108",
    };
  }
}

//ERROR CODE:109
//ROUTE: /superadmin/controller/main
//FROM: /multi-level/sales/customers
export async function addBulkCustomers(data, session) {
  try {
    //remove image field from session
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "addBulkCustomers",
      data,
      deletePrevious: true,
      session: sessionNew,
    };

    // console.log("Payload action:", payload);

    const response = await api.post("/superadmin/controller/main", payload);
    revalidatePath("/multi-level/sales/customers");
    return response.data;
  } catch (error) {
    console.error("Error adding bulk customers:", error);
    return {
      status: "fail",
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        error.response?.data?.error ||
        "Something went wrong! CODE:105",
    };
  }
}

//ERROR CODE:110
//ROUTE: /superadmin/controller/main
//FROM: /users
export async function createDepartment(data, session) {
  try {
    //remove image field from session
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "createDepartment",
      data,
      session: sessionNew,
    };

    console.log("Payload action:", payload);
    const response = await api.post("/superadmin/controller/main", payload);
    revalidatePath("/users");
    return response.data;
  } catch (error) {
    console.error("Error creating department:", error);
    return {
      status: "fail",
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        error.response?.data?.error ||
        "Something went wrong! CODE:110",
    };
  }
}

//ERROR CODE:111
//ROUTE: /superadmin/controller/main
//FROM: /users
export async function getDepartmentList(session) {
  try {
    //remove image field from session
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "getDepartmentList",
      session: sessionNew,
    };

    // console.log("Payload action:", payload);
    const response = await api.post("/superadmin/controller/main", payload);
    revalidatePath("/users");
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
        "Something went wrong! CODE:111",
    };
  }
}

//ERROR CODE:112
//ROUTE: /superadmin/controller/main
//FROM: /users/:id
export async function getDepartmentById(id, session) {
  try {
    //remove image field from session
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "getDepartmentById",
      id,
      session: sessionNew,
    };

    // console.log("Payload action:", payload);
    const response = await api.post("/superadmin/controller/main", payload);
    revalidatePath("/users");
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
        "Something went wrong! CODE:112",
    };
  }
}

//ERROR CODE:113
//ROUTE: /superadmin/controller/main
//FROM: /users/:id
export async function attachEmployee(data, session) {
  try {
    //remove image field from session
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "attachEmployees",
      data,
      session: sessionNew,
    };

    // console.log("Payload action:", payload);
    const response = await api.post("/superadmin/controller/main", payload);
    // revalidatePath("/users");
    return response.data;
  } catch (error) {
    console.error("Error attaching employee:", error);
    return {
      status: "fail",
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        error.response?.data?.error ||
        "Something went wrong! CODE:113",
    };
  }
}

//ERROR CODE:114
//ROUTE: /superadmin/controller/main
//FROM: /users/:id
export async function detachEmployee(data, session) {
  try {
    //remove image field from session
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "detachEmployee",
      data,
      session: sessionNew,
    };

    // console.log("Payload action:", payload);
    const response = await api.post("/superadmin/controller/main", payload);
    // revalidatePath("/users");
    return response.data;
  } catch (error) {
    console.error("Error detaching employee:", error);
    return {
      status: "fail",
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        error.response?.data?.error ||
        "Something went wrong! CODE:113",
    };
  }
}

//ERROR CODE:115
//ROUTE: /superadmin/controller/main
//FROM: /users/:id
export async function createTeam(data, session) {
  try {
    //remove image field from session
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "createTeam",
      data,
      session: sessionNew,
    };

    // console.log("Payload action:", payload);
    const response = await api.post("/superadmin/controller/main", payload);
    // revalidatePath("/users");
    return response.data;
  } catch (error) {
    console.error("Error creating team:", error);
    return {
      status: "fail",
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        error.response?.data?.error ||
        "Something went wrong! CODE:115",
    };
  }
}

//ERROR CODE:116
//ROUTE: /superadmin/controller/main
//FROM: /users/:id
export async function deleteTeam(data, session) {
  try {
    //remove image field from session
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "deleteTeam",
      data,
      session: sessionNew,
    };

    // console.log("Payload action:", payload);
    const response = await api.post("/superadmin/controller/main", payload);
    // revalidatePath("/users");
    return response.data;
  } catch (error) {
    console.error("Error deleting team:", error);
    return {
      status: "fail",
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        error.response?.data?.error ||
        "Something went wrong! CODE:116",
    };
  }
}

//ERROR CODE:117
//ROUTE: /superadmin/controller/main
//FROM: /users/:id
export async function editTeam(data, session) {
  try {
    //remove image field from session
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "editTeam",
      data,
      session: sessionNew,
    };

    // console.log("Payload action:", payload);
    const response = await api.post("/superadmin/controller/main", payload);
    // revalidatePath("/users");
    return response.data;
  } catch (error) {
    console.error("Error edit team:", error);
    return {
      status: "fail",
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        error.response?.data?.error ||
        "Something went wrong! CODE:117",
    };
  }
}

//ERROR CODE:117
//ROUTE: /superadmin/controller/main
//FROM: /users/:id
export async function editTeamMember(data, session) {
  try {
    //remove image field from session
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "editTeamMember",
      data,
      session: sessionNew,
    };

    // console.log("Payload action:", payload);
    const response = await api.post("/superadmin/controller/main", payload);
    // revalidatePath("/users");
    return response.data;
  } catch (error) {
    console.error("Error edit team member:", error);
    return {
      status: "fail",
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        error.response?.data?.error ||
        "Something went wrong! CODE:118",
    };
  }
}

//ERROR CODE:117
//ROUTE: /superadmin/controller/main
//FROM: /users/:id
export async function deleteDepartment(data, session) {
  try {
    //remove image field from session
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "deleteDepartment",
      data,
      session: sessionNew,
    };

    // console.log("Payload action:", payload);
    const response = await api.post("/superadmin/controller/main", payload);
    revalidatePath("/users");
    return response.data;
  } catch (error) {
    console.error("Error deleting department:", error);
    return {
      status: "fail",
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        error.response?.data?.error ||
        "Something went wrong! CODE:117",
    };
  }
}

//ERROR CODE:118
//ROUTE: /superadmin/controller/main
//FROM: /inventory/:add-bulk-sku
export async function addBulkSkus(data, session) {
  try {
    //remove image field from session
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "addBulkSkus",
      data,
      deletePrevious: true,
      session: sessionNew,
    };

    console.log("Payload action:", payload);
    const response = await api.post("/superadmin/controller/main", payload);
    revalidatePath("/multi-level/inventory/stock/main");
    return response.data;
  } catch (error) {
    console.error("Error adding bulk products:", error);
    return {
      status: "fail",
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        error.response?.data?.error ||
        "Something went wrong! CODE:118",
    };
  }
}

//ERROR CODE:119
//ROUTE: /superadmin/controller/image
//FROM: /multi-level/purchase/vendors/main
export async function createSupplier(formData, session) {
  try {
    const payload = new FormData();
    for (const [key, value] of formData.entries()) {
      payload.append(key, value);
    }
    payload.append("route", "createSupplier");
    payload.append("folder", "supplier");
    payload.append("session", JSON.stringify(session));

    console.log("Test response:", payload);
    const response = await api.post("/superadmin/controller/image", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    //   const response = await createNewSku_Inventory(formData,session);
    revalidatePath("/multi-level/purchase/vendors/main");
    return response.data;
  } catch (error) {
    console.error("Error creating new Supplier:", error);
    return {
      status: "fail",
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        error.response?.data?.error ||
        "Something went wrong! CODE:119",
    };
  }
}

//ERROR CODE:120
//ROUTE: /superadmin/controller/main
//FROM: /inventory/:add-bulk-sku
export async function addBulkSuppliers(data, session) {
  try {
    //remove image field from session
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "addBulkSuppliers",
      data,
      deletePrevious: true,
      session: sessionNew,
    };

    console.log("Payload action:", payload);
    const response = await api.post("/superadmin/controller/main", payload);
    revalidatePath("/multi-level/purchase/vendors/main");
    return response.data;
  } catch (error) {
    console.error("Error adding bulk suppliers:", error);
    return {
      status: "fail",
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        error.response?.data?.error ||
        "Something went wrong! CODE:120",
    };
  }
}

//ERROR CODE:121
//ROUTE: /superadmin/controller/main
//FROM: /multi-level/purchase/vendors
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

    console.log("Payload action:", payload);
    const response = await api.post("/superadmin/controller/main", payload);
    revalidatePath("/multi-level/purchase/vendors/main");
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
        "Something went wrong! CODE:121",
    };
  }
}

//ERROR CODE:122
//ROUTE: /kanban/main
//FROM: /kanban
export async function createBoard(data, session) {
  try {
    //remove image field from session
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "createBoard",
      data,
      session: sessionNew,
    };

    console.log("Payload action:", payload);
    const response = await api.post("/kanban/main", payload);

    return response.data;
  } catch (error) {
    console.error("Error creating board:", error);
    return {
      status: "fail",
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        error.response?.data?.error ||
        "Something went wrong! CODE:122",
    };
  }
}

//ERROR CODE:123
//ROUTE: /kanban/main
//FROM: /kanban
export async function getBoards(filter, session) {
  try {
    //remove image field from session
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "getBoards",
      data: { filter },
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
        "Something went wrong! CODE:123",
    };
  }
}

//ERROR CODE:124
//ROUTE: /kanban/main
//FROM: /kanban
export async function deleteBoard(data, session) {
  try {
    //remove image field from session
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "deleteBoard",
      data,
      session: sessionNew,
    };

    // console.log("Payload action:", payload);
    const response = await api.post("/kanban/main", payload);
    return response.data;
  } catch (error) {
    console.error("Error deleting board:", error);
    return {
      status: "fail",
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        error.response?.data?.error ||
        "Something went wrong! CODE:124",
    };
  }
}

//ERROR CODE:125
//ROUTE: /kanban/main
//FROM: /kanban
export async function editBoard(data, session) {
  try {
    //remove image field from session
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "editBoard",
      data,
      session: sessionNew,
    };

    console.log("Payload action:", payload);
    const response = await api.post("/kanban/main", payload);

    return response.data;
  } catch (error) {
    console.error("Error editing board:", error);
    return {
      status: "fail",
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        error.response?.data?.error ||
        "Something went wrong! CODE:125",
    };
  }
}

//ERROR CODE:126
//ROUTE: /kanban/main
//FROM: /kanban
export async function swapBoard(data, session) {
  try {
    //remove image field from session
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "swapBoard",
      data,
      session: sessionNew,
    };

    console.log("Payload action:", payload);
    const response = await api.post("/kanban/main", payload);

    return response.data;
  } catch (error) {
    console.error("Error swapping board:", error);
    return {
      status: "fail",
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        error.response?.data?.error ||
        "Something went wrong! CODE:126",
    };
  }
}

export async function swapTask(data, session) {
  try {
    //remove image field from session
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "swapTask",
      data,
      session: sessionNew,
    };

    // console.log("Payload action:", payload);
    const response = await api.post("/kanban/main", payload);

    return response.data;
  } catch (error) {
    console.error("Error swapping task:", error);
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

//ERROR CODE:127
//ROUTE: /kanban/main
//FROM: /kanban
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
        "Something went wrong! CODE:127",
    };
  }
}

//ERROR CODE:128
//ROUTE: /kanban/main
//FROM: /kanban
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
        "Something went wrong! CODE:128",
    };
  }
}

//ERROR CODE:129
//ROUTE: /kanban/main
//FROM: /kanban
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


export async function getProductBy_Id(id, session) {
  try {
    console.log('called')
    //remove image field from session
    const sessionNew = {
      user: (({ image, ...rest }) => rest)(session.user),
    };

    const payload = {
      route: "getProductBy_Id",
      id,
      session: sessionNew,
    };

    console.log("Payload action:", payload);
    const response = await api.post("/superadmin/controller/main", payload);
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



export async function getCustomerBy_Id(id, session) {
  try {
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
    const response = await api.post("/superadmin/controller/main", payload);
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
