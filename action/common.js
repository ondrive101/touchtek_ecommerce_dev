"use server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { authOptions } from "@/lib/auth";
import axios from "axios";

const BACKEND_URL = process.env.BACKEND_API_URL + "/api/v1/ecommerce";

// Create axios instance
const apiClient = axios.create({
  baseURL: BACKEND_URL,
  timeout: 30000,
});

// Define role permissions
const ROLES = {
  ADMIN: "admin",
  CUSTOMER: "customer",
};

// Get session with role check
const getSessionWithRole = async (allowedRoles = []) => {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🔍 [SESSION CHECK] Attempting to get session...");
  
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    console.log("❌ [SESSION CHECK] No session found");
    throw new Error("Unauthorized: No session found");
  }
  
  console.log("✅ [SESSION CHECK] Session found");
  console.log("👤 [USER INFO]", {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    department: session.user.department,
    role: session.user.role,
  });
  console.log("🔑 [TOKEN] Access token present:", !!session.user.accessToken);

  // Check if user role is allowed
  if (allowedRoles.length > 0) {
    const isAllowed = allowedRoles.includes(session.user.department);
    console.log("🔒 [AUTHORIZATION] Required departments:", allowedRoles);
    console.log("🔒 [AUTHORIZATION] User department:", session.user.department);
    console.log(isAllowed ? "✅ [AUTHORIZATION] Access granted" : "❌ [AUTHORIZATION] Access denied");
    
    if (!isAllowed) {
      throw new Error(
        `Forbidden: Requires one of these departments: ${allowedRoles.join(", ")}`
      );
    }
  }

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  return session;
};

// Error handler
const handleApiError = (error) => {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("❌ [ERROR HANDLER] Processing error...");
  
  if (error.response) {
    console.log("📛 [ERROR TYPE] Backend response error");
    console.log("📛 [STATUS CODE]", error.response.status);
    console.log("📛 [ERROR DATA]", error.response.data);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    return error.response.data.message || error.response.data.msg || "Something went wrong";
  }
  
  if (error.request) {
    console.log("📛 [ERROR TYPE] No response from server");
    console.log("📛 [REQUEST]", error.request);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    return "No response from server";
  }
  
  console.log("📛 [ERROR TYPE] Request setup error");
  console.log("📛 [MESSAGE]", error.message);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  return error.message || "An unexpected error occurred";
};

// Generic API call with role-based auth
const apiCall = async (method, endpoint, data = null, allowedRoles = [],log=true) => {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📡 [API CALL START]");
  console.log("📡 [METHOD]", method.toUpperCase());
  console.log("📡 [ENDPOINT]", endpoint);
  console.log("📡 [FULL URL]", `${BACKEND_URL}${endpoint}`);
  console.log("📡 [DATA]", data || "No data");
  console.log("📡 [REQUIRES AUTH]", allowedRoles.length > 0 ? "Yes" : "No");
  
  try {
    let headers = {};

    // Check if data is FormData
    const isFormData = data instanceof FormData;


       // Debug FormData contents BEFORE sending
    if (isFormData) {
      console.log("📦 [FORMDATA DEBUG] Inspecting entries:");
      for (let [key, value] of data.entries()) {
        if (value instanceof File) {
          console.log(`  ✅ ${key}: File("${value.name}", ${value.size} bytes, ${value.type})`);
        } else if (value instanceof Blob) {
          console.log(`  ✅ ${key}: Blob(${value.size} bytes, ${value.type})`);
        } else {
          console.log(`  📄 ${key}:`, value);
        }
      }
    }

    // Set appropriate content type
    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    // Add auth headers if required
    if (allowedRoles.length > 0) {
      const session = await getSessionWithRole(allowedRoles);
       const token = await getToken({
         req: headers(),
         secret: process.env.AUTH_SECRET,
       });

       console.log('access token', token)

       if (!token?.accessToken) {
  throw new Error("Unauthorized");
}


       

       const accessToken = token?.accessToken;
      
      headers = {
        ...headers,
        Authorization: `Bearer ${accessToken}`,
        "X-User-ID": session.user.id,
      };

      console.log("🔐 [HEADERS] Authorization headers added");
    }

    console.log("📤 [REQUEST] Sending request...");
    console.log("📤 [IS FORMDATA]", isFormData);
    
    const config = {
      method,
      url: endpoint,
      headers,
      ...(data && { data }),
    };

    const response = await apiClient(config);

    console.log("✅ [API CALL SUCCESS]");
    console.log("✅ [STATUS CODE]", response.status);

    if(log) {

      console.log("✅ [RESPONSE DATA]", response.data);
    }
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    return { success: true, data: response.data };
    
  } catch (error) {
    const message = handleApiError(error);
    console.error(`❌ [API CALL FAILED] ${method.toUpperCase()} ${endpoint}:`, message);
    return { success: false, message };
  }
};

export const addUser = async (data) => {
  console.log("🆕 [PUBLIC ACTION] addUser called");
  return apiCall("post", "/auth/register", data);
};

export const loginUser = async (data) => {
  console.log("🔐 [PUBLIC ACTION] loginUser called");
  return apiCall("post", "/auth/login", data);
};

export const refreshAccessToken = async (data) => {
  console.log("🆕 [PUBLIC ACTION] refresh token called");
  return apiCall("post", "/auth/refresh-access-token", data);
};



// ==================== INVENTORY ACTIONS ====================

export const getProducts = async (filters) => {
  console.log("👤 [INVENTORY ACTION] getProducts called");
   const queryParams = new URLSearchParams();
   if (filters.source) queryParams.append('source', filters.source);
   if (filters.page) queryParams.append('page', filters.page);
   if (filters.limit) queryParams.append('limit', filters.limit);
   if (filters.search) queryParams.append('search', filters.search);
   if (filters.parentCategory) queryParams.append('category', filters.parentCategory);
   if (filters.category) queryParams.append('subcategory', filters.category);
   if (filters.priceRange) {
  queryParams.append('minPrice', filters.priceRange[0].toString());
  queryParams.append('maxPrice', filters.priceRange[1].toString());
}
   if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
   if (filters.minRating) queryParams.append('minRating', filters.minRating.toString());
   const queryString = queryParams.toString();
  const endpoint = queryString 
    ? `/products/get-products?${queryString}` 
    : `/products/get-products`;
  
  
  return apiCall("get", endpoint, null, [], false);
};

export const getSitemapProducts = async () => {
  console.log("👤 [INVENTORY ACTION] getSitemapProducts called");
  return apiCall("get", `/products/get-sitemap-products`, null, [], false);
};

export const getProductById = async (id) => {
  console.log("👤 [INVENTORY ACTION] getProductById called");
  return apiCall("get", `/products/get-product/${id}`, null, [], false);
};


// ==================== CRM ACTIONS ====================

// ==================== GENERAL USER ACTIONS ====================

