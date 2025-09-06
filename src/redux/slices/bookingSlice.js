import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../api'; // Asegúrate de importar el default export
import { API_BASE_URL } from '../../utils/apiBase'; // <-- importa la URL base

// Async thunks para las operaciones de reservas
export const createBooking = createAsyncThunk(
  'booking/createBooking',
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/bookings', bookingData);
      console.log('Respuesta backend:', response);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al crear la reserva'
      );
    }
  }
);

export const fetchBookings = createAsyncThunk(
  'booking/fetchBookings',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      const response = await apiClient.get('/admin/bookings', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al obtener las reservas'
      );
    }
  }
);

// Fetch reservas del usuario actual
export const fetchMyBookings = createAsyncThunk(
  'booking/fetchMyBookings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/my-bookings');
      console.log('✅ Mis reservas obtenidas:', response.data);
      return response.data;
      
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al obtener mis reservas'
      );
    }
  }
);

export const fetchUserBookings = createAsyncThunk(
  'booking/fetchUserBookings',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/admin/bookings/user/${userId}`);
      console.log('✅ Reservas del usuario obtenidas:', response.data);
      return response.data;
    
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al obtener las reservas del usuario'
      );
    }
  }
);

export const updateBookingStatus = createAsyncThunk(
  'booking/updateBookingStatus',
  async ({ bookingId, status }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/admin/bookings/${bookingId}/status`, { status });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar estado de la reserva');
    }
  }
);

export const deleteBooking = createAsyncThunk(
  'booking/deleteBooking',
  async (bookingId, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/admin/bookings/${bookingId}`);
      return bookingId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al eliminar la reserva'
      );
    }
  }
);

export const fetchAvailableSlots = createAsyncThunk(
  'booking/fetchAvailableSlots',
  async ({ serviceId, date }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/bookings/available-slots`, {
        params: { serviceId, date }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al obtener horarios disponibles'
      );
    }
  }
);

// Helper function to safely parse JSON or return error message
const safeParseResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  
  try {
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      // If it's not JSON (e.g., HTML error page), read as text
      const text = await response.text();
      return { 
        message: `El servidor respondió con un error (${response.status}). Por favor, verifica que el endpoint esté configurado correctamente.`,
        details: text.length > 200 ? text.substring(0, 200) + '...' : text
      };
    }
  } catch (parseError) {
    // If JSON parsing fails, read as text
    try {
      const text = await response.text();
      return { 
        message: 'Error al procesar la respuesta del servidor',
        details: text.length > 200 ? text.substring(0, 200) + '...' : text
      };
    } catch (textError) {
      return { message: 'Error de comunicación con el servidor' };
    }
  }
};

// Thunk para notificar al profesor usando la estructura específica
export const notifyTeacherBooking = createAsyncThunk(
  'booking/notifyTeacherBooking',
  async (notificationData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      const response = await apiClient.post('/bookings/notify-teacher', notificationData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al notificar al profesor');
    }
  }
);

// Implementación del flujo específico solicitado
export const createBookingWithNotification = createAsyncThunk(
  'booking/createBookingWithNotification',
  async (bookingData, { dispatch, getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      const userInfo = auth.user;
      
      // 1. Crear la reserva
      const response = await apiClient.post('/bookings', bookingData);
      const booking = response.data;
      console.log('✅ Reserva creada:', booking);        // 2. Obtener detalles de la clase (incluyendo profesor)
        try {
          const classResponse = await apiClient.get(`/public/classes/${booking.classEntity.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          const classDetails = classResponse.data;
          console.log('✅ Detalles de clase obtenidos:', classDetails);
          
          // 3. Determinar información del profesor
          let teacherEmail = null;
          let teacherName = null;
          
          // Opción 1: instructor en los detalles de la clase
          if (classDetails.instructor && classDetails.instructor.email) {
            teacherEmail = classDetails.instructor.email;
            teacherName = classDetails.instructor.name;
          }
          // Opción 2: usuario creador de la clase
          else if (classDetails.user && classDetails.user.email) {
            teacherEmail = classDetails.user.email;
            teacherName = classDetails.user.name;
          }
          // Opción 3: campo teacher directo
          else if (classDetails.teacher && classDetails.teacher.email) {
            teacherEmail = classDetails.teacher.email;
            teacherName = classDetails.teacher.name;
          }
          // Opción 4: buscar en el booking response por si tiene info del profesor
          else if (booking.classEntity && booking.classEntity.user && booking.classEntity.user.email) {
            teacherEmail = booking.classEntity.user.email;
            teacherName = booking.classEntity.user.name;
          }
          // Opción 5: Si solo tenemos ID del profesor, obtener datos del usuario
          else if (classDetails.instructorId || classDetails.instructor_id || classDetails.teacherId || classDetails.teacher_id || classDetails.userId || classDetails.user_id) {
            const instructorId = classDetails.instructorId || classDetails.instructor_id || 
                               classDetails.teacherId || classDetails.teacher_id || 
                               classDetails.userId || classDetails.user_id;
            
            console.log(`🔍 Obteniendo datos del profesor con ID: ${instructorId}`);
            
            try {
              const instructorResponse = await apiClient.get(`/users/${instructorId}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              
              const instructorData = instructorResponse.data;
              if (instructorData && instructorData.email) {
                teacherEmail = instructorData.email;
                teacherName = instructorData.name;
                console.log(`✅ Datos del profesor obtenidos: ${teacherName} (${teacherEmail})`);
              } else {
                console.log('⚠️ No se pudo obtener datos del profesor desde /api/users/' + instructorId);
                // Intentar endpoint alternativo para usuarios públicos
                const publicUserResponse = await apiClient.get(`/public/users/${instructorId}`, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                });
                
                const publicUserData = publicUserResponse.data;
                if (publicUserData && publicUserData.email) {
                  teacherEmail = publicUserData.email;
                  teacherName = publicUserData.name;
                  console.log(`✅ Datos del profesor obtenidos desde endpoint público: ${teacherName} (${teacherEmail})`);
                }
              }
            } catch (instructorError) {
              console.log('❌ Error al obtener datos del profesor:', instructorError);
            }
          }
          
          if (teacherEmail) {
            console.log(`📧 Enviando notificación a: ${teacherName} (${teacherEmail})`);
            
            const notification = await apiClient.post('/bookings/notify-teacher', {
              bookingId: booking.id,
              teacherEmail: teacherEmail,
              teacherName: teacherName || 'Profesor/a',
              studentName: userInfo.name || userInfo.email,
              studentEmail: userInfo.email,
              className: classDetails.name || booking.classEntity.name,
              bookingDate: booking.bookingDate,
              bookingTime: booking.bookingTime,
              notes: booking.notes || ''
            }, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            
            if (notification.status === 200) {
              const notificationResult = notification.data;
              console.log('✅ Profesor notificado exitosamente:', notificationResult);
              
              // Dispatch acción de éxito de notificación
              dispatch(notifyTeacherBooking.fulfilled(notificationResult));
            } else {
              const errorData = notification.data;
              
              // Mensaje específico para error 404 (endpoint no implementado)
              if (notification.status === 404) {
                console.log('📋 El endpoint /api/bookings/notify-teacher no está implementado en el backend');
                console.log('💡 La reserva se creó correctamente, pero la notificación por email requiere implementación del backend');
                dispatch(notifyTeacherBooking.rejected('Endpoint de notificación no implementado en el backend'));
              } else {
                console.log('❌ Error al notificar profesor:', errorData);
                dispatch(notifyTeacherBooking.rejected(errorData.message || 'Error al notificar profesor'));
              }
            }
          } else {
            console.log('⚠️ No se encontró email del instructor para la clase');
            console.log('📋 Estructura de la clase recibida:', JSON.stringify(classDetails, null, 2));
            console.log('📋 Estructura del booking:', JSON.stringify(booking, null, 2));
            
            // Mostrar TODOS los campos de la clase para debugging
            console.log('🔍 Todos los campos de classDetails:', Object.keys(classDetails));
            
            // Mostrar qué campos están disponibles para el instructor
            const availableFields = Object.keys(classDetails).filter(key => 
              key.toLowerCase().includes('instructor') || 
              key.toLowerCase().includes('teacher') || 
              key.toLowerCase().includes('user')
            );
            console.log('🔍 Campos relacionados con profesor encontrados:', availableFields);
            
            // Mostrar también si hay campos que contengan 'id'
            const idFields = Object.keys(classDetails).filter(key => 
              key.toLowerCase().includes('id')
            );
            console.log('🔍 Campos que contienen "id":', idFields);
            
            // Para desarrollo: usar email de fallback si está configurado
            const fallbackEmail = import.meta.env.VITE_FALLBACK_TEACHER_EMAIL;
            
            if (import.meta.env.DEV && fallbackEmail) {
              console.log(`🔧 Modo desarrollo: usando email de fallback: ${fallbackEmail}`);
              
              const notification = await apiClient.post('/bookings/notify-teacher', {
                bookingId: booking.id,
                teacherEmail: fallbackEmail,
                teacherName: 'Administrador (Fallback)',
                studentName: userInfo.name || userInfo.email,
                studentEmail: userInfo.email,
                className: classDetails.name || booking.classEntity.name,
                bookingDate: booking.bookingDate,
                bookingTime: booking.bookingTime,
                notes: booking.notes || ''
              }, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              
              if (notification.status === 200) {
                const notificationResult = notification.data;
                console.log('✅ Notificación enviada a email de fallback:', notificationResult);
                dispatch(notifyTeacherBooking.fulfilled(notificationResult));
              } else {
                const errorData = notification.data;
                
                // Mensaje específico para error 404 (endpoint no implementado)
                if (notification.status === 404) {
                  console.log('📋 El endpoint /api/bookings/notify-teacher no está implementado en el backend');
                  console.log('💡 La reserva se creó correctamente, pero la notificación por email requiere implementación del backend');
                  dispatch(notifyTeacherBooking.rejected('Endpoint de notificación no implementado en el backend'));
                } else {
                  console.log('❌ Error al notificar con email de fallback:', errorData);
                  dispatch(notifyTeacherBooking.rejected(errorData.message || 'Error al notificar profesor'));
                }
              }
            } else {
              dispatch(notifyTeacherBooking.rejected('No se encontró información del instructor para enviar la notificación'));
            }
          }
      } catch (notificationError) {
        console.log('⚠️ Reserva creada pero falló la notificación:', notificationError);
        dispatch(notifyTeacherBooking.rejected(notificationError.message));
        // No fallar todo el proceso si solo falla la notificación
      }
      
      return booking;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al crear la reserva'
      );
    }
  }
);

const initialState = {
  bookings: [],
  userBookings: [],
  availableSlots: [],
  isLoading: false,
  error: null,
  currentBooking: null,
  notificationStatus: null, // 'sending', 'sent', 'failed'
  notificationError: null,
  success: false,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearBookingError: (state) => {   // <-- Agrega este reducer
      state.error = null;
    },
    setCurrentBooking: (state, action) => {
      state.currentBooking = action.payload;
    },
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    },
    clearBookingSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create booking
      .addCase(createBooking.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings.push(action.payload);
        state.currentBooking = action.payload;
        state.error = null;
        state.success = true;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
      })
      
      // Fetch bookings
      .addCase(fetchBookings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings = action.payload;
        state.error = null;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
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
        state.userBookings = action.payload;
        state.error = null;
      })
      .addCase(fetchMyBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch user bookings
      .addCase(fetchUserBookings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userBookings = action.payload;
        state.error = null;
      })
      .addCase(fetchUserBookings.rejected, (state, action) => {
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
        const index = state.bookings.findIndex(b => b.id === action.payload.id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
        const userIndex = state.userBookings.findIndex(b => b.id === action.payload.id);
        if (userIndex !== -1) {
          state.userBookings[userIndex] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateBookingStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Delete booking
      .addCase(deleteBooking.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings = state.bookings.filter(b => b.id !== action.payload);
        state.userBookings = state.userBookings.filter(b => b.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch available slots
      .addCase(fetchAvailableSlots.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAvailableSlots.fulfilled, (state, action) => {
        state.isLoading = false;
        state.availableSlots = action.payload;
        state.error = null;
      })
      .addCase(fetchAvailableSlots.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Notify teacher booking
      .addCase(notifyTeacherBooking.pending, (state) => {
        state.notificationStatus = 'sending';
        state.notificationError = null;
      })
      .addCase(notifyTeacherBooking.fulfilled, (state, action) => {
        state.notificationStatus = 'sent';
        state.notificationError = null;
      })
      .addCase(notifyTeacherBooking.rejected, (state, action) => {
        state.notificationStatus = 'failed';
        state.notificationError = action.payload;
      })
      
      // Create booking with notification
      .addCase(createBookingWithNotification.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.notificationStatus = null;
      })
      .addCase(createBookingWithNotification.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings.push(action.payload);
        state.currentBooking = action.payload;
        state.error = null;
      })
      .addCase(createBookingWithNotification.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearBookingError, setCurrentBooking, clearCurrentBooking, clearBookingSuccess } = bookingSlice.actions;
export default bookingSlice.reducer;
