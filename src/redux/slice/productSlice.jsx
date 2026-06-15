import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { extractError } from "../../utils/errorExtractor";
import { productAPI } from "../../services/productService";

const initialState = {
  product: null,
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
      state.product = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.product = action.payload.product;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearProductState } = productSlice.actions;
export default productSlice.reducer;
