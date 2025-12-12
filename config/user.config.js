import { api, serverapi } from "@/config/axios.config";

export const registerUser = async (data) => {
  try {
    const response = await api.post("/user/register", data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "Something went wrong");
    } else {
      throw new Error("Network error or server is unreachable");
    }
  }
};

export const emailVerifyUser = async (token) => {
  try {
    const response = await api.post("/user/email-verify", { token });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};
