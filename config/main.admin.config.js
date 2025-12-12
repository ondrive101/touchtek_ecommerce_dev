import { simpleApi } from "@/config/axios.config";

//users functions start ----------------------------
export const getUserListAdmin = async (currentPage, rowsPerPage, token) => {
  try {
    
    const response = await simpleApi.post("/admin/users", {
      route: "getUserList",
      currentPage,
      rowsPerPage,
      token,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching coins:", error);

    throw error; // Rethrow the error for further handling
  }
};
export const createUserAdmin = async (data,token) => {
    try {
      const response = await simpleApi.post("/admin/users", {
          route: "createUser",
          token,
          data
          
        });
      return response.data;
    } catch (error) {
      throw error; // Rethrow the error for further handling
    }
  };
//users functions end ----------------------------


//tasks functions start ----------------------------
  export const getTaskListAdmin = async (token) => {
    try {
      const response = await simpleApi.post("/admin/tasks", {
        route: "getTaskList",
        token
      });
  
      return response.data;
    } catch (error) {
      console.error("Error fetching coins:", error);
  
      throw error; // Rethrow the error for further handling
    }
  };

  export const createTaskAdmin = async (data,token) => {
    try {
      console.log('called in config');
      const response = await simpleApi.post("/admin/tasks", {
          route: "createTask",
          token,
          data
          
        });
      return response.data;
    } catch (error) {
      throw error; // Rethrow the error for further handling
    }
  };

  export const editTaskAdmin = async (data,id,token) => {
    try {
      console.log('called in config');
      const response = await simpleApi.post("/admin/tasks", {
          route: "editTask",
          token,
          id,
          data
          
        });
      return response.data;
    } catch (error) {
      throw error; // Rethrow the error for further handling
    }
  };

  export const deleteTaskAdmin = async (id,token) => {
    try {
      const response = await simpleApi.post("/admin/tasks", {
          route: "deleteTask",
          token,
          id
          
        });
      return response.data;
    } catch (error) {
      throw error; // Rethrow the error for further handling
    }
  };
  //tasks functions end ----------------------------


  //coins functions start ----------------------------
  export const getCoinListAdmin = async (token) => {
    try {
      const response = await simpleApi.post("/admin/coins", {
        route: "getCoinsList",
        token
      });
  
      return response.data;
    } catch (error) {
      console.error("Error fetching coins:", error);
  
      throw error; // Rethrow the error for further handling
    }
  };

  //coins functions end ----------------------------
  