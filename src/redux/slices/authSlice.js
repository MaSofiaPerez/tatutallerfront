import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../api';

// Async thunks para las operaciones de autenticación
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      console.log('Response completa del login:', response.data);
      
      // Manejar diferentes estructuras de respuesta del backend
      let token, user;
      
      if (response.data.token && response.data.user) {
        token = response.data.token;
        user = response.data.user;
      } else if (response.data.access_token) {
        token = response.data.access_token;
        user = response.data.user || response.data;
      } else if (response.data.jwt) {
        token = response.data.jwt;
        user = response.data.user || response.data;
      } else {
        token = response.data.token || null;
        user = response.data.user || response.data;
      }
      
      if (token) {
        localStorage.setItem('token', token);
      }
      
      return { token, user };
    } catch (error) {
      console.error('Error completo en login:', error);
      return rejectWithValue(
        error.response?.data?.message || error.response?.data || 'Credenciales inválidas'
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      console.log('Response completa del registro:', response.data);
      
      let token, user;
      
      if (response.data.token && response.data.user) {
        token = response.data.token;
        user = response.data.user;
      } else if (response.data.access_token) {
        token = response.data.access_token;
        user = response.data.user || response.data;
      } else if (response.data.jwt) {
        token = response.data.jwt;
        user = response.data.user || response.data;
      } else if (typeof response.data === 'string') {
        return { success: true, message: response.data };
      } else {
        token = response.data.token || null;
        user = response.data;
      }
      
      if (token) {
        localStorage.setItem('token', token);
      }
      
      return { token, user };
    } catch (error) {
      console.error('Error completo en registro:', error);
      return rejectWithValue(
        error.response?.data?.message || error.response?.data || 'Error al registrarse'
      );
    }
  }
);

export const verifyToken = createAsyncThunk(
  'auth/verifyToken',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      
      const response = await apiClient.get('/auth/verify');
      return response.data.user;
    } catch (error) {
      localStorage.removeItem('token');
      return rejectWithValue('Token inválido');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { dispatch }) => {
    localStorage.removeItem('token');
    return {};
  }
);

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isAdmin: false,
  isTeacher: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isAdmin = false;
      state.isTeacher = false;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user || {};
        state.token = action.payload.token;
        // Verificar roles del usuario
        const userRole = action.payload.user?.role?.toLowerCase();
        state.isAdmin = userRole === 'admin' || userRole === 'administrator';
        state.isTeacher = userRole === 'teacher' || userRole === 'instructor';
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.isAdmin = false;
        state.isTeacher = false;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        
        if (action.payload.success && !action.payload.token) {
          state.error = null;
          return;
        }
        
        state.isAuthenticated = true;
        state.user = action.payload.user || {};
        state.token = action.payload.token;
        // Verificar roles del usuario
        const userRole = action.payload.user?.role?.toLowerCase();
        state.isAdmin = userRole === 'admin' || userRole === 'administrator';
        state.isTeacher = userRole === 'teacher' || userRole === 'instructor';
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(verifyToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        // Verificar roles del usuario
        const userRole = action.payload.role?.toLowerCase();
        state.isAdmin = userRole === 'admin' || userRole === 'administrator';
        state.isTeacher = userRole === 'teacher' || userRole === 'instructor';
      })
      .addCase(verifyToken.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.isAdmin = false;
        state.isTeacher = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isAdmin = false;
        state.isTeacher = false;
        state.error = null;
      });
  },
});

export const { clearError, logout } = authSlice.actions;
export default authSlice.reducer;
