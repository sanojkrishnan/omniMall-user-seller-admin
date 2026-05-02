import { api } from "../utils/apiClient";

export const AuthAPI = {
  //login
  login: async (data) => {
    console.log("Login data:", data);
    return api.post("auth/login", data);
  },
  //register
  register: async (data) => {
    console.log("Register data:", data);
    return api.post("auth/register", data);
  },
   // verify otp  ← add this
  verifyOTP: async (data) => {
    console.log("OTP data:", data);
    return api.post("auth/verify-otp", data);
  },
};
