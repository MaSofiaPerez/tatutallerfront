import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../api";

// Obtener el carrito
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (cartToken, { rejectWithValue }) => {
    try {
      const res = await apiClient.get(`/cart`, {
        params: { cartToken }
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error al obtener el carrito");
    }
  }
);

// Agregar producto al carrito
export const addProductToCart = createAsyncThunk(
  "cart/addProductToCart",
  async ({ productId, quantity = 1, cartToken }, { rejectWithValue }) => {
    try {
      const res = await apiClient.post(`/cart/add`, null, {
        params: { productId, quantity, cartToken }
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error al agregar producto");
    }
  }
);

// Eliminar item del carrito
export const removeCartItem = createAsyncThunk(
  "cart/removeCartItem",
  async ({ itemId, cartToken }, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/cart/item/${itemId}`, { params: { cartToken } });
      return itemId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error al eliminar item");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: null,
    cartToken: null,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload.cart;
        state.cartToken = action.payload.cartToken;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addProductToCart.fulfilled, (state, action) => {
        state.cart = action.payload.cart;
        state.cartToken = action.payload.cartToken;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        if (state.cart && state.cart.items)
          state.cart.items = state.cart.items.filter(item => item.id !== action.payload);
      });
  },
});

export default cartSlice.reducer;