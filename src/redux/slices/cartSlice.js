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
      if (err.response?.status === 404) {
        // Carrito no existe, devolver carrito vacío
        return {
          cart: {
            id: null,
            token: cartToken,
            status: 'ACTIVE',
            items: []
          },
          cartToken: cartToken
        };
      }
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

// Actualizar cantidad de item del carrito
export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ itemId, quantity, cartToken }, { rejectWithValue }) => {
    try {
      const res = await apiClient.put(`/cart/update/${itemId}`, null, {
        params: { quantity, cartToken }
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error al actualizar item");
    }
  }
);

// Vaciar carrito
export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (cartToken, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/cart/clear`, { params: { cartToken } });
      return null;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error al vaciar carrito");
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
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCartToken: (state, action) => {
      state.cartToken = action.payload;
    }
  },
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
      .addCase(addProductToCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addProductToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload.cart;
        state.cartToken = action.payload.cartToken;
      })
      .addCase(addProductToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.cart = action.payload.cart;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        if (state.cart && state.cart.items)
          state.cart.items = state.cart.items.filter(item => item.id !== action.payload);
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(clearCart.fulfilled, (state) => {
        if (state.cart) {
          state.cart.items = [];
        }
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError, setCartToken } = cartSlice.actions;
export default cartSlice.reducer;