import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({
  children,
  requireAdmin = false,
  requireAdminOrTeacher = false,
}) => {
  const { isAuthenticated, isAdmin, isTeacher, isLoading, user } = useSelector(
    (state) => state.auth
  );
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
        <span className="ml-3 text-gray-600">Verificando autenticación...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // ✅ NUEVA LÓGICA: Verificar si debe cambiar contraseña
  // Solo verificar en rutas que NO sean la página de cambio de contraseña
  if (location.pathname !== "/change-password") {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

    if (
      user?.mustChangePassword === true ||
      storedUser.mustChangePassword === true
    ) {
      console.log(
        "Usuario debe cambiar contraseña, redirigiendo desde ProtectedRoute"
      );
      return <Navigate to="/change-password" replace />;
    }
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (requireAdminOrTeacher && !isAdmin && !isTeacher) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
