import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { extractError } from "../../utils/ErrorExtractor";
import { productAPI } from "../../services/productService";

const initialState = {
  products: [],
  singleProduct: {},
  isProductLoading: false,
  productError: null,
  page: 0,
  totalPages: 0,
  hasNextPage: true,
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
//fetch all products
export const fetchAllProducts = createAsyncThunk(
  "product/fetchAll",
  async (
    {
      page = 1,
      limit = 15,
      search = "",
      category = "",
      minPrice = "",
      maxPrice = "",
      priceSort= "price_desc",
      sort = "newest",
    } = {},
    { rejectWithValue },
  ) => {
    try {
      const params = Object.fromEntries(
        Object.entries({
          page,
          limit,
          search,
          category,
          minPrice,
          maxPrice,
          priceSort,
          sort,
        }).filter(([_, v]) => v !== ""),
      );
      const res = await productAPI.fetchAllProduct(params);
      return res;
    } catch (err) {
      return rejectWithValue(extractError(err, "Failed to fetch products"));
    }
  },
);
//fetch single product
export const singleProductFetch = createAsyncThunk(
  "product/fetchSingleProduct",
  async ({ id }, { rejectWithValue }) => {
    try {
      const data = await productAPI.fetchOneProduct(id);
      return data;
    } catch (err) {
      return rejectWithValue(extractError(err, "Failed to fetch products"));
    }
  },
);
//delete product
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
    clearProductError(state) {
      state.productError = null;
    },
    clearProductState(state) {
      state.message = null;
      state.productError = null;
      state.products = [];
      state.singleProduct = {};
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

        state.products = [action.payload.data, ...state.products];
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

        console.log("FULFILLED PAGE:", action.meta.arg.page);

        const newProducts = action.payload.data?.data ?? [];

        console.log("PRODUCT COUNT:", newProducts.length);

        if (action.meta.arg.page === 1) {
          state.products = newProducts;
        } else {
          state.products = [...state.products, ...newProducts];
        }

        state.hasNextPage = action.payload.data.pagination?.hasNextPage;
        state.totalPages = action.payload.data.pagination?.totalPages;
        state.totalProducts = action.payload.data.pagination?.total;
        state.limit = action.payload.data.pagination?.itemsPerPage;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.isProductLoading = false;
        state.productError = action.payload || "Failed to fetch products";
        //  keep existing products — only reset on page 1 failure
        if (action.meta.arg.page === 1) {
          state.products = [];
        }
      });
    //fetch single product
    builder
      .addCase(singleProductFetch.pending, (state) => {
        state.isProductLoading = true;
        state.productError = null;
      })
      .addCase(singleProductFetch.fulfilled, (state, action) => {
        state.isProductLoading = false;
        state.singleProduct = action.payload.data;
      })
      .addCase(singleProductFetch.rejected, (state, action) => {
        state.isProductLoading = false;
        state.productError = action.payload?.error?.message;
        state.singleProduct = {};
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

export const { clearProductError, clearProductState } = productSlice.actions;
export default productSlice.reducer;
