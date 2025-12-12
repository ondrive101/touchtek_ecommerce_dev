import { api } from "@/config/axios.config";

//by superadmin
export const getUsersList_SuperAdmin = async (session) => {
  try {
    const response = await api.post("/superadmin/users", {
      route: "getUsersList",
      session
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);

    throw error;
  }
};

//by superadmin
export const createUser_SuperAdmin = async (data,session) => {
  try {
  console.log(data, session)
    const response = await api.post("/superadmin/users", {
      route: "createUser",
      data,
      session
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);

    throw error;
  }
};


//by superadmin
export const deleteUser_SuperAdmin = async (id,session) => {
  try {
    const response = await api.post("/superadmin/users", {
      route: "deleteUser",
      id,
      session
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);

    throw error;
  }
};

//by superadmin
export const editUser_SuperAdmin = async (id,data,session) => {
  try {
  
    const response = await api.post("/superadmin/users", {
      route: "editUser",
      id,
      data,
      session
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);

    throw error;
  }
};



//by inventory
export const createNewSku_Inventory = async (formData,session) => {
  try {
    const payload = new FormData();
    for (const [key, value] of formData.entries()) {
      payload.append(key, value);
    }
    payload.append("route", "createNewSku");
    payload.append("session", JSON.stringify(session));
  
    console.log("Test response:", payload);
    const response = await api.post("/inventory/stock/image", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);

    throw error;
  }
};


//by inventory
export const createNewSkus_Inventory = async (data,session) => {
  try {


    const response = await api.post("/inventory/stock", {
      route: "createNewSkus",  
      data,
      session
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);

    throw error;
  }
};



//by purchase
export const createNewSeller_Purchase = async (data,session) => {
  try {


    const response = await api.post("/purchase/orders", {
      route: "createNewSeller",  
      data,
      session
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);

    throw error;
  }
};

//by purchase
export const createNewOrder_Purchase = async (data,session) => {
  try {


    const response = await api.post("/purchase/orders", {
      route: "createNewOrder",  
      data,
      session
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);

    throw error;
  }
};


//by purchase
export const getSellerList_Purchase = async (session) => {
  try {
    const response = await api.post("/purchase/orders", {
      route: "getSellersList",
      session
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);

    throw error;
  }
};

//by purchase
export const getOrdersList_Purchase = async (session) => {
  try {
    const response = await api.post("/purchase/orders", {
      route: "getOrdersList",
      session
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);

    throw error;
  }
};

//by purchase
export const getProductList_Purchase = async (session) => {
  try {
    const response = await api.post("/purchase/orders", {
      route: "getProductList",
      session
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);

    throw error;
  }
};


//by inventory->purchase->orders
export const getPurchaseOrdersList_Inventory = async (session) => {
  try {
    const response = await api.post("/inventory/purchase", {
      route: "getOrdersList",
      session
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);

    throw error;
  }
};
//by inventory->sales->orders
export const getSalesOrderList_Inventory = async (session) => {
  try {
    const response = await api.post("/inventory/sales", {
      route: "getOrdersList",
      session
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);

    throw error;
  }
};

//by inventory->stock
export const getProductList_Inventory = async (session) => {
  try {
    const response = await api.post("/inventory/stock", {
      route: "getProductList",
      session
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);

    throw error;
  }
};

//by inventory->stock
export const getProductBy_Id_Inventory = async (id,session) => {
  try {
    const response = await api.post("/inventory/stock", {
      route: "getProductBy_Id",
      id,
      session
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);

    throw error;
  }
};

//by inventory->purchase->orders
export const getPurchaseOrderById_Inventory = async (id,session) => {
  try {
    const response = await api.post("/inventory/purchase", {
      route: "getOrderById",
      id,
      session
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);

    throw error;
  }
};

//by inventory->purchase->orders->confirm-order
export const confirmPurchaseOrder_Inventory_Purchase = async (data,session) => {
  try {
    const response = await api.post("/inventory/purchase", {
      route: "confirmOrder",
      data,
      session
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);

    throw error;
  }
};
//by inventory->sales->orders->confirm-order
export const confirmSalesOrder_Inventory_Sales = async (data,session) => {
  try {
    const response = await api.post("/inventory/sales", {
      route: "confirmOrder",
      data,
      session
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching sales order:", error);

    throw error;
  }
};
//by inventory->sales->orders->delete-order
export const deleteSalesOrder_Inventory_Sales = async (id,session) => {
  try {
    const response = await api.post("/inventory/sales", {
      route: "deleteOrder",
      id,
      session
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching sales order:", error);

    throw error;
  }
};

//by inventory->purchase->orders->reconfirm-order
export const reConfirmPurchaseOrder_Inventory_Purchase = async (id,session) => {
  try {
    const response = await api.post("/inventory/purchase", {
      route: "reConfirmOrder",
      id,
      session
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);

    throw error;
  }
};

//by inventory->purchase->orders->cancel-order
export const cancelPurchaseOrder_Inventory_Purchase = async (id,session) => {
  try {
    const response = await api.post("/inventory/purchase", {
      route: "cancelOrder",
      id,
      session
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);

    throw error;
  }
};

//by inventory->purchase->orders->delete-order
export const deletePurchaseOrder_Inventory_Purchase = async (id,session) => {
  try {
    const response = await api.post("/inventory/purchase", {
      route: "deleteOrder",
      id,
      session
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);

    throw error;
  }
};




//by sales->customers->add-customer
export const createCustomer_Sales = async (formData,session) => {
  try {

    const payload = new FormData();
    for (const [key, value] of formData.entries()) {
      payload.append(key, value);
    }
    payload.append("route", "createCustomer");
    payload.append("session", JSON.stringify(session));
  
    console.log("Test response:", payload);
    const response = await api.post("/sales/customers/image", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });


    // const response = await api.post("/sales/customers", {
    //   route: "createCustomer",  
    //   data,
    //   session
    // });

    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);

    throw error;
  }
};

//by sales->customers->get-customer-list
export const getCustomerList_Sales = async (session) => {
  try {
    const response = await api.post("/sales/customers", {
      route: "getCustomerList",
      session
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);

    throw error;
  }
};

//by sales->customers->get-customer-by-id
export const getCustomerById_Sales = async (id,session) => {
  try {
    const response = await api.post("/sales/customers", {
      route: "getCustomerById",
      id,
      session
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);

    throw error;
  }
};

//by sales->customers->get-customer-by-id
export const deleteCustomer_Sales = async (id,session) => {
  try {
    const response = await api.post("/sales/customers", {
      route: "deleteCustomer",
      id,
      session
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);

    throw error;
  }
};

//by sales->outward
export const getProductList_Sales = async (session) => {
  try {
    const response = await api.post("/sales/outward", {
      route: "getProductList",
      session
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);

    throw error;
  }
};

//by sales->outward
export const getSalesOrderList_Sales = async (session) => {
  try {
    const response = await api.post("/sales/outward", {
      route: "getSalesOrderList",
      session
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);

    throw error;
  }
};

//by sales->outward->create-sales-order
export const createSalesOrder_Sales = async (data,session) => {
  try {


    const response = await api.post("/sales/outward", {
      route: "createSalesOrder",  
      data,
      session
    });

    return response.data;
  } catch (error) {
    console.error("Error creating sales order:", error);

    throw error;
  }
};

//by sales->outward->create-return-order
export const createReturnOrder_Sales = async (data,session) => {
  try {


    const response = await api.post("/sales/outward", {
      route: "createReturnOrder",  
      data,
      session
    });

    return response.data;
  } catch (error) {
    console.error("Error creating return order:", error);

    throw error;
  }
};
