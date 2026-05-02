import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { setAuthToken, saveUser, clearTokens } from "../../utils/apiClient";
import { AuthAPI } from "../../services/authService";

const initialState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
  otpSent: false,
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
  async (userData, { rejectWithValue }) => {
    try {
      const data = await AuthAPI.register(userData);
      return data;
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
  async (userData, { rejectWithValue }) => {
    try {
      const data = await AuthAPI.login(userData);
      return data;
    } catch (err) {
      return rejectWithValue(extractError(err, "Login failed"));
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
      state.otpSent = false;
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
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.otpSent = true; // trigger OTP screen
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
        setAuthToken(action.payload.data.token);
        saveUser(action.payload.data.user);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, logout } = authSlice.actions;
export default authSlice.reducer;
