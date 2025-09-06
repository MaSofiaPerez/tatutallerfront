import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../api';
import { resetCart } from "./cartSlice"; // importa el action

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

export const googleLogin = createAsyncThunk(
  'auth/googleLogin',
  async (credential, { rejectWithValue }) => {
    try {
      // Cambia 'credential' por 'token' en el body
      const response = await apiClient.post('/auth/login-google', {
        token: credential,
      });

      let token = response.data.token;
      let user = response.data.user;

      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
      }

      return { token, user };
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data ||
          'Error al iniciar sesión con Google'
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      // Limpiar cualquier token existente antes del registro
      localStorage.removeItem('token');
      
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
        // Backend devuelve solo un mensaje string (registro exitoso sin auto-login)
        return { success: true, message: response.data };
      } else {
        token = response.data.token || null;
        user = response.data;
      }
      
      if (token) {
        localStorage.setItem('token', token);
        return { token, user };
      } else {
        // Registro exitoso pero sin token (requiere login)
        return { success: true, message: response.data.message || 'Registro exitoso' };
      }
    } catch (error) {
      console.error('Error completo en registro:', error);
      // Asegurar que no quede token en caso de error
      localStorage.removeItem('token');
      
      // Mejorar la extracción del mensaje de error
      let errorMessage = 'Error al registrarse';
      
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      console.log('Mensaje de error extraído para Redux:', errorMessage);
      
      return rejectWithValue(errorMessage);
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
    dispatch(resetCart());
    return {};
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await apiClient.put('/users/profile', profileData);
      
      // Actualizar también el localStorage
      const updatedUser = response.data.user || response.data;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return updatedUser;
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      return rejectWithValue(
        error.response?.data?.message || error.response?.data || 'Error al actualizar el perfil'
      );
    }
  }
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await apiClient.put('/users/change-password', passwordData);
      return response.data.message || 'Contraseña actualizada exitosamente';
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      return rejectWithValue(
        error.response?.data?.message || error.response?.data || 'Error al cambiar la contraseña'
      );
    }
  }
);

export const fetchUserDetails = createAsyncThunk(
  'auth/fetchUserDetails',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await apiClient.get('/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener detalles del usuario:', error);
      return rejectWithValue(
        error.response?.data?.message || 'Error al obtener detalles del usuario'
      );
    }
  }
);

// Leer usuario y token de localStorage al iniciar
const userFromStorage = JSON.parse(localStorage.getItem('user') || 'null');
const tokenFromStorage = localStorage.getItem('token');

const initialState = {
  isAuthenticated: !!tokenFromStorage,
  user: userFromStorage,
  token: tokenFromStorage,
  isAdmin: userFromStorage?.role?.toLowerCase() === 'admin' || userFromStorage?.role?.toLowerCase() === 'administrator',
  isTeacher: userFromStorage?.role?.toLowerCase() === 'teacher' || userFromStorage?.role?.toLowerCase() === 'instructor',
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
      localStorage.removeItem('user');
    },
  },
  extraReducers: (builder) => {
    builder
      // Google Login
      .addCase(googleLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user || {};
        state.token = action.payload.token;
        // Verificar roles del usuario solo si está autenticado
        if (state.isAuthenticated) {
          const userRole = action.payload.user?.role?.toLowerCase() || "";
          state.isAdmin = userRole === 'admin' || userRole === 'administrator';
          state.isTeacher = userRole === 'teacher' || userRole === 'instructor';
        } else {
          state.isAdmin = false;
          state.isTeacher = false;
        }
        state.error = null;
        
        // ✅ Guardar usuario en localStorage para acceso al campo mustChangePassword
        if (action.payload.user) {
          localStorage.setItem('user', JSON.stringify(action.payload.user));
        }

        // Agregar console.log dentro de un fulfilled para depuración
        console.log("Estado de autenticación después de googleLogin:", {
          isAuthenticated: state.isAuthenticated,
          user: state.user,
          role: state.user?.role,
        });
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.isAdmin = false;
        state.isTeacher = false;
        // Limpiar localStorage en caso de error
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      })
      // Regular Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user || {};
        state.token = action.payload.token;
        // Verificar roles del usuario solo si está autenticado
        if (state.isAuthenticated) {
          const userRole = action.payload.user?.role?.toLowerCase() || "";
          state.isAdmin = userRole === 'admin' || userRole === 'administrator';
          state.isTeacher = userRole === 'teacher' || userRole === 'instructor';
        } else {
          state.isAdmin = false;
          state.isTeacher = false;
        }
        state.error = null;
        
        // Log the payload to debug missing fields
        console.log('Datos del usuario tras iniciar sesión:', action.payload.user);
        
        // ✅ Guardar usuario en localStorage para acceso al campo mustChangePassword
        if (action.payload.user) {
          localStorage.setItem('user', JSON.stringify(action.payload.user));
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.isAdmin = false;
        state.isTeacher = false;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Si el registro es exitoso pero no hay token (requiere login)
        if (action.payload.success && !action.payload.token) {
          // Limpiar cualquier token residual y mantener usuario no autenticado
          state.isAuthenticated = false;
          state.user = null;
          state.token = null;
          state.isAdmin = false;
          state.isTeacher = false;
          state.error = null;
          // Limpiar localStorage por si acaso
          localStorage.removeItem('token');
          return;
        }
        
        // Solo autenticar si hay token válido
        if (action.payload.token) {
          state.isAuthenticated = true;
          state.user = action.payload.user || {};
          state.token = action.payload.token;
          // Verificar roles del usuario solo si está autenticado
          if (state.isAuthenticated) {
            const userRole = action.payload.user?.role?.toLowerCase() || "";
            state.isAdmin = userRole === 'admin' || userRole === 'administrator';
            state.isTeacher = userRole === 'teacher' || userRole === 'instructor';
          } else {
            state.isAdmin = false;
            state.isTeacher = false;
          }
          state.error = null;
        } else {
          // Respuesta inesperada sin success flag ni token
          state.isAuthenticated = false;
          state.user = null;
          state.token = null;
          state.isAdmin = false;
          state.isTeacher = false;
          state.error = null;
          localStorage.removeItem('token');
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.isAdmin = false;
        state.isTeacher = false;
        // Limpiar localStorage en caso de error
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      })
      .addCase(verifyToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        // Verificar roles del usuario solo si está autenticado
        if (state.isAuthenticated) {
          const userRole = action.payload.role?.toLowerCase() || "";
          state.isAdmin = userRole === 'admin' || userRole === 'administrator';
          state.isTeacher = userRole === 'teacher' || userRole === 'instructor';
        } else {
          state.isAdmin = false;
          state.isTeacher = false;
        }
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
      })
      // Update Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = { ...state.user, ...action.payload };
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Change Password
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch User Details
      .addCase(fetchUserDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = { ...state.user, ...action.payload };
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, logout } = authSlice.actions;
export default authSlice.reducer;
