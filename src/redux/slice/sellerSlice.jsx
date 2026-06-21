import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { extractError } from "../../utils/ErrorExtractor";
import { sellerAPI } from "../../services/sellerService.js";

const initialState = {
  seller: [],
  sellersPage: 0,
  sellersTotalPages: 0,
  totalSellers: 0,
  sellerError: null,
  isSellerLoading: false,
};

export const fetchAllSellers = createAsyncThunk(
  "seller/fetchAllSellers",
  async ({ pagination, uniqueSellers }, { rejectWithValue }) => {
    try {
      const data = await sellerAPI.fetchSeller({ pagination, uniqueSellers });
      return { ...data };
    } catch (err) {
      return rejectWithValue(extractError(err, "Fetch sellers failed"));
    }
  },
);

const sellerSlice = createSlice({
  name: "seller",
  initialState,
  reducers: {
    clearError(state) {
      state.sellerError = null;
    },
    clearSellerState(state) {
      state.message = null;
      state.sellerError = null;
      state.seller = null;
    },
  },
  extraReducers: (builder) => {
    //fetching all seller
    builder
      .addCase(fetchAllSellers.pending, (state) => {
        state.sellerError = null;
        state.isSellerLoading = true;
      })
      .addCase(fetchAllSellers.fulfilled, (state, action) => {
        state.isSellerLoading = false;
        state.seller = action.payload?.data?.data ?? [];
        state.hasNextPage =
          action.payload?.data?.pagination?.hasNextPage ?? false;
        state.totalPages = action.payload?.data?.pagination?.totalPages ?? 0;
        state.totalSellers = action.payload?.data?.pagination?.total ?? 0;
        state.limit = action.payload?.data?.pagination?.limit ?? 15;
      })
      .addCase(fetchAllSellers.rejected, (state, action) => {
        state.isSellerLoading = false;
        state.sellerError = action.payload || "Failed to fetch sellers";
        state.seller = [];
      });
  },
});

export const { clearError, clearSellerState } = sellerSlice.actions;
export default sellerSlice.reducer;
