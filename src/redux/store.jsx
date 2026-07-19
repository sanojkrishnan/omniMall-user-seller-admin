import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slice/authSlice";
import productSlice from "./slice/productSlice";
import sellerSlice from "./slice/sellerSlice";
import categorySlice from "./slice/categorySlice";
import cartSlice from "./slice/cartSlice";
import { getStoredUser } from "../utils/apiClient";
import couponSlice from "./slice/couponSlice";

const storedUser = getStoredUser(); // reads "user" OR "seller" OR "admin" key correctly

const token =
  storedUser?.role === "admin"
    ? localStorage.getItem("adminToken") // adminTokenKey
    : localStorage.getItem("authToken") || null; // authTokenKey

export const store = configureStore({
  reducer: {
    auth: authSlice,
    product: productSlice,
    seller: sellerSlice,
    category: categorySlice,
    cart: cartSlice,
    coupon: couponSlice,
  },
  preloadedState: {
    auth: {
      user: storedUser,
      token: token,
      otpSent: { sentToMail: null, status: false },
    },
  },
});
