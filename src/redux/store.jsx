import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authReducer";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
