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
  cartStatus: "idle",
};

const getAllCarts = () => JSON.parse(localStorage.getItem("Cart")) || {};

const saveAllCarts = (allCarts) => {
  localStorage.setItem("Cart", JSON.stringify(allCarts));
};

// Add or update an item in the cart
export const addCart = createAsyncThunk(
  "cart/add-cart",
  async ({ productId, userId, sellerId }, { rejectWithValue }) => {
    try {
      const allCarts = getAllCarts();
      const userItems = allCarts[userId] || [];

      const existingItem = userItems.find((i) => i.productId === productId);

      const updatedUserItems = existingItem
        ? userItems.map((i) =>
            i.productId === productId ? { ...i, qnty: i.qnty + 1 } : i,
          )
        : [...userItems, { productId, sellerId, qnty: 1 }];

      saveAllCarts({ ...allCarts, [userId]: updatedUserItems });

      // flat shape so Cart.jsx / reducers don't need to change
      return updatedUserItems.map((i) => ({ ...i, userId }));
    } catch (err) {
      return rejectWithValue(extractError(err, "Failed to save cart"));
    }
  },
);

// Fetch the cart for a specific user from localStorage
export const fetchCart = createAsyncThunk(
  "cart/fetch-cart",
  async ({ userId }, { rejectWithValue }) => {
    try {
      const allCarts = getAllCarts();
      const userItems = allCarts[userId] || [];
      return userItems.map((i) => ({ ...i, userId }));
    } catch (err) {
      return rejectWithValue(extractError(err, "Failed to load cart"));
    }
  },
);

// Update the quantity of a single item in a user's cart
export const updateCartQty = createAsyncThunk(
  "cart/update-qty",
  async ({ userId, productId, qnty }, { rejectWithValue }) => {
    try {
      if (qnty < 1) {
        return rejectWithValue("Quantity must be at least 1");
      }

      const allCarts = getAllCarts();
      const userItems = allCarts[userId] || [];

      const updatedUserItems = userItems.map((i) =>
        i.productId === productId ? { ...i, qnty } : i,
      );

      saveAllCarts({ ...allCarts, [userId]: updatedUserItems });

      return updatedUserItems.map((i) => ({ ...i, userId }));
    } catch (err) {
      return rejectWithValue(extractError(err, "Failed to update cart item"));
    }
  },
);

// Remove a single item from a user's cart
export const removeCart = createAsyncThunk(
  "cart/delete-cart",
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const allCarts = getAllCarts();
      const userItems = allCarts[userId] || [];

      const updatedUserItems = userItems.filter(
        (i) => i.productId !== productId,
      );

      saveAllCarts({ ...allCarts, [userId]: updatedUserItems });

      return updatedUserItems.map((i) => ({ ...i, userId }));
    } catch (err) {
      return rejectWithValue(extractError(err, "Failed to delete cart item"));
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
      // update qty
      .addCase(updateCartQty.pending, (state) => {
        state.isCartLoading = true;
        state.cartError = null;
      })
      .addCase(updateCartQty.fulfilled, (state, action) => {
        state.isCartLoading = false;
        state.cart = action.payload;
      })
      .addCase(updateCartQty.rejected, (state, action) => {
        state.isCartLoading = false;
        state.cartError = action.payload;
      });
    builder
      // remove item
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

export const { clearError, clearCartState } = cartSlice.actions;
export default cartSlice.reducer;
