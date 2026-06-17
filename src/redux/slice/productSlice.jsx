import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { extractError } from "../../utils/errorExtractor";
import { productAPI } from "../../services/productService";

const initialState = {
  products: [],
  isLoading: false,
  error: null,
  message: null,
};

export const addProduct = createAsyncThunk(
  "product/addProduct",
  async ({ formData }, { rejectWithValue }) => {
    try {
      const data = await productAPI.addProduct(formData);
      return { ...data };
    } catch (err) {
      return rejectWithValue(extractError(err, "Add product failed"));
    }
  },
);

export const fetchAllProducts = createAsyncThunk(
  "product/fetchAllProduct",
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const data = await productAPI.fetchAllProduct({ page, limit });
      return data;
    } catch (err) {
      return rejectWithValue(extractError(err, "fetch product failed"));
    }
  },
);
const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearProductState(state) {
      state.message = null;
      state.error = null;
      state.products = null;
    },
  },
  extraReducers: (builder) => {
    //register product
    builder
      .addCase(addProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.product;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
    //fetching all products
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;

        state.products = action.payload.data;

        console.log("FULFILLED PAYLOAD:", action.payload);
        state.hasNextPage = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.totalProducts = action.payload.totalProducts;
        state.limit = action.payload.limit;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch products";
      });
  },
});

export const { clearError, clearProductState } = productSlice.actions;
export default productSlice.reducer;
