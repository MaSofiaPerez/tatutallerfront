import { Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { verifyToken } from "./redux/slices/authSlice";
import { fetchCart } from "./redux/slices/cartSlice"; // <-- importa fetchCart
import { Toaster } from "react-hot-toast";

// Componentes
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import TeamSection from "./components/TeamSection";
import Gallery from "./components/Gallery";
import Home from "./Features/Home";
import Login from "./Features/Login";
import Register from "./Features/Register";
import ChangePasswordPage from "./Features/ChangePasswordPage";
import AdminPanel from "./Features/AdminPanel";
import UserPanel from "./Features/UserPanel";
import Tienda from "./Features/Tienda";
import Clases from "./Features/Clases";
import CicloFormacion from "./Features/CicloFormacion";
import CoworkCeramico from "./Features/CoworkCeramico";
import AlquilerHornos from "./Features/AlquilerHornos";

function App() {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);
  const user = useSelector((state) => state.auth.user); // <-- obtiene el usuario logueado

  // Sincroniza el carrito según el usuario autenticado o anónimo
  useEffect(() => {
    if (user) {
      dispatch(fetchCart()); // Si hay usuario, busca carrito por usuario
    } else {
      const cartToken = localStorage.getItem("cartToken");
      dispatch(fetchCart(cartToken)); // Si es anónimo, busca por token
    }
  }, [user, dispatch]);

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
          <Route path="/ciclo-formacion" element={<CicloFormacion />} />
          <Route path="/cowork-ceramico" element={<CoworkCeramico />} />
          <Route path="/alquiler-hornos" element={<AlquilerHornos />} />
          <Route path="/equipo" element={<TeamSection />} />
          <Route path="/galeria" element={<Gallery />} />
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
