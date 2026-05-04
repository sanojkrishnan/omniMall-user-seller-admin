import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { setAuthToken, saveUser, clearTokens } from "../../utils/apiClient";
import { AuthAPI } from "../../services/authService";

const initialState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
  message: null,
  otpSent: { sentToMail: null, status: false },
  isVerified: false,
};

//  helper to extract error message from axios error
const extractError = (err, fallback) =>
  err.response?.data?.error?.message ||
  err.response?.data?.message ||
  err.message ||
  fallback;

//  Thunks

export const registerUser = createAsyncThunk(
  "auth/register",
  async ({ formData, email }, { rejectWithValue }) => {
    try {
      console.log("1. formData:", formData);
      console.log("2. formData.email:", formData.email);
      const data = await AuthAPI.register(formData);
      console.log("3. Data:", data);
      return { ...data, email: email };
    } catch (err) {
      return rejectWithValue(extractError(err, "Registration failed"));
    }
  },
);

export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const data = await AuthAPI.verifyOTP({ email, otp });
      return data;
    } catch (err) {
      return rejectWithValue(extractError(err, "OTP verification failed"));
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (formData, { rejectWithValue }) => {
    try {
      const data = await AuthAPI.login(formData);

      return data;
    } catch (err) {
      return rejectWithValue(extractError(err, "Login failed"));
    }
  },
);

//forgot password

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const data = await AuthAPI.forgotPassword(email);
      return data;
    } catch (err) {
      return rejectWithValue(extractError(err, "Failed to send reset email"));
    }
  },
);
// reset password
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const data = await AuthAPI.resetPassword({ token, password });
      return data;
    } catch (err) {
      return rejectWithValue(extractError(err, "Password reset failed"));
    }
  },
);
// Slice

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.otpSent = { sentToMail: null, status: false };
      state.isVerified = false;
      clearTokens(); // uses existing apiClient helper
    },
  },
  extraReducers: (builder) => {
    //  register
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.otpSent.status = true; // trigger OTP screen
        state.otpSent.sentToMail = action.payload.email;
        state.message = action.payload.data.message;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // verify otp
    builder
      .addCase(verifyOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isVerified = true;
        state.user = action.payload.data.user;
        state.token = action.payload.data.token;
        state.message =
          action.payload.message +
          "Welcome" +
          action.payload.data.user.firstName +
          "!";
        setAuthToken(action.payload.data.token);
        saveUser(action.payload.data.user);
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.data.user;
        state.token = action.payload.data.token;
        state.message = action.payload.message;
        setAuthToken(action.payload.data.token);
        saveUser(action.payload.data.user);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
    // forgot password
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // reset password
    builder
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, logout } = authSlice.actions;
export default authSlice.reducer;
