import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { extractError } from "../../utils/ErrorExtractor";

const initialState = {
  cart: [],
  singleCart: null,
  cartPage: 0,
  cartTotalPages: 0,
  totalCarts: 0,
  cartError: null,
  isCartLoading: false,
};

// Add or update an item in the cart
export const addCart = createAsyncThunk(
  "cart/add-cart",
  async ({ productId, userId, sellerId }, { rejectWithValue }) => {
    try {
      const existingCart = JSON.parse(localStorage.getItem("Cart")) || [];
      const existingItem = existingCart.find((i) => i.productId === productId);

      const updatedCart = existingItem
        ? existingCart.map((i) =>
            i.productId === productId ? { ...i, qnty: i.qnty + 1 } : i,
          )
        : [...existingCart, { productId, userId, sellerId, qnty: 1 }];

      localStorage.setItem("Cart", JSON.stringify(updatedCart));
      return updatedCart;
    } catch (err) {
      return rejectWithValue(extractError(err, "Failed to save cart"));
    }
  },
);

// Fetch the cart from localStorage
export const fetchCart = createAsyncThunk(
  "cart/fetch-cart",
  async (_, { rejectWithValue }) => {
    try {
      const cart = localStorage.getItem("Cart");
      return cart ? JSON.parse(cart) : [];
    } catch (err) {
      return rejectWithValue(extractError(err, "Failed to load cart"));
    }
  },
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearError(state) {
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
      })
      // fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.isCartLoading = true;
        state.cartError = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isCartLoading = false;
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isCartLoading = false;
        state.cartError = action.payload;
      });
  },
});

export const { clearError, clearCartState } = cartSlice.actions;
export default cartSlice.reducer;
