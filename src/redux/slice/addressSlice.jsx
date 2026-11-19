import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { extractError } from "../../utils/errorExtractor.js";
import { addressAPI } from "../../services/addressService.js";
import { getErrorMessage } from "../../utils/getErrorMessage.js";

const initialState = {
  address: [],
  addressError: null,
  addressErrorStatus: null,
  isAddressLoading: true, // true until the first fetch finishes
  addressMessage: null,
};

export const fetchAllAddress = createAsyncThunk(
  "address/fetchAllAddress",
  async (_, { rejectWithValue }) => {
    try {
      return await addressAPI.fetchAddress();
    } catch (err) {
      return rejectWithValue(extractError(err, "Fetch address failed"));
    }
  },
);

// add, then fetch the fresh list, and return both
export const addAddress = createAsyncThunk(
  "address/addAddress",
  async ({ values }, { rejectWithValue }) => {
    try {
      const res = await addressAPI.addAddress(values);
      const list = await addressAPI.fetchAddress();
      return { message: res?.message, data: list?.data ?? [] };
    } catch (err) {
      return rejectWithValue(extractError(err, "Add address failed"));
    }
  },
);
// delete address
export const deleteAddress = createAsyncThunk(
  "address/deleteAddress",
  async ({ addressId }, { rejectWithValue }) => {
    try {
      const res = await addressAPI.deleteAddress({ addressId });
      const list = await addressAPI.fetchAddress();
      return { message: res?.message, data: list?.data ?? [] };
    } catch (err) {
      return rejectWithValue(extractError(err, "Add address failed"));
    }
  },
);
export const updateAddress = createAsyncThunk(
  "address/updateAddress",
  async ({ addressId, values }, { rejectWithValue }) => {
    try {
      const res = await addressAPI.updateAddress(addressId, values);
      const list = await addressAPI.fetchAddress();
      return { message: res?.message, data: list?.data ?? [] };
    } catch (err) {
      return rejectWithValue(extractError(err, "Update address failed"));
    }
  },
);

// set default, then fetch the fresh list, and return both
export const setDefaultAddress = createAsyncThunk(
  "address/setDefaultAddress",
  async ({ addressId }, { rejectWithValue }) => {
    try {
      const res = await addressAPI.setDefaultAddress({ addressId });
      const list = await addressAPI.fetchAddress();
      return { message: res?.message, data: list?.data ?? [] };
    } catch (err) {
      return rejectWithValue(extractError(err, "Set default address failed"));
    }
  },
);

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    clearAddressError(state) {
      state.addressError = null;
      state.addressErrorStatus = null;
    },
    clearAddressState(state) {
      state.addressMessage = null;
      state.addressError = null;
      state.address = [];
    },
  },
  extraReducers: (builder) => {
    // fetch: a failure here is a page-level error (shows ErrorFallback)
    builder
      .addCase(fetchAllAddress.pending, (state) => {
        state.addressError = null;
        state.isAddressLoading = true;
      })
      .addCase(fetchAllAddress.fulfilled, (state, action) => {
        state.isAddressLoading = false;
        state.address = action.payload?.data ?? [];
      })
      .addCase(fetchAllAddress.rejected, (state, action) => {
        state.isAddressLoading = false;
        state.addressError = getErrorMessage(action.payload);
        state.addressErrorStatus = action.payload?.status;
        state.address = [];
      });

    // add + set default: same loading flag, the page shows the spinner.
    // Failures are shown as toasts by the page, so the old list stays.
    [addAddress, setDefaultAddress, deleteAddress, updateAddress].forEach(
      (thunk) => {
        builder
          .addCase(thunk.pending, (state) => {
            state.isAddressLoading = true;
          })
          .addCase(thunk.fulfilled, (state, action) => {
            state.isAddressLoading = false;
            state.address = action.payload.data;
            state.addressMessage = action.payload.message;
          })
          .addCase(thunk.rejected, (state) => {
            state.isAddressLoading = false;
          });
      },
    );
  },
});

export const { clearSellerError, clearSellerState } = addressSlice.actions;
export default addressSlice.reducer;
