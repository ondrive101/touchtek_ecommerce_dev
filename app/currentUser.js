import "server-only";
import { api } from "@/config/axios.config";

export const getCurrentUser = async () => {
  try {
    const response = await api.post("/user/user", {
      route: "getCurrentUser",
    });

    return response.data.data.user;
  } catch (error) {
    console.error("Error fetching coins:", error);

    throw error; // Rethrow the error for further handling
  }
};
