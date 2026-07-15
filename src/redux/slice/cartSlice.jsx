import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { extractError } from "../../utils/ErrorExtractor";
import { cartAPI } from "../../services/cartService";

const initialState = {
  cart: [],
  cartPage: 0,
  cartTotalPages: 0,
  totalCarts: 0,
  cartError: null,
  isCartLoading: false,
  cartStatus: "idle",
};

// Add or update an item in the cart
export const addCart = createAsyncThunk(
  "cart/add",
  async ({ data }, { rejectWithValue }) => {
    try {
      const cartData = await cartAPI.addCart(data);
      return cartData;
    } catch (err) {
      return rejectWithValue(extractError(err, "Failed to save cart"));
    }
  },
);

// Fetch the cart for a specific user from backend
export const fetchCart = createAsyncThunk(
  "cart/fetch",
  async ({ userId }, { rejectWithValue }) => {
    try {
      const allCarts = await cartAPI.fetchCart(userId);
      return allCarts;
    } catch (err) {
      return rejectWithValue(extractError(err, "Failed to load cart"));
    }
  },
);

//remove cart from the backend
export const removeCart = createAsyncThunk(
  "cart/remove",
  async ({ data }, { rejectWithValue }) => {
    try {
      const cartData = await cartAPI.removeCart(data);
      return cartData;
    } catch (err) {
      return rejectWithValue(extractError(err, "Failed to remove item"));
    }
  },
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCartError(state) {
      state.cartError = null;
    },
    clearCartState(state) {
      state.cartError = null;
      state.cart = [];
      localStorage.removeItem("Cart");
    },
  },
  extraReducers: (builder) => {
    builder
      // add to cart
      .addCase(addCart.pending, (state) => {
        state.isCartLoading = true;
        state.cartError = null;
      })
      .addCase(addCart.fulfilled, (state, action) => {
        state.isCartLoading = false;
        state.cart = action.payload;
      })
      .addCase(addCart.rejected, (state, action) => {
        state.isCartLoading = false;
        state.cartError = action.payload;
      });
    builder
      // fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.isCartLoading = true;
        state.cartStatus = "loading";
        state.cartError = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isCartLoading = false;
        state.cartStatus = "succeeded";
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isCartLoading = false;
        state.cartStatus = "failed";
        state.cartError = action.payload;
      });
    builder
      // remove from cart
      .addCase(removeCart.pending, (state) => {
        state.isCartLoading = true;
        state.cartError = null;
      })
      .addCase(removeCart.fulfilled, (state, action) => {
        state.isCartLoading = false;
        state.cart = action.payload;
      })
      .addCase(removeCart.rejected, (state, action) => {
        state.isCartLoading = false;
        state.cartError = action.payload;
      });
  },
});

export const { clearCartError, clearCartState } = cartSlice.actions;
export default cartSlice.reducer;
