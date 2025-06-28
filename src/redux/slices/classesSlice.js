import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../api';

// Async thunks para las operaciones de clases
export const fetchClasses = createAsyncThunk(
  'classes/fetchClasses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/admin/classes');
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al obtener las clases'
      );
    }
  }
);

// Fetch clases públicas (para mostrar sin autenticación)
export const fetchPublicClasses = createAsyncThunk(
  'classes/fetchPublicClasses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/public/classes');
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al obtener las clases'
      );
    }
  }
);

export const createClass = createAsyncThunk(
  'classes/createClass',
  async (classData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/admin/classes', classData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al crear la clase'
      );
    }
  }
);

export const updateClass = createAsyncThunk(
  'classes/updateClass',
  async ({ id, ...classData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/admin/classes/${id}`, classData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al actualizar la clase'
      );
    }
  }
);

export const deleteClass = createAsyncThunk(
  'classes/deleteClass',
  async (classId, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/admin/classes/${classId}`);
      return classId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al eliminar la clase'
      );
    }
  }
);

export const fetchClassById = createAsyncThunk(
  'classes/fetchClassById',
  async (classId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/classes/${classId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al obtener la clase'
      );
    }
  }
);

const classesSlice = createSlice({
  name: 'classes',
  initialState: {
    classes: [],
    currentClass: null,
    isLoading: false,
    error: null,
    hasLoadedPublicClasses: false,
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
    resetLoadedFlag: (state) => {
      state.hasLoadedPublicClasses = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch classes
      .addCase(fetchClasses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.classes = action.payload;
        state.error = null;
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch public classes
      .addCase(fetchPublicClasses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPublicClasses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.classes = action.payload;
        state.error = null;
        state.hasLoadedPublicClasses = true;
      })
      .addCase(fetchPublicClasses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.hasLoadedPublicClasses = true; // Marcar como intentado incluso si falló
      })
      
      // Create class
      .addCase(createClass.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createClass.fulfilled, (state, action) => {
        state.isLoading = false;
        state.classes.push(action.payload);
        state.currentClass = action.payload;
        state.error = null;
      })
      .addCase(createClass.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Update class
      .addCase(updateClass.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateClass.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.classes.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.classes[index] = action.payload;
        }
        state.currentClass = action.payload;
        state.error = null;
      })
      .addCase(updateClass.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Delete class
      .addCase(deleteClass.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteClass.fulfilled, (state, action) => {
        state.isLoading = false;
        state.classes = state.classes.filter(c => c.id !== action.payload);
        if (state.currentClass && state.currentClass.id === action.payload) {
          state.currentClass = null;
        }
        state.error = null;
      })
      .addCase(deleteClass.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch class by ID
      .addCase(fetchClassById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchClassById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentClass = action.payload;
        state.error = null;
      })
      .addCase(fetchClassById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setCurrentClass, clearCurrentClass, resetLoadedFlag } = classesSlice.actions;
export default classesSlice.reducer;
