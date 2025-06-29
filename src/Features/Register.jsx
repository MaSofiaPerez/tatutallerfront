import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearError } from "../redux/slices/authSlice";
import toast from "react-hot-toast";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [passwordMatch, setPasswordMatch] = useState(true);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  // Remover el useEffect que redirige automáticamente si isAuthenticated
  // porque interfiere con el flujo de registro

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Verificar que las contraseñas coincidan
    if (name === "confirmPassword" || name === "password") {
      setPasswordMatch(
        name === "confirmPassword"
          ? value === formData.password
          : formData.confirmPassword === value
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());

    if (formData.password !== formData.confirmPassword) {
      setPasswordMatch(false);
      toast.error("Las contraseñas no coinciden");
      return;
    }

    const toastId = toast.loading("Creando tu cuenta...");

    try {
      const { confirmPassword, ...userData } = formData;
      const result = await dispatch(registerUser(userData)).unwrap();
      console.log("Registro exitoso:", result);

      // Limpiar formulario en todos los casos
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
      });

      // SIEMPRE ir a login para flujo normal
      if (result.token) {
        // Solo si el backend devuelve token (auto-login habilitado)
        toast.success(
          "¡Bienvenido! Tu cuenta ha sido creada y has iniciado sesión automáticamente.",
          { id: toastId }
        );
        navigate("/");
      } else {
        // Flujo normal - registro exitoso, ir a login
        toast.success(
          "¡Cuenta creada exitosamente! Ahora inicia sesión con tus credenciales.",
          {
            id: toastId,
            duration: 6000,
          }
        );
        navigate("/login");
      }
    } catch (rejectedValueOrSerializedError) {
      console.error(
        "Error en registro completo:",
        rejectedValueOrSerializedError
      );

      // El error que viene de unwrap() puede tener diferentes estructuras
      let errorMessage = "Error al crear la cuenta. Inténtalo de nuevo.";

      // Caso 1: Error directo como string (el más común con rejectWithValue)
      if (typeof rejectedValueOrSerializedError === "string") {
        errorMessage = rejectedValueOrSerializedError;
      }
      // Caso 2: Error con propiedad message
      else if (rejectedValueOrSerializedError?.message) {
        errorMessage = rejectedValueOrSerializedError.message;
      }
      // Caso 3: Error serializado de Redux Toolkit
      else if (rejectedValueOrSerializedError?.error?.message) {
        errorMessage = rejectedValueOrSerializedError.error.message;
      }
      // Caso 4: Si tiene payload (estructura de Redux)
      else if (rejectedValueOrSerializedError?.payload) {
        if (typeof rejectedValueOrSerializedError.payload === "string") {
          errorMessage = rejectedValueOrSerializedError.payload;
        } else if (rejectedValueOrSerializedError.payload?.message) {
          errorMessage = rejectedValueOrSerializedError.payload.message;
        }
      }

      console.log("Mensaje de error procesado:", errorMessage);

      toast.error(errorMessage, {
        id: toastId,
        duration: 6000,
      });

      // Limpiar cualquier estado de autenticación residual
      dispatch(clearError());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Crear Cuenta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            O{" "}
            <Link
              to="/login"
              className="font-medium text-yellow-600 hover:text-yellow-500 transition-colors"
            >
              inicia sesión si ya tienes cuenta
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Nombre completo
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm"
                placeholder="Tu nombre completo"
              />
            </div>

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
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Teléfono (opcional)
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm"
                placeholder="Tu número de teléfono"
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
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirmar contraseña
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:z-10 sm:text-sm ${
                  !passwordMatch
                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-yellow-500 focus:border-yellow-500"
                }`}
                placeholder="••••••••"
              />
              {!passwordMatch && (
                <p className="mt-1 text-sm text-red-600">
                  Las contraseñas no coinciden
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || !passwordMatch}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                  Creando cuenta...
                </div>
              ) : (
                "Crear Cuenta"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
