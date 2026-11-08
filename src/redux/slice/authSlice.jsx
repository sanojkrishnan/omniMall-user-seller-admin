import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  setAuthToken,
  saveUser,
  clearTokens,
  setAdminToken,
  getStoredUser,
} from "../../utils/apiClient";
import { AuthAPI } from "../../services/authService";
import { extractError } from "../../utils/errorExtractor";

const initialState = {
  user: [],
  loggedUser: {},
  token: null,
  isLoading: false,
  userUpdating: false,
  userUpdateError: null,
  sellerSubmitting: false,
  sellerError: null,
  error: null,
  message: null,
  page: 0,
  totalPages: 0,
  totalUser: 0,
  otpSent: {
    sentToMail: null,
    status: false,
    lastSentAt: null,
  },
  isVerified: false,
};

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

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (payload, { rejectWithValue }) => {
    try {
      // payload = plain object of changed fields, or FormData when a new photo was picked
      return await AuthAPI.updateProfile(payload);
    } catch (err) {
      return rejectWithValue(extractError(err, "Profile update failed"));
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

// Google login
export const googleRegister = createAsyncThunk(
  "auth/googleRegister",
  async (credential, { rejectWithValue }) => {
    try {
      const data = await AuthAPI.googleRegister({ credential });
      return data;
    } catch (err) {
      return rejectWithValue(extractError(err, "Google login failed"));
    }
  },
);
export const googleProfileCompletion = createAsyncThunk(
  "auth/googleProfileCompletion",
  async (profileData, { rejectWithValue }) => {
    try {
      const data = await AuthAPI.completeGoogleProfile(profileData);
      return data;
    } catch (err) {
      return rejectWithValue(
        extractError(err, "Google profile completion failed"),
      );
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
//resent OTP
export const resendOTP = createAsyncThunk(
  "auth/resendOTP",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await AuthAPI.resendOTP(payload);

      return {
        ...data,
        email: payload.email,
      };
    } catch (err) {
      return rejectWithValue(extractError(err, "Failed to resend OTP"));
    }
  },
);

export const becomeSeller = createAsyncThunk(
  "auth/becomeSeller",
  async (formData, { rejectWithValue }) => {
    try {
      console.log("3. Data:", Object.fromEntries(formData)); 
      return await AuthAPI.becomeSeller(formData);
    } catch (err) {
      return rejectWithValue(extractError(err, "Failed to become seller"));
    }
  },
);

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
    clearAuthState(state) {
      state.message = null;
      state.error = null;
      state.user = null;
      state.token = null;
    },
    resetOtpFlow(state) {
      state.otpSent = {
        sentToMail: null,
        status: false,
        lastSentAt: null,
      };
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.otpSent = {
        sentToMail: null,
        status: false,
        lastSentAt: null,
      };
      state.isVerified = false;
      clearTokens();
    },
    fetchLoggedUser(state) {
      if (
        !state.user ||
        (Array.isArray(state.user) && state.user.length === 0)
      ) {
        state.user = getStoredUser();
      }
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

        state.otpSent = {
          status: true,
          sentToMail: action.payload.email,
          lastSentAt: Date.now(),
        };

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
        state.otpSent = {
          sentToMail: null,
          status: false,
          lastSentAt: null,
        };
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

    //resend OTP
    builder
      .addCase(resendOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        // don't touch otpSent here — a resend in flight doesn't mean the
        // current OTP session is invalid
      })
      .addCase(resendOTP.fulfilled, (state, action) => {
        state.otpSent = {
          status: true,
          sentToMail: action.payload.email,
          lastSentAt: Date.now(),
        };
        state.isLoading = false;
        state.message = action.payload.message;
      })
      .addCase(resendOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        // don't wipe otpSent here either — the existing OTP is still valid,
        // the resend attempt itself just failed (e.g. rate-limited)
      });
    // google register
    builder
      .addCase(googleRegister.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(googleRegister.fulfilled, (state, action) => {
        console.log("GOOGLE FULFILLED");
        console.log(action.payload);
        state.isLoading = false;
        state.user = action.payload.data.user;
        state.token = action.payload.data.token;
        state.message = action.payload.message;

        const { token, user } = action.payload.data;

        if (user.role === "admin") {
          setAdminToken(token);
        }

        if (user.role === "user") {
          setAuthToken(token);
        }

        saveUser(user);
        console.log("USER SAVED:", state.user);
      })
      .addCase(googleRegister.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    //google user profile completion
    builder
      .addCase(googleProfileCompletion.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(googleProfileCompletion.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log("PROFILE COMPLETION RESPONSE");
        console.log(action.payload);

        state.user = action.payload.data;
        state.message = action.payload.message;

        saveUser(action.payload.data);
      })
      .addCase(googleProfileCompletion.rejected, (state, action) => {
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
        const { token, user } = action.payload.data;
        if (user.role === "admin") {
          setAdminToken(token);
        }
        if (user.role === "user") {
          setAuthToken(token);
        }

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
    // update profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.userUpdating = true;
        state.userUpdateError = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.userUpdating = false;
        // backend returns { message, data: updatedUser } (same shape as googleProfileCompletion)
        const updated = { ...state.user, ...action.payload.data };
        state.user = updated;
        state.message = action.payload.message;
        saveUser(updated); // keep localStorage in sync so a refresh keeps the new data
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.userUpdating = false;
        state.userUpdateError = action.payload;
      });

    builder
      .addCase(becomeSeller.pending, (state) => {
        state.sellerSubmitting = true;
        state.sellerError = null;
      })
      .addCase(becomeSeller.fulfilled, (state, action) => {
        state.sellerSubmitting = false;
        state.message = action.payload.message;
      })
      .addCase(becomeSeller.rejected, (state, action) => {
        state.sellerSubmitting = false;
        state.sellerError = action.payload;
      });
  },
});

export const {
  clearAuthError,
  clearAuthState,
  resetOtpFlow,
  logout,
  fetchLoggedUser,
} = authSlice.actions;
export default authSlice.reducer;
