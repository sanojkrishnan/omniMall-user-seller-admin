import axios from "axios";
import { toast } from "react-toastify";
import { AUTH_CONFIG } from "../config/app"; // auth config
import { API_CONFIG } from "../config/app";

// Base URL

// Axios Instance

const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  headers: { "Content-Type": "application/json" },
  timeout: 20000,
});

// Token Management

// In-memory cache to avoid repeated localStorage reads
let _authToken = null;
let _adminToken = null;
let _sellerToken = null;

//token collecting for user
export const getAuthToken = () => {
  if (!_authToken) _authToken = localStorage.getItem(AUTH_CONFIG.tokenKey);
  return _authToken;
};
//token collecting for admin
export const getAdminToken = () => {
  if (!_adminToken)
    _adminToken = localStorage.getItem(AUTH_CONFIG.adminTokenKey);
  return _adminToken;
};
//token collecting for seller
export const getSellerToken = () => {
  if (!_sellerToken)
    _sellerToken = localStorage.getItem(AUTH_CONFIG.sellerTokenKey);
  return _sellerToken;
};

//token save and removal for user
export const setAuthToken = (token) => {
  _authToken = token;
  if (token) {
    localStorage.setItem(AUTH_CONFIG.tokenKey, token);
  } else {
    localStorage.removeItem(AUTH_CONFIG.tokenKey);
  }
};
//token save and removal for admin
export const setAdminToken = (token) => {
  _adminToken = token;
  if (token) {
    localStorage.setItem(AUTH_CONFIG.adminTokenKey, token);
  } else {
    localStorage.removeItem(AUTH_CONFIG.adminTokenKey);
  }
};
//token save and removal for seller
export const setSellerToken = (token) => {
  _sellerToken = token;
  if (token) {
    localStorage.setItem(AUTH_CONFIG.sellerTokenKey, token);
  } else {
    localStorage.removeItem(AUTH_CONFIG.sellerTokenKey);
  }
};

// Clear all tokens and user data on logout or session expiry
export const clearTokens = () => {
  _authToken = null;
  _adminToken = null;
  _sellerToken = null;
  localStorage.removeItem(AUTH_CONFIG.tokenKey);
  localStorage.removeItem(AUTH_CONFIG.adminTokenKey);
  localStorage.removeItem(AUTH_CONFIG.sellerTokenKey);
  localStorage.removeItem(AUTH_CONFIG.userKey);
  localStorage.removeItem(AUTH_CONFIG.adminKey);
  localStorage.removeItem(AUTH_CONFIG.sellerKey);
  delete apiClient.defaults.headers.common["Authorization"];
};

export const clearSellerToken = () => {
  _sellerToken = null;

  localStorage.removeItem(AUTH_CONFIG.sellerTokenKey);
  localStorage.removeItem(AUTH_CONFIG.sellerKey);
};

// User Data Helpers

// Always save the normal user in userKey
export const saveUser = (user) => {
  if (user) {
    localStorage.setItem(AUTH_CONFIG.userKey, JSON.stringify(user));
  }
};

// Always retrieve the normal user
export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(AUTH_CONFIG.userKey);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

// Seller Data Helpers

// Always save seller separately
export const saveSeller = (seller) => {
  if (seller) {
    localStorage.setItem(AUTH_CONFIG.sellerKey, JSON.stringify(seller));
  }
};

// Always retrieve seller separately
export const getStoredSeller = () => {
  try {
    const raw = localStorage.getItem(AUTH_CONFIG.sellerKey);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

// Request Interceptor
// Automatically attaches the correct token to every outgoing request

const TOKEN_GETTERS = {
  admin: getAdminToken,
  seller: getSellerToken,
  user: getAuthToken,
};

apiClient.interceptors.request.use(
  (config) => {
    // let the browser set multipart/form-data + boundary itself
    if (typeof FormData !== "undefined" && config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    const role = config.authRole ?? "user";
    const getToken = TOKEN_GETTERS[role] ?? getAuthToken;
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => Promise.reject(error),
);

//  Response Interceptor
// Handles errors globally

apiClient.interceptors.response.use(
  (response) => response, // pass successful responses through as-is

  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;

    const message =
      data?.error?.message ||
      data?.message ||
      error.message ||
      "An unexpected error occurred";

    if (status === 401) {
      // Public/pre-auth endpoints never carry a session token, so a 401 from
      // them means "bad credentials/OTP", not "your session expired". Don't
      // treat these as a global logout trigger.
      const publicAuthPaths = [
        "auth/login",
        "auth/register",
        "auth/verify-otp",
        "auth/resend-otp",
        "auth/forgot-password",
        "auth/reset-password",
        "auth/google",
      ];

      const isPublicAuthRequest = publicAuthPaths.some((path) =>
        error.config?.url?.includes(path),
      );

      if (!isPublicAuthRequest) {
        clearTokens();
        toast.error("Session expired. Please login again.");
        window.location.href = "/login";
      }

      return Promise.reject(error);
    }

    if (status === 403) {
      if (data?.banned) {
        clearTokens();
        toast.error("Your account has been banned. Please contact support.");
        window.location.href = "/login";
        return Promise.reject(error);
      }
      toast.error("Access denied. You don't have permission to do this.");
      return Promise.reject(error);
    }

    if (status === 409) {
      // Conflict — e.g. email already exists; let the caller handle it
      return Promise.reject(error);
    }

    if (status >= 500) {
      console.error("Server error:", message);

      // let any request opt out (e.g. background polling)
      if (!error.config?.silent) {
        window.dispatchEvent(
          new CustomEvent("server-error", {
            detail: { statusCode: status, message },
          }),
        );
      }
    }

    return Promise.reject(error);
  },
);

// Optional wrappers so callers get data directly instead of response.data
// Pass { authRole: "admin" | "seller" } in `config` for protected calls
// that aren't a regular user request (user is the default).

export const api = {
  get: (url, config) => apiClient.get(url, config).then((res) => res.data),

  post: (url, data, config) =>
    apiClient.post(url, data, config).then((res) => res.data),

  put: (url, data, config) =>
    apiClient.put(url, data, config).then((res) => res.data),

  patch: (url, data, config) =>
    apiClient.patch(url, data, config).then((res) => res.data),

  delete: (url, config) =>
    apiClient.delete(url, config).then((res) => res.data),

  // for multipart/form-data (file uploads)
  upload: (url, formData, config) =>
    apiClient
      .post(url, formData, {
        ...config,
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data),
};

export default apiClient;
