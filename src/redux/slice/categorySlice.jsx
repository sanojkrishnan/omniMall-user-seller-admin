import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { extractError } from "../../utils/ErrorExtractor";
import { categoryAPI } from "../../services/categoryService";
import { getErrorMessage } from "../../utils/getErrorMessage";

const initialState = {
  category: [],
  singleCategory: null,
  categoryMessage: null,
  categoryDeleteMessage: null,
  categoryUpdateMessage: null,
  categoryCreateMessage: null,
  categoriesPage: 0,
  categoriesTotalPages: 0,
  totalCategories: 0,
  categoryError: null,
  isCategoryLoading: false,
  isCategoryUpdating: false,
  isCategoryDeleting: false,
  categoryUpdateError: null,
  categoryDeleteError: null,
  categoryCreateError: null,
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

export const addCategory = createAsyncThunk(
  "category/addCategory",
  async ({ data }, { rejectWithValue }) => {
    try {
      console.log("FORM DATA FROM THE ADD CATEGORY THUNK :", data);
      const formData = await categoryAPI.addCategory(data);
      return { ...formData };
    } catch (err) {
      return rejectWithValue(extractError(err, "Add category failed"));
    }
  },
);

export const singleCategoryFetch = createAsyncThunk(
  "category/fetchSingleCategory",
  async ({ id }, { rejectWithValue }) => {
    try {
      console.log("SINGLE CATEGORY FROM THUNK :", id);
      const data = await categoryAPI.fetchOneCategory(id);
      return data;
    } catch (err) {
      return rejectWithValue(extractError(err, "Failed to fetch category"));
    }
  },
);

export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await categoryAPI.updateCategory(id, data);
    } catch (err) {
      return rejectWithValue(extractError(err, "Failed to update category"));
    }
  },
);

export const deleteSingleCategory = createAsyncThunk(
  "category/deleteSingleCategory",
  async ({ id }, { rejectWithValue }) => {
    try {
      const res = await categoryAPI.deleteCategory(id);
      return { ...res, id }; // keep the server message and the id
    } catch (err) {
      return rejectWithValue(extractError(err, "Deletion failed"));
    }
  },
);

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    clearCategoryError(state) {
      state.categoryError = null;
    },
    clearCategoryState(state) {
      state.categoryMessage = null;
      state.categoryDeleteMessage = null;
      state.categoryUpdateMessage = null;
      state.singleCategory = null;
      state.categoryError = null;
      state.category = [];
    },
    clearCategoryUpdateError(state) {
      state.categoryUpdateError = null;
    },
    clearCategoryDeleteError(state) {
      state.categoryDeleteError = null;
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
        console.log(action.payload, "action.payload");
        const list = action.payload?.data?.data;
        state.category = Array.isArray(list) ? list : [];
        state.hasNextPage =
          action.payload?.data?.pagination?.hasNextPage ?? false;
        state.totalPages = action.payload?.data?.pagination?.totalPages ?? 0;
        state.totalCategories = action.payload?.data?.pagination?.total ?? 0;
        state.limit = action.payload?.data?.pagination?.limit ?? 15;
      })
      .addCase(fetchAllCategories.rejected, (state, action) => {
        state.isCategoryLoading = false;
        state.categoryError = action.payload || "Failed to fetch categories";
      });
    //fetch single category
    builder
      .addCase(singleCategoryFetch.pending, (state) => {
        state.isCategoryLoading = true;
        state.categoryError = null;
      })
      .addCase(singleCategoryFetch.fulfilled, (state, action) => {
        state.isCategoryLoading = false;
        console.log("SINGLE CATEGORY FROM SLICE :", action.payload);
        state.singleCategory = action.payload.data;
      })
      .addCase(singleCategoryFetch.rejected, (state, action) => {
        state.isCategoryLoading = false;
        state.categoryError = extractError(
          action.payload,
          "Failed to fetch category",
        );
        state.singleCategory = null;
      });
    //update category
    builder
      .addCase(updateCategory.pending, (state) => {
        state.isCategoryUpdating = true;
        state.categoryUpdateError = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.isCategoryUpdating = false;
        state.singleCategory = action.payload?.data;
        console.log("PAYLOAD FROM UPDATE CATEGORY :", action.payload);
        state.categoryUpdateMessage = action.payload?.message;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.isCategoryUpdating = false;
        state.categoryUpdateError = getErrorMessage(
          action.payload,
          "Failed to update category",
        );
      });
    //delete category
    builder
      .addCase(deleteSingleCategory.pending, (state) => {
        state.isCategoryDeleting = true;
        state.categoryDeleteError = null;
      })
      .addCase(deleteSingleCategory.fulfilled, (state, action) => {
        state.isCategoryDeleting = false;
        const id = action.payload.id;
        state.singleCategory = null;
        state.category = (state.category ?? []).filter((c) => c._id !== id);
        state.totalCategories = Math.max(0, state.totalCategories - 1);
        state.categoryDeleteMessage = action.payload?.message;
      })
      .addCase(deleteSingleCategory.rejected, (state, action) => {
        state.isCategoryDeleting = false;
        state.categoryDeleteError = getErrorMessage(
          action.payload,
          "Failed to delete category",
        );
      });
    //add category
    builder
      .addCase(addCategory.pending, (state) => {
        state.isCategoryLoading = true;
        state.categoryCreateError = null;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.isCategoryLoading = false;
        state.categoryCreateMessage = action.payload?.message;
        const created = action.payload?.data;
        if (created?._id) {
          state.category = [created, ...(state.category ?? [])];
        }
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.isCategoryLoading = false;
        state.categoryCreateError = getErrorMessage(
          action.payload,
          "Failed to update category",
        );
      });
  },
});

export const {
  clearCategoryError,
  clearCategoryState,
  clearCategoryUpdateError,
  clearCategoryDeleteError,
} = categorySlice.actions;
export default categorySlice.reducer;
