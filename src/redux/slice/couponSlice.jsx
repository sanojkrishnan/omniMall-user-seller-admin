import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { extractError } from "../../utils/ErrorExtractor";
import { couponAPI } from "../../services/couponService";

const initialState = {
  coupon: [],
  couponPage: 0,
  singleCoupon: null,
  couponMessage: null,
  couponDeleteMessage: null,
  couponUpdateMessage: null,
  couponTotalPages: 0,
  totalCoupons: 0,
  couponError: null,
  isCouponLoading: false,
};

// Fetch the cart for a specific user from backend
export const fetchCoupon = createAsyncThunk(
  "coupon/fetch",
  async ({ pagination }, { rejectWithValue }) => {
    try {
      const allCoupons = await couponAPI.fetchCoupons(pagination);
      return allCoupons;
    } catch (err) {
      return rejectWithValue(extractError(err, "Failed to fetch Coupon"));
    }
  },
);

export const fetchCouponById = createAsyncThunk(
  "coupon/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const singleCoupon = await couponAPI.fetchCouponById(id);
      return singleCoupon;
    } catch (err) {
      return rejectWithValue(extractError(err, "Failed to fetch Coupon"));
    }
  },
);

const couponSlice = createSlice({
  name: "coupon",
  initialState,
  reducers: {
    clearCouponError(state) {
      state.couponError = null;
      state.couponMessage = null;
      state.couponDeleteMessage = null;
      state.couponUpdateMessage = null;
    },
    clearCouponState(state) {
      state.couponError = null;
      state.coupon = [];
      state.couponMessage = null;
      state.couponDeleteMessage = null;
      state.couponUpdateMessage = null;
    },
    clearCouponMessages(state) {
      state.couponMessage = null;
      state.couponDeleteMessage = null;
      state.couponUpdateMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch coupons
      .addCase(fetchCoupon.pending, (state) => {
        state.isCouponLoading = true;
        state.couponError = null;
      })
      .addCase(fetchCoupon.fulfilled, (state, action) => {
        state.isCouponLoading = false;
        state.coupon = action.payload?.data?.coupons;
      })
      .addCase(fetchCoupon.rejected, (state, action) => {
        state.isCouponLoading = false;
        state.couponError = action.payload;
      });
    builder
      // fetch coupon by id
      .addCase(fetchCouponById.pending, (state) => {
        state.isCouponLoading = true;
        state.couponError = null;
      })
      .addCase(fetchCouponById.fulfilled, (state, action) => {
        state.isCouponLoading = false;
        state.singleCoupon = action.payload?.data;
        console.log("SINGLE COUPON :", action.payload, )
      })
      .addCase(fetchCouponById.rejected, (state, action) => {
        state.isCouponLoading = false;
        state.couponError = action.payload;
      });
  },
});

export const { clearCouponError, clearCouponState, clearCouponMessages } =
  couponSlice.actions;
export default couponSlice.reducer;
