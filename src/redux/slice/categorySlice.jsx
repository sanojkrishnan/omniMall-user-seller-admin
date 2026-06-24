import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { extractError } from "../../utils/ErrorExtractor";
import { categoryAPI } from "../../services/categoryService";

const initialState = {
  category: [],
  categoriesPage: 0,
  categoriesTotalPages: 0,
  totalCategories: 0,
  categoryError: null,
  isCategoryLoading: false,
};

export const fetchAllCategories = createAsyncThunk(
  "category/fetchAllCategories",
  async ({ pagination, uniqueCategories }, { rejectWithValue }) => {
    try {
      if (uniqueCategories && uniqueCategories.length > 0) {
        const data = await categoryAPI.fetchCategory({
          pagination,
          uniqueCategories,
        });
        return { ...data };
      } else {
        const data = await categoryAPI.fetchCategory({ pagination });
        return { ...data };
      }
    } catch (err) {
      return rejectWithValue(extractError(err, "Fetch categories failed"));
    }
  },
);

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    clearError(state) {
      state.categoryError = null;
    },
    clearCategoryState(state) {
      state.message = null;
      state.categoryError = null;
      state.category = null;
    },
  },
  extraReducers: (builder) => {
    //fetching all category
    builder
      .addCase(fetchAllCategories.pending, (state) => {
        state.categoryError = null;
        state.isCategoryLoading = true;
      })
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.isCategoryLoading = false;
        state.category = action.payload?.data?.data ?? [];
        state.hasNextPage =
          action.payload?.data?.pagination?.hasNextPage ?? false;
        state.totalPages = action.payload?.data?.pagination?.totalPages ?? 0;
        state.totalCategories = action.payload?.data?.pagination?.total ?? 0;
        state.limit = action.payload?.data?.pagination?.limit ?? 15;
      })
      .addCase(fetchAllCategories.rejected, (state, action) => {
        state.isCategoryLoading = false;
        state.categoryError = action.payload || "Failed to fetch categories";
        state.category = [];
      });
  },
});

export const { clearError, clearCategoryState } = categorySlice.actions;
export default categorySlice.reducer;
