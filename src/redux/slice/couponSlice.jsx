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
export const changeCouponStatus = createAsyncThunk(
  "coupon/changeStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const coupon = await couponAPI.changeCouponStatus(id, status);
      return coupon;
    } catch (err) {
      return rejectWithValue(extractError(err, "Failed to fetch Coupon"));
    }
  },
);

//delete product
export const deleteSingleCoupon = createAsyncThunk(
  "coupon/deleteCoupon",
  async ({ id }, { rejectWithValue }) => {
    try {
      await couponAPI.deleteCoupon(id);
      return { id };
    } catch (err) {
      return rejectWithValue(extractError(err, "deletion failed"));
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

export const updateCoupon = createAsyncThunk(
  "coupon/updateCoupon",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      console.log("ID FOR UPDATING COUPON :", id);
      console.log("DATA FOR UPDATING COUPON :", data);
      const response = await couponAPI.updateCoupon(id, data);
      return response;
    } catch (err) {
      return rejectWithValue(extractError(err, "Failed to update the product"));
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
        console.log("SINGLE COUPON :", action.payload);
      })
      .addCase(fetchCouponById.rejected, (state, action) => {
        state.isCouponLoading = false;
        state.couponError = action.payload;
      });
    //update a product
    builder
      .addCase(updateCoupon.pending, (state) => {
        state.couponError = null;
        state.isCouponLoading = true;
      })
      .addCase(updateCoupon.fulfilled, (state, action) => {
        state.isCouponLoading = false;
        state.singleCoupon = action.payload?.data;
      })
      .addCase(updateCoupon.rejected, (state, action) => {
        state.isCouponLoading = false;
        state.couponError = action.payload;
        state.singleCoupon = null;
      });

    //delete products
    builder
      .addCase(deleteSingleCoupon.pending, (state) => {
        state.couponError = null;
        state.isCouponLoading = true;
      })
      .addCase(deleteSingleCoupon.fulfilled, (state, action) => {
        state.isCouponLoading = false;
        state.coupon = state.coupon.filter(
          (coupon) => coupon._id !== action.payload.id,
        );
      })
      .addCase(deleteSingleCoupon.rejected, (state, action) => {
        state.isCouponLoading = false;
        state.couponError = action.payload;
      });

    //change coupon status
    builder
      .addCase(changeCouponStatus.pending, (state) => {
        state.couponError = null;
        state.isCouponLoading = true;
      })
      .addCase(changeCouponStatus.fulfilled, (state, action) => {
        state.isCouponLoading = false;
        state.coupon = action.coupon?.data;
        console.log("SINGLE COUPON :", action.payload);
      })
      .addCase(changeCouponStatus.rejected, (state, action) => {
        state.isCouponLoading = false;
        state.couponError = action.payload;
      });
  },
});

export const { clearCouponError, clearCouponState, clearCouponMessages } =
  couponSlice.actions;
export default couponSlice.reducer;
