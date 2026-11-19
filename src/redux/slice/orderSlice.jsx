import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { extractError } from "../../utils/errorExtractor.js";
import { getErrorMessage } from "../../utils/getErrorMessage.js";
import { orderAPI } from "../../services/orderService.js";

const initialState = {
  order: null, // the order just created
  orderError: null,
  orderErrorStatus: null,
  isOrderLoading: false,
  orderMessage: null,
};

export const addOrder = createAsyncThunk(
  "orders/addOrder",
  async ({ values }, { rejectWithValue }) => {
    try {
      return await orderAPI.addOrder(values); // returns { message, data }
    } catch (err) {
      return rejectWithValue(extractError(err, "Add order failed"));
    }
  },
);

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearOrderError(state) {
      state.orderError = null;
      state.orderErrorStatus = null;
    },
    clearOrderState(state) {
      state.order = null;
      state.orderMessage = null;
      state.orderError = null;
      state.orderErrorStatus = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addOrder.pending, (state) => {
        state.isOrderLoading = true;
        state.orderError = null;
        state.orderErrorStatus = null;
      })
      .addCase(addOrder.fulfilled, (state, action) => {
        state.isOrderLoading = false;
        state.order = action.payload?.data ?? null;
        state.orderMessage = action.payload?.message ?? null;
      })
      .addCase(addOrder.rejected, (state, action) => {
        state.isOrderLoading = false;
        state.orderError = getErrorMessage(action.payload);
        state.orderErrorStatus = action.payload?.status ?? null;
      });
  },
});

export const { clearOrderError, clearOrderState } = orderSlice.actions;
export default orderSlice.reducer;
