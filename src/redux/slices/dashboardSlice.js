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
