import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({
  children,
  requireAdmin = false,
  requireAdminOrTeacher = false,
}) => {
  const { isAuthenticated, isAdmin, isTeacher, isLoading } = useSelector(
    (state) => state.auth
  );

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

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (requireAdminOrTeacher && !isAdmin && !isTeacher) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
