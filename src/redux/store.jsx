import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slice/authSlice";
import productSlice from "./slice/productSlice";
import { getStoredUser } from "../utils/apiClient";

const storedUser = getStoredUser(); // reads "user" OR "seller" OR "admin" key correctly

const token =
  storedUser?.role === "admin"
    ? localStorage.getItem("adminToken") // adminTokenKey
    : localStorage.getItem("authToken") || null; // authTokenKey

export const store = configureStore({
  reducer: {
    auth: authSlice,
    product: productSlice,
  },
  preloadedState: {
    auth: {
      user: storedUser,
      token: token,
      otpSent: { sentToMail: null, status: false },
    },
  },
});
