import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { extractError } from "../../utils/ErrorExtractor";
import { cartAPI } from "../../services/cartService";

const initialState = {
  cart: [],
  cartPage: 0,
  cartMessage: null,
  cartDeleteMessage: null,
  cartUpdateMessage: null,
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

export const updateQuantity = createAsyncThunk(
  "cart/update",
  async ({ data }, { rejectWithValue }) => {
    try {
      const cartData = await cartAPI.updateQuantity(data);
      return cartData;
    } catch (err) {
      return rejectWithValue(extractError(err, "Failed to update cart"));
    }
  },
);

// Fetch the cart for a specific user from backend
export const fetchCart = createAsyncThunk(
  "cart/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const allCarts = await cartAPI.fetchCart();
      console.log("ALL CARTS FROM SLICE", allCarts);
      return allCarts;
    } catch (err) {
      return rejectWithValue(extractError(err, "Failed to load cart"));
    }
  },
);

//remove cart from the backend
export const removeCart = createAsyncThunk(
  "cart/remove",
  async ({ productId }, { rejectWithValue }) => {
    try {
      console.log("CART DATA TO THE BACKEND : ", productId);
      const cartData = await cartAPI.removeCart(productId);
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
      state.cartMessage = null;
      state.cartDeleteMessage = null;
      state.cartUpdateMessage = null;
    },
    clearCartState(state) {
      state.cartError = null;
      state.cart = [];
      state.cartMessage = null;
      state.cartDeleteMessage = null;
      state.cartUpdateMessage = null;
    },
    clearCartMessages(state) {
      state.cartMessage = null;
      state.cartDeleteMessage = null;
      state.cartUpdateMessage = null;
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
        state.cartMessage = action.payload.message;
      })
      .addCase(addCart.rejected, (state, action) => {
        state.isCartLoading = false;
        state.cartError = action.payload?.data?.error;
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
        state.cart = action.payload?.data?.cart;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isCartLoading = false;
        state.cartStatus = "failed";
        state.cartError = action.payload;
        console.log("CART FETCH FAILED :", action.payload);
      });
    builder
      // remove from cart
      .addCase(removeCart.pending, (state) => {
        state.isCartLoading = true;
        state.cartError = null;
        state.cartDeleteMessage = null;
      })
      .addCase(removeCart.fulfilled, (state, action) => {
        state.isCartLoading = false;
        state.cart = action.payload?.data?.cart;
        state.cartDeleteMessage = action.payload?.message;
      })
      .addCase(removeCart.rejected, (state, action) => {
        state.isCartLoading = false;
        state.cartError = action.payload;
        state.cartDeleteMessage = action.payload?.message;
      });
    builder
      //update quantity
      .addCase(updateQuantity.pending, (state) => {
        state.isCartLoading = true;
        state.cartError = null;
        state.cartUpdateMessage = null;
      })
      .addCase(updateQuantity.fulfilled, (state, action) => {
        state.isCartLoading = false;
        state.cart = action.payload?.data?.cart;
        state.cartUpdateMessage = action.payload?.message;
      })
      .addCase(updateQuantity.rejected, (state, action) => {
        state.isCartLoading = false;
        state.cartError = action.payload;
        state.cartUpdateMessage = action.payload?.message;
      });
  },
});

export const { clearCartError, clearCartState, clearCartMessages } =
  cartSlice.actions;
export default cartSlice.reducer;
