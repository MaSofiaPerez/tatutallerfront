import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, googleLogin, clearError } from "../redux/slices/authSlice";
import toast from "react-hot-toast";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error, isAuthenticated, isAdmin } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isAuthenticated) {
      // Verificar si el usuario necesita cambiar contraseña
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

      if (storedUser.mustChangePassword === true) {
        console.log("Usuario autenticado pero debe cambiar contraseña");
        navigate("/change-password");
        return;
      }

      // Redirigir según el rol del usuario
      if (isAdmin) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
  }, [isAuthenticated, isAdmin, navigate]);

  useEffect(() => {
    // Limpiar error cuando el componente se monta
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);
  // Inicializar Google OAuth tradicional (más estable)
  useEffect(() => {
    const initializeGoogleAuth = () => {
      if (window.google && window.google.accounts) {
        // Configurar el callback global
        window.googleCallbackHandler = handleGoogleResponse;

        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
          auto_select: false,
          cancel_on_tap_outside: false,
          // NO usar FedCM por ahora para evitar errores
          use_fedcm_for_prompt: false,
        });

        console.log("✅ Google OAuth inicializado correctamente");
      } else {
        // Si el script aún no se ha cargado, intentar de nuevo en un momento
        setTimeout(initializeGoogleAuth, 100);
      }
    };

    initializeGoogleAuth();

    // Cleanup
    return () => {
      if (window.googleCallbackHandler) {
        window.googleCallbackHandler = null;
      }
    };
  }, []);

  const handleGoogleResponse = async (response) => {
    const toastId = toast.loading("Iniciando sesión con Google...");

    try {
      const result = await dispatch(googleLogin(response.credential)).unwrap();
      toast.success("¡Bienvenido! Has iniciado sesión con Google.", {
        id: toastId,
      });
      console.log("Google login exitoso:", result);
    } catch (error) {
      console.error("Error en Google login:", error);
      toast.error(
        error.message ||
          "Error al iniciar sesión con Google. Inténtalo de nuevo.",
        { id: toastId }
      );
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());

    const toastId = toast.loading("Iniciando sesión...");

    try {
      const result = await dispatch(loginUser(formData)).unwrap();
      console.log("Login exitoso:", result);
      console.log("Datos del usuario:", result.user);
      console.log("Rol del usuario:", result.user?.role);
      console.log("Es admin?:", result.user?.role?.toLowerCase() === "admin");
      console.log("Debe cambiar contraseña?:", result.user?.mustChangePassword);

      toast.success("¡Bienvenido! Has iniciado sesión correctamente", {
        id: toastId,
      });

      // ✅ NUEVA LÓGICA: Verificar si debe cambiar contraseña
      if (result.user?.mustChangePassword === true) {
        console.log("Usuario debe cambiar contraseña, redirigiendo...");
        navigate("/change-password");
        return;
      }

      // Login normal - redirigir según el rol del usuario
      if (
        result.user?.isAdmin ||
        result.isAdmin ||
        result.user?.role?.toLowerCase() === "admin"
      ) {
        console.log("Redirigiendo a admin panel");
        navigate("/admin");
      } else {
        console.log("Redirigiendo a home");
        navigate("/");
      }
    } catch (error) {
      console.error("Error en login:", error);

      // Mensaje específico para el problema conocido del backend
      const errorMessage =
        error.message === "Credenciales inválidas"
          ? "⚠️ Problema conocido del backend: El login está temporalmente deshabilitado. Se está trabajando en una solución."
          : error.message ||
            "Error al iniciar sesión. Verifica tus credenciales.";

      toast.error(errorMessage, {
        id: toastId,
        duration: 6000,
      });
    }
  };

  const handleGoogleLogin = async () => {
    console.log("🔄 Iniciando Google One Tap...");

    try {
      // Usar solo Google One Tap tradicional (más estable)
      if (window.google && window.google.accounts) {
        console.log("� Mostrando prompt de Google One Tap");

        // Mostrar el prompt de Google OAuth
        window.google.accounts.id.prompt((notification) => {
          console.log("📋 Notification:", notification);

          if (notification.isNotDisplayed()) {
            console.log("❌ Prompt no se mostró");
            toast.error(
              "No se pudo mostrar el login de Google. Verifica que no tengas bloqueadores de pop-ups."
            );
          } else if (notification.isSkippedMoment()) {
            console.log("⏭️ Usuario omitió el prompt");
            toast.info("Selecciona 'Iniciar con Google' para continuar.");
          } else if (notification.isDismissedMoment()) {
            console.log("❌ Usuario cerró el prompt");
            toast.info("Login cancelado. Puedes intentar de nuevo.");
          }
        });
      } else {
        console.error("❌ Google OAuth no está disponible");
        toast.error(
          "Google OAuth no está disponible. Verifica tu conexión a internet."
        );
      }
    } catch (error) {
      console.error("❌ Error en Google login:", error);
      toast.error("Error al conectar con Google. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Iniciar Sesión
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            O{" "}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              crea una cuenta nueva
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Recordarme
              </label>
            </div>

            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Iniciando sesión...
                </div>
              ) : (
                "Iniciar Sesión"
              )}
            </button>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">
                  O continúa con
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="ml-2">Google</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
