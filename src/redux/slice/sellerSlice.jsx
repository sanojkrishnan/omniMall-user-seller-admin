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
  async ({ pagination }, { rejectWithValue }) => {
    try {
      const data = await sellerAPI.addProduct(pagination);
      return { ...data };
    } catch (err) {
      return rejectWithValue(extractError(err, "Add product failed"));
    }
  },
);

const sellerSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearError(state) {
      state.productError = null;
    },
    clearSellerState(state) {
      state.message = null;
      state.productError = null;
      state.products = null;
    },
  },
  extraReducers: (builder) => {
    //fetching all products
    builder
      .addCase(fetchAllSellers.pending, (state) => {
        state.sellerError = null;
        state.isSellerLoading = true;
      })
      .addCase(fetchAllSellers.fulfilled, (state, action) => {
        state.isSellerLoading = false;
        state.seller = action.payload.data;

        console.log("FULFILLED PAYLOAD:", action.payload);
        state.hasNextPage = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.totalSellers = action.payload.totalSellers;
        state.limit = action.payload.limit;
      })
      .addCase(fetchAllSellers.rejected, (state, action) => {
        state.isSellerLoading = false;
        state.sellerError = action.payload || "Failed to fetch products";
        state.seller = [];
      });
  },
});

export const { clearError, clearSellerState } = sellerSlice.actions;
export default sellerSlice.reducer;
