import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../api';

// Async thunks para las operaciones de usuarios (solo admin)
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/admin/users');
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al obtener los usuarios'
      );
    }
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/admin/users', userData);
      return response.data;
    } catch (error) {
      console.error('Error en createUser:', error);
      console.error('Error response:', error.response);
      console.error('Error response data:', error.response?.data);
      
      // Priorizar diferentes fuentes de mensaje de error
      let errorMessage = 'Error al crear el usuario';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data) {
        // Si data es una string directamente
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.msg) {
          errorMessage = error.response.data.msg;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      console.error('Mensaje de error final:', errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, ...userData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/admin/users/${id}`, userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al actualizar el usuario'
      );
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/admin/users/${userId}`);
      return userId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al eliminar el usuario'
      );
    }
  }
);

export const fetchUserById = createAsyncThunk(
  'users/fetchUserById',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al obtener el usuario'
      );
    }
  }
);

export const updateUserRole = createAsyncThunk(
  'users/updateUserRole',
  async ({ userId, role }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/users/${userId}/role`, { role });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al actualizar el rol del usuario'
      );
    }
  }
);

export const toggleUserStatus = createAsyncThunk(
  'users/toggleUserStatus',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/users/${userId}/toggle-status`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al cambiar el estado del usuario'
      );
    }
  }
);

export const fetchTeachers = createAsyncThunk(
  'users/fetchTeachers',
  async (_, { rejectWithValue }) => {
    try {
      // Primero intentamos el endpoint específico de teachers
      let response;
      try {
        response = await apiClient.get('/admin/teachers');
        console.log('✅ Respuesta de /admin/teachers:', response.data);
        return response.data;
      } catch (error) {
        console.log('❌ Endpoint /admin/teachers falló:', error.response?.status, error.response?.data);
        
        // Si no existe el endpoint, obtenemos todos los usuarios y filtramos
        console.log('🔄 Intentando /admin/users como fallback...');
        try {
          const usersResponse = await apiClient.get('/admin/users');
          console.log('✅ Respuesta de /admin/users:', usersResponse.data);
          
          const allUsers = usersResponse.data.users || usersResponse.data;
          console.log('👥 Todos los usuarios:', allUsers);
          
          if (!Array.isArray(allUsers)) {
            console.log('⚠️ Los datos de usuarios no son un array:', typeof allUsers, allUsers);
            return { teachers: [] };
          }
          
          const teachers = allUsers.filter(user => {
            const role = user.role?.toLowerCase();
            const isTeacher = role === 'teacher' || role === 'instructor' || role === 'profesor';
            console.log(`Usuario ${user.name || user.username}: rol="${role}", esTeacher=${isTeacher}`);
            return isTeacher;
          });
          
          console.log('🎓 Teachers filtrados:', teachers);
          return { teachers };
        } catch (usersError) {
          console.log('❌ También falló /admin/users:', usersError);
          throw usersError;
        }
      }
    } catch (error) {
      console.error('💥 Error general al obtener teachers:', error);
      return rejectWithValue(
        error.response?.data?.message || 'Error al obtener los profesores'
      );
    }
  }
);

// Obtener estudiantes de las clases del teacher logueado
export const fetchMyStudents = createAsyncThunk(
  'users/fetchMyStudents',
  async (_, { rejectWithValue }) => {
    try {
      // Intentar endpoint específico para estudiantes del teacher
      try {
        const response = await apiClient.get('/teacher/my-students');
        console.log('✅ Estudiantes del teacher:', response.data);
        return response.data;
      } catch (error) {
        console.log('❌ Endpoint /teacher/my-students no disponible, usando fallback...');
        
        // Fallback: obtener clases del teacher y luego estudiantes
        try {
          const classesResponse = await apiClient.get('/teacher/my-classes');
          const myClasses = classesResponse.data.classes || classesResponse.data;
          console.log('📚 Mis clases:', myClasses);
          
          // Obtener estudiantes inscritos en mis clases
          const studentsResponse = await apiClient.get('/teacher/students-from-classes');
          const students = studentsResponse.data.students || studentsResponse.data;
          console.log('👥 Mis estudiantes:', students);
          
          return { students };
        } catch (fallbackError) {
          console.log('❌ Fallback también falló, usando /admin/users filtrado...');
          
          // Último fallback: obtener todos los usuarios y filtrar estudiantes
          const usersResponse = await apiClient.get('/admin/users');
          const allUsers = usersResponse.data.users || usersResponse.data;
          const students = allUsers.filter(user => {
            const role = user.role?.toLowerCase();
            return role === 'user' || role === 'student' || role === 'estudiante' || role === 'usuario' || !role;
          });
          
          console.log('👥 Estudiantes filtrados (temporal):', students);
          return { students };
        }
      }
    } catch (error) {
      console.error('💥 Error al obtener mis estudiantes:', error);
      return rejectWithValue(
        error.response?.data?.message || 'Error al obtener los estudiantes'
      );
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    teachers: [],
    myStudents: [], // Para teachers: sus estudiantes específicos
    currentUser: null,
    isLoading: false,
    error: null,
    totalUsers: 0,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
    },
    filters: {
      role: '',
      status: '',
      search: '',
    },
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        role: '',
        status: '',
        search: '',
      };
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.users || action.payload;
        state.totalUsers = action.payload.total || action.payload.length;
        state.pagination = {
          ...state.pagination,
          total: action.payload.total || action.payload.length,
        };
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Create user
      .addCase(createUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Manejar diferentes estructuras de respuesta del backend
        const newUser = action.payload.user || action.payload;
        
        console.log('Usuario creado - payload completo:', action.payload);
        console.log('Usuario creado - newUser:', newUser);
        
        if (newUser && newUser.id) {
          // Solo agregar si el usuario tiene ID (es válido)
          state.users.push(newUser);
          state.currentUser = newUser;
          state.totalUsers += 1;
          console.log('✅ Usuario agregado al estado:', newUser);
        } else {
          console.warn('⚠️ Usuario creado pero sin estructura válida:', action.payload);
        }
        
        state.error = null;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Update user
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.users.findIndex(u => u.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        state.currentUser = action.payload;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = state.users.filter(u => u.id !== action.payload);
        if (state.currentUser && state.currentUser.id === action.payload) {
          state.currentUser = null;
        }
        state.totalUsers -= 1;
        state.error = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch user by ID
      .addCase(fetchUserById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload;
        state.error = null;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Update user role
      .addCase(updateUserRole.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.users.findIndex(u => u.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Toggle user status
      .addCase(toggleUserStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.users.findIndex(u => u.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(toggleUserStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch teachers
      .addCase(fetchTeachers.pending, (state) => {
        console.log('Fetch teachers: pending...');
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTeachers.fulfilled, (state, action) => {
        console.log('Fetch teachers: fulfilled', action.payload);
        state.isLoading = false;
        state.teachers = action.payload.teachers || action.payload;
        console.log('Teachers actualizados en store:', state.teachers);
        state.error = null;
      })
      .addCase(fetchTeachers.rejected, (state, action) => {
        console.log('Fetch teachers: rejected', action.payload);
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch my students (for teachers)
      .addCase(fetchMyStudents.pending, (state) => {
        console.log('Fetch my students: pending...');
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyStudents.fulfilled, (state, action) => {
        console.log('Fetch my students: fulfilled', action.payload);
        state.isLoading = false;
        state.myStudents = action.payload.students || action.payload;
        console.log('My students actualizados en store:', state.myStudents);
        state.error = null;
      })
      .addCase(fetchMyStudents.rejected, (state, action) => {
        console.log('Fetch my students: rejected', action.payload);
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  clearError, 
  setCurrentUser, 
  clearCurrentUser, 
  setFilters, 
  clearFilters,
  setPagination 
} = usersSlice.actions;
export default usersSlice.reducer;
