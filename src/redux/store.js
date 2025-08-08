import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import bookingReducer from './slices/bookingSlice'
import classesReducer from './slices/classesSlice'
import productsReducer from './slices/productsSlice'
import usersReducer from './slices/usersSlice'
import dashboardReducer from './slices/dashboardSlice'
import teacherReducer from './slices/teacherSlice'
import cartReducer from './slices/cartSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    booking: bookingReducer,
    classes: classesReducer,
    products: productsReducer,
    users: usersReducer,
    dashboard: dashboardReducer,
    teacher: teacherReducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
})

export default store
