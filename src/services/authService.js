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
  // verify otp
  verifyOTP: async (data) => {
    console.log("OTP data:", data);
    return api.post("auth/verify-otp", data);
  },
  //resent otp
  resendOTP: async (data) => {
    console.log("OTP data:", data);
    return api.post("auth/resend-otp", data);
  },
  // reset password
  resetPassword: async (data) => {
    console.log("Reset password data:", data);
    return api.post("auth/reset-password", data);
  },
  // forgot password
  forgotPassword: async (email) => {
    console.log("Forgot password email:", email);
    return api.post("auth/forgot-password", { email });
  },
  //google login/register
  googleRegister: async (data) => {
    console.log("google register/login", data);
    return api.post("auth/google", data);
  },
  //google profile completion
  completeGoogleProfile: async (data) => {
    console.log("Google profile completion data:", data);
    return api.patch("auth/complete-profile", data);
  },
};
