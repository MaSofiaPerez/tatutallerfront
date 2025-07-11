import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser, createUser, fetchUsers } from "../redux/slices/usersSlice";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function UserModal({ isOpen, onClose, userData, isEditing }) {
  const dispatch = useDispatch();
  const {
    isAdmin,
    isTeacher,
    user: currentUser,
  } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user", // Cambié "student" a "user"
    lastName: "",
    phone: "",
    address: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Roles disponibles según el tipo de usuario logueado
  const availableRoles = isAdmin
    ? [
        { value: "user", label: "Estudiante" }, // Cambié "student" a "user"
        { value: "teacher", label: "Profesor" },
        { value: "admin", label: "Administrador" },
      ]
    : [{ value: "user", label: "Estudiante" }]; // Cambié "student" a "user"

  useEffect(() => {
    if (isEditing && userData) {
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        role: userData.role || "user", // Cambié "student" a "user"
        lastName: userData.lastName || "",
        phone: userData.phone || "",
        address: userData.address || "",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        role: "user", // Cambié "student" a "user"
        lastName: "",
        phone: "",
        address: "",
      });
    }
  }, [isEditing, userData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isEditing) {
        // Solo actualizar los campos permitidos según el rol del usuario logueado
        const updateData = { ...formData };

        // Los profesores solo pueden cambiar roles de estudiantes
        if (isTeacher && formData.role !== "user") {
          // Cambié "student" a "user"
          toast.error(
            "Los profesores solo pueden asignar el rol de estudiante"
          );
          setIsLoading(false);
          return;
        }

        const result = await dispatch(
          updateUser({ id: userData.id, ...updateData })
        ).unwrap();

        toast.success("Usuario actualizado exitosamente");
        console.log("Usuario actualizado:", result);
      } else {
        // Crear nuevo usuario (solo admins)
        if (!isAdmin) {
          toast.error("Solo los administradores pueden crear usuarios");
          setIsLoading(false);
          return;
        }

        const result = await dispatch(createUser(formData)).unwrap();

        // Mostrar mensaje sin la contraseña temporal por seguridad
        if (result.temporaryPassword) {
          toast.success(
            `Usuario creado exitosamente!\n\nSe ha enviado un email a ${
              result.user?.email || formData.email
            } con las credenciales de acceso.`,
            {
              duration: 6000,
              style: {
                maxWidth: "400px",
              },
            }
          );
        } else {
          toast.success("Usuario creado exitosamente");
        }

        console.log("Usuario creado:", result);

        // Recargar la lista de usuarios para asegurar que se muestre inmediatamente
        dispatch(fetchUsers());
      }

      onClose();
    } catch (error) {
      console.error("Error al guardar usuario:", error);
      console.error("Error completo:", JSON.stringify(error, null, 2));

      // Extraer el mensaje de error específico del backend
      let errorMessage = "Error al guardar el usuario";

      // Redux Toolkit a menudo envuelve errores en diferentes propiedades
      if (typeof error === "string") {
        errorMessage = error;
      } else if (error?.message && error.message !== "Rejected") {
        errorMessage = error.message;
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.response?.data) {
        // Si data es una string directamente
        if (typeof error.response.data === "string") {
          errorMessage = error.response.data;
        }
      }

      console.error("Mensaje de error final en modal:", errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {isEditing ? "Editar Usuario" : "Crear Usuario"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Apellido
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isEditing} // No permitir cambiar email al editar
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rol *
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              {availableRoles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
            {isTeacher && (
              <p className="text-xs text-gray-500 mt-1">
                Como profesor, solo puedes asignar el rol de estudiante
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dirección
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 disabled:opacity-50"
            >
              {isLoading ? "Guardando..." : isEditing ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Corregir problemas de sintaxis en el componente UserDetails
function UserDetails({ userData, reservations }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const filteredReservations = reservations.filter((reservation) => {
    const reservationDate = new Date(reservation.date);
    if (startDate && reservationDate < startDate) return false;
    if (endDate && reservationDate > endDate) return false;
    return true;
  });

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Detalles del Usuario
      </h3>
      <div className="mb-4">
        <p>
          <strong>Nombre:</strong> {userData.name}
        </p>
        <p>
          <strong>Apellido:</strong> {userData.lastName}
        </p>
        <p>
          <strong>Email:</strong> {userData.email}
        </p>
        <p>
          <strong>Teléfono:</strong> {userData.phone}
        </p>
        <p>
          <strong>Dirección:</strong> {userData.address}
        </p>
      </div>

      <h4 className="text-md font-semibold text-gray-800 mb-2">
        Clases Reservadas
      </h4>
      <div className="flex gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Desde
          </label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hasta
          </label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>
      </div>

      {filteredReservations.length > 0 ? (
        <ul className="list-disc pl-5">
          {filteredReservations.map((reservation) => (
            <li key={reservation.id} className="mb-2">
              <p>
                <strong>Clase:</strong> {reservation.className}
              </p>
              <p>
                <strong>Fecha:</strong>{" "}
                {new Date(reservation.date).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">
          No se encontraron clases reservadas en el rango de fechas seleccionado.
        </p>
      )}
    </div>
  );
}

export default UserModal;
