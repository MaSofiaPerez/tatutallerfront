import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../api';

// Async thunks para las operaciones de profesores
export const fetchMyClasses = createAsyncThunk(
  'teacher/fetchMyClasses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/teacher/my-classes');
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al obtener mis clases'
      );
    }
  }
);

export const fetchMyBookings = createAsyncThunk(
  'teacher/fetchMyBookings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/teacher/my-bookings');
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al obtener mis reservas'
      );
    }
  }
);

export const fetchClassStudents = createAsyncThunk(
  'teacher/fetchClassStudents',
  async (classId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/teacher/classes/${classId}/students`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al obtener estudiantes de la clase'
      );
    }
  }
);

export const updateBookingStatus = createAsyncThunk(
  'teacher/updateBookingStatus',
  async ({ bookingId, status }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/teacher/bookings/${bookingId}/status`, { status });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al actualizar estado de la reserva'
      );
    }
  }
);

export const removeStudentFromBooking = createAsyncThunk(
  'teacher/removeStudentFromBooking',
  async (bookingId, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/teacher/bookings/${bookingId}`);
      return bookingId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al eliminar estudiante de la reserva'
      );
    }
  }
);

const teacherSlice = createSlice({
  name: 'teacher',
  initialState: {
    myClasses: [],
    myBookings: [],
    classStudents: {},
    currentClass: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentClass: (state, action) => {
      state.currentClass = action.payload;
    },
    clearCurrentClass: (state) => {
      state.currentClass = null;
    },
    clearClassStudents: (state, action) => {
      const classId = action.payload;
      delete state.classStudents[classId];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch my classes
      .addCase(fetchMyClasses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyClasses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myClasses = action.payload;
        state.error = null;
      })
      .addCase(fetchMyClasses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch my bookings
      .addCase(fetchMyBookings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myBookings = action.payload;
        state.error = null;
      })
      .addCase(fetchMyBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch class students
      .addCase(fetchClassStudents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchClassStudents.fulfilled, (state, action) => {
        state.isLoading = false;
        const classId = action.meta.arg;
        state.classStudents[classId] = action.payload;
        state.error = null;
      })
      .addCase(fetchClassStudents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Update booking status
      .addCase(updateBookingStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.myBookings.findIndex(b => b.id === action.payload.id);
        if (index !== -1) {
          state.myBookings[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateBookingStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Remove student from booking
      .addCase(removeStudentFromBooking.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeStudentFromBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myBookings = state.myBookings.filter(b => b.id !== action.payload);
        state.error = null;
      })
      .addCase(removeStudentFromBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  clearError, 
  setCurrentClass, 
  clearCurrentClass, 
  clearClassStudents 
} = teacherSlice.actions;
export default teacherSlice.reducer;
