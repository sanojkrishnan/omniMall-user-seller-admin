import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { sellerAPI } from "../../services/sellerService";
import { extractError } from "../../utils/errorExtractor";
import { getErrorMessage } from "../../utils/getErrorMessage";

import {
  saveSeller,
  getStoredSeller,
  getSellerToken,
  setSellerToken,
  clearSellerToken,
} from "../../utils/apiClient";

// Initial state
const initialState = {
  sellers: [],
  seller: getStoredSeller(),
  sellerToken: getSellerToken(),

  isLoading: false,
  sellerUpdating: false,
  sellerUpdateError: null,

  sellerError: null,
  sellerMessage: null,

  page: 0,
  totalPages: 0,
  totalSellers: 0,
};

// Thunks

// Fetch all sellers
export const fetchAllSellers = createAsyncThunk(
  "seller/fetchAllSellers",
  async ({ pagination, uniqueSellers }, { rejectWithValue }) => {
    try {
      const data = await sellerAPI.fetchSeller({
        pagination,
        ...(uniqueSellers?.length > 0 && { uniqueSellers }),
      });

      return data;
    } catch (err) {
      return rejectWithValue(extractError(err, "Failed to fetch sellers"));
    }
  },
);

// Fetch the seller belonging to the logged-in user
export const singleSellerFetch = createAsyncThunk(
  "seller/fetchSingleSeller",
  async (_, { rejectWithValue }) => {
    try {
      const data = await sellerAPI.fetchOneSeller();
      return data;
    } catch (err) {
      return rejectWithValue(extractError(err, "Failed to fetch seller"));
    }
  },
);

// Slice
const sellerSlice = createSlice({
  name: "seller",
  initialState,

  reducers: {
    clearSellerError(state) {
      state.sellerError = null;
    },

    clearSellerState(state) {
      state.message = null;
      state.sellerError = null;
      state.seller = null;
    },
    logoutSeller(state) {
      state.seller = null;
      state.sellerToken = null;

      clearSellerToken();
    },
  },

  extraReducers: (builder) => {
    // Fetch all sellers
    builder
      .addCase(fetchAllSellers.pending, (state) => {
        state.isLoading = true;
        state.sellerError = null;
      })
      .addCase(fetchAllSellers.fulfilled, (state, action) => {
        state.isLoading = false;

        state.sellers = action.payload?.data?.data ?? [];

        state.totalPages = action.payload?.data?.pagination?.totalPages ?? 0;

        state.totalSellers = action.payload?.data?.pagination?.total ?? 0;

        state.page = action.payload?.data?.pagination?.page ?? 0;

        state.sellerError = null;
      })
      .addCase(fetchAllSellers.rejected, (state, action) => {
        state.isLoading = false;
        state.sellerError = getErrorMessage(action.payload);
        state.sellers = [];
      });

    // Fetch single seller
    builder
      .addCase(singleSellerFetch.pending, (state) => {
        state.isLoading = true;
        state.sellerError = null;
      })

      .addCase(singleSellerFetch.fulfilled, (state, action) => {
        state.isLoading = false;

        const { seller, token } = action.payload.data;

        state.seller = seller;
        state.sellerToken = token;
        state.sellerMessage = action.payload.message;
        state.sellerError = null;

        // Save seller authentication
        setSellerToken(token);
        saveSeller(seller);
      })
      .addCase(singleSellerFetch.rejected, (state, action) => {
        state.isLoading = false;
        state.sellerError = getErrorMessage(action.payload);
        state.seller = null;
      });
  },
});

export const { clearSellerError, clearSellerState, logoutSeller } =
  sellerSlice.actions;

export default sellerSlice.reducer;
