import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { extractError } from "../../utils/errorExtractor.js";
import { getErrorMessage } from "../../utils/getErrorMessage.js";
import { orderAPI } from "../../services/orderService.js";

const initialState = {
  orders: null,
  orderId: null,
  orderError: null,
  orderErrorStatus: null,
  isOrderLoading: false,
  isOrderFetched: false,
  orderMessage: null,
};

// handles: order object, [order], or { "0": order }
const unwrapOrder = (data) => {
  if (!data) return null;
  if (Array.isArray(data)) return data[0] ?? null;
  if (data.orderId) return data;
  if (data["0"]) return data["0"];
  return null;
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

export const fetchSingleOrder = createAsyncThunk(
  "orders/fetchSingleOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      return await orderAPI.fetchSingleOrder(orderId);
    } catch (err) {
      return rejectWithValue(extractError(err, "Fetching order failed"));
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
      state.orders = null;
      state.orderId = null;
      state.orderMessage = null;
      state.orderError = null;
      state.orderErrorStatus = null;
      state.isOrderFetched = false;
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
        state.orderId = action.payload?.data ?? null;
        state.orderMessage = action.payload?.message ?? null;
      })
      .addCase(addOrder.rejected, (state, action) => {
        state.isOrderLoading = false;
        state.orderError = getErrorMessage(action.payload);
        state.orderErrorStatus = action.payload?.status ?? null;
      });
    builder
      .addCase(fetchSingleOrder.pending, (state) => {
        state.isOrderLoading = true;
        state.isOrderFetched = false;
        state.orderError = null;
        state.orderErrorStatus = null;
      })
      .addCase(fetchSingleOrder.fulfilled, (state, action) => {
        state.isOrderLoading = false;
        state.isOrderFetched = true;
        state.orders = unwrapOrder(action.payload?.data);
        state.orderMessage = action.payload?.message ?? null;
      })
      .addCase(fetchSingleOrder.rejected, (state, action) => {
        state.isOrderLoading = false;
        state.isOrderFetched = true;
        state.orderError = getErrorMessage(action.payload);
        state.orderErrorStatus = action.payload?.status ?? null;
      });
  },
});

export const { clearOrderError, clearOrderState } = orderSlice.actions;
export default orderSlice.reducer;
