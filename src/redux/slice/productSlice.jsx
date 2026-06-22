import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { extractError } from "../../utils/ErrorExtractor";
import { productAPI } from "../../services/productService";

const initialState = {
  products: [],
  isProductLoading: false,
  productError: null,
  page: 0,
  totalPages: 0,
};

export const addAProduct = createAsyncThunk(
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

export const deleteSingleProduct = createAsyncThunk(
  "product/deleteProduct",
  async ({ id }, { rejectWithValue }) => {
    try {
      await productAPI.deleteProduct(id);
      return { id };
    } catch (err) {
      return rejectWithValue(extractError(err, "deletion failed"));
    }
  },
);

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearError(state) {
      state.productError = null;
    },
    clearProductState(state) {
      state.message = null;
      state.productError = null;
      state.products = [];
    },
  },
  extraReducers: (builder) => {
    //register product
    builder
      .addCase(addAProduct.pending, (state) => {
        state.isProductLoading = true;
        state.productError = null;
      })
      .addCase(addAProduct.fulfilled, (state, action) => {
        state.isProductLoading = false;
        state.products = action.payload.product;
      })
      .addCase(addAProduct.rejected, (state, action) => {
        state.isProductLoading = false;
        state.productError = action.payload;
      });
    //fetching all products
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.productError = null;
        state.isProductLoading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.isProductLoading = false;

        console.log("FULFILLED PAYLOAD:", action.payload);

        state.products = action.payload.data?.data ?? [];

        state.hasNextPage = action.payload.data.pagination?.hasNextPage;
        state.totalPages = action.payload.data.pagination?.totalPages;
        state.totalProducts = action.payload.data.pagination?.total;
        state.limit = action.payload.data.pagination?.itemsPerPage;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.isProductLoading = false;
        state.productError = action.payload || "Failed to fetch products";
        state.products = [];
      });
    //delete products
    builder
      .addCase(deleteSingleProduct.pending, (state) => {
        state.productError = null;
        state.isProductLoading = true;
      })
      .addCase(deleteSingleProduct.fulfilled, (state, action) => {
        state.isProductLoading = false;
        state.products = state.products.filter(
          (product) => product._id !== action.payload.id,
        );
      })
      .addCase(deleteSingleProduct.rejected, (state, action) => {
        state.isProductLoading = false;
        state.productError = action.payload || "Deletion failed";
      });
  },
});

export const { clearError, clearProductState } = productSlice.actions;
export default productSlice.reducer;
