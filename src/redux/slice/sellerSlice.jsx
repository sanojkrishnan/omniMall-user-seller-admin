import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { extractError } from "../../utils/ErrorExtractor";
import { sellerAPI } from "../../services/sellerService.js";

const initialState = {
  seller: [],
  singleSeller: null,
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
      if (uniqueSellers && uniqueSellers.length > 0) {
        const data = await sellerAPI.fetchSeller({
          pagination,
          uniqueSellers,
        });
        return { ...data };
      } else {
        const data = await sellerAPI.fetchSeller({ pagination });
        return { ...data };
      }
    } catch (err) {
      return rejectWithValue(extractError(err, "Fetch sellers failed"));
    }
  },
);
export const singleSellerFetch = createAsyncThunk(
  "seller/fetchSingleSeller",
  async ({ id }, { rejectWithValue }) => {
    try {
      const data = await sellerAPI.fetchOneSeller(id);
      return data;
    } catch (err) {
      return rejectWithValue(extractError(err, "Failed to fetch seller"));
    }
  },
);

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
    //fetch single seller
    builder
      .addCase(singleSellerFetch.pending, (state) => {
        state.isSellerLoading = true;
        state.sellerError = null;
      })
      .addCase(singleSellerFetch.fulfilled, (state, action) => {
        state.isSellerLoading = false;
        state.singleSeller = action.payload.data[0];
      })
      .addCase(singleSellerFetch.rejected, (state, action) => {
        state.isSellerLoading = false;
        state.sellerError = action.payload?.error?.message;
        state.singleSeller = {};
      });
  },
});

export const { clearSellerError, clearSellerState } = sellerSlice.actions;
export default sellerSlice.reducer;
