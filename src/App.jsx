import { Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { verifyToken } from "./redux/slices/authSlice";
import { Toaster } from "react-hot-toast";

// Componentes
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./Features/Home";
import Login from "./Features/Login";
import Register from "./Features/Register";
import ChangePasswordPage from "./Features/ChangePasswordPage";
import AdminPanel from "./Features/AdminPanel";
import UserPanel from "./Features/UserPanel";
import Tienda from "./Features/Tienda";
import Clases from "./Features/Clases";

function App() {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
        <span className="ml-3 text-gray-600">Cargando...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />
          <Route path="/tienda" element={<Tienda />} />
          <Route path="/clases" element={<Clases />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdminOrTeacher={true}>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mi-cuenta"
            element={
              <ProtectedRoute>
                <UserPanel />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      <Footer />

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#10B981",
              secondary: "#fff",
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: "#EF4444",
              secondary: "#fff",
            },
          },
        }}
      />
    </div>
  );
}

export default App;
