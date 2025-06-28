import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../api';

// Async thunks para las operaciones del dashboard
export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/admin/dashboard/stats');
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al obtener estadísticas del dashboard'
      );
    }
  }
);

export const fetchRecentBookings = createAsyncThunk(
  'dashboard/fetchRecentBookings',
  async (limit = 5, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/admin/dashboard/recent-bookings?limit=${limit}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al obtener reservas recientes'
      );
    }
  }
);

// Para teachers: obtener solo sus reservas (de sus clases)
export const fetchMyRecentBookings = createAsyncThunk(
  'dashboard/fetchMyRecentBookings',
  async (limit = 5, { rejectWithValue }) => {
    try {
      // Intentar endpoint específico para reservas del teacher
      try {
        const response = await apiClient.get(`/teacher/dashboard/recent-bookings?limit=${limit}`);
        console.log('✅ Mis reservas recientes:', response.data);
        return response.data;
      } catch (error) {
        console.log('❌ Endpoint teacher/dashboard no disponible, usando fallback...');
        
        // Fallback: obtener reservas de mis clases
        try {
          const response = await apiClient.get(`/teacher/my-bookings?limit=${limit}`);
          console.log('✅ Mis reservas (fallback):', response.data);
          return response.data;
        } catch (fallbackError) {
          console.log('❌ Fallback también falló, usando datos limitados...');
          
          // Último fallback: devolver array vacío con mensaje
          return {
            bookings: [],
            message: "Configurar endpoints específicos para teacher en el backend"
          };
        }
      }
    } catch (error) {
      console.error('💥 Error al obtener mis reservas:', error);
      return rejectWithValue(
        error.response?.data?.message || 'Error al obtener las reservas del teacher'
      );
    }
  }
);

// Para teachers: obtener estadísticas específicas
export const fetchMyDashboardStats = createAsyncThunk(
  'dashboard/fetchMyDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      // Intentar endpoint específico para stats del teacher
      try {
        const response = await apiClient.get('/teacher/dashboard/stats');
        console.log('✅ Mis estadísticas:', response.data);
        return response.data;
      } catch (error) {
        console.log('❌ Endpoint teacher/dashboard/stats no disponible, calculando...');
        
        // Fallback: calcular estadísticas básicas
        try {
          const classesResponse = await apiClient.get('/teacher/my-classes');
          const bookingsResponse = await apiClient.get('/teacher/my-bookings');
          
          const myClasses = classesResponse.data.classes || classesResponse.data || [];
          const myBookings = bookingsResponse.data.bookings || bookingsResponse.data || [];
          
          // Calcular estadísticas básicas
          const stats = {
            totalClasses: myClasses.length,
            totalBookings: myBookings.length,
            pendingBookings: myBookings.filter(b => b.status === 'pending').length,
            completedBookings: myBookings.filter(b => b.status === 'completed').length,
            totalStudents: 0, // Se calculará cuando tengamos la relación
          };
          
          console.log('📊 Estadísticas calculadas:', stats);
          return stats;
        } catch (fallbackError) {
          console.log('❌ No se pudieron calcular estadísticas, usando valores por defecto...');
          
          // Estadísticas por defecto
          return {
            totalClasses: 0,
            totalBookings: 0,
            pendingBookings: 0,
            completedBookings: 0,
            totalStudents: 0,
            message: "Configurar endpoints específicos para teacher en el backend"
          };
        }
      }
    } catch (error) {
      console.error('💥 Error al obtener mis estadísticas:', error);
      return rejectWithValue(
        error.response?.data?.message || 'Error al obtener las estadísticas del teacher'
      );
    }
  }
);

// Los siguientes endpoints no están disponibles en el backend actual
// Se pueden implementar más adelante si es necesario

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    stats: {
      totalUsers: 0,
      totalBookings: 0,
      totalRevenue: 0,
      totalClasses: 0,
      totalProducts: 0,
      activeUsers: 0,
      pendingBookings: 0,
      completedBookings: 0,
    },
    recentBookings: [],
    // Los siguientes campos se pueden agregar más tarde cuando se implementen en el backend
    // monthlyRevenue: [],
    // popularClasses: [],
    // userGrowth: [],
    // bookingsByStatus: [],
    isLoading: false,
    error: null,
    lastUpdated: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setLastUpdated: (state) => {
      state.lastUpdated = new Date().toISOString();
    },
    refreshDashboard: (state) => {
      state.isLoading = true;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch dashboard stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch recent bookings
      .addCase(fetchRecentBookings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRecentBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.recentBookings = action.payload;
        state.error = null;
      })
      .addCase(fetchRecentBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
      
      // Los siguientes reducers se pueden agregar más tarde cuando se implementen en el backend:
      // - fetchMonthlyRevenue
      // - fetchPopularClasses  
      // - fetchUserGrowth
      // - fetchBookingsByStatus
  },
});

export const { clearError, setLastUpdated, refreshDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;
