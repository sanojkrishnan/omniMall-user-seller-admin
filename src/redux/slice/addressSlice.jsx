import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { extractError } from "../../utils/errorExtractor.js";
import { addressAPI } from "../../services/addressService.js";
import { getErrorMessage } from "../../utils/getErrorMessage.js";

const initialState = {
  address: [],
  addressError: null,
  addressErrorStatus: null,
  isAddressLoading: false,
  addressMessage: null,
};

export const fetchAllAddress = createAsyncThunk(
  "address/fetchAllAddress",
  async (_, { rejectWithValue }) => {
    try {
      const data = await addressAPI.fetchAddress();
      return data;
    } catch (err) {
      return rejectWithValue(extractError(err, "Fetch address failed"));
    }
  },
);
export const addAddress = createAsyncThunk(
  "address/addAddress",
  async ({ values }, { rejectWithValue }) => {
    try {
      const data = await addressAPI.addAddress(values);
      return data;
    } catch (err) {
      return rejectWithValue(extractError(err, "Add address failed"));
    }
  },
);

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    clearSellerError(state) {
      state.addressError = null;
      state.addressErrorStatus = null;
    },
    clearSellerState(state) {
      state.addressMessage = null;
      state.addressError = null;
      state.address = [];
    },
  },
  extraReducers: (builder) => {
    //fetching all seller
    builder
      .addCase(fetchAllAddress.pending, (state) => {
        state.addressError = null;
        state.isAddressLoading = true;
      })
      .addCase(fetchAllAddress.fulfilled, (state, action) => {
        state.isAddressLoading = false;
        state.address = action.payload?.data ?? [];
        console.log("ADDDRESS: ", action.payload);
      })
      .addCase(fetchAllAddress.rejected, (state, action) => {
        state.isAddressLoading = false;
        state.addressError = getErrorMessage(action.payload);
        state.addressErrorStatus = action.payload.status;
        state.address = [];
      });
    //add address
    builder
      .addCase(addAddress.pending, (state) => {
        state.addressError = null;
        state.isAddressLoading = true;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.isAddressLoading = false;
        state.addressMessage = action.payload?.message;
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.isAddressLoading = false;
        state.addressError = getErrorMessage(action.payload);
        state.addressErrorStatus = action.payload.status;
      });
  },
});

export const { clearSellerError, clearSellerState } = addressSlice.actions;
export default addressSlice.reducer;
