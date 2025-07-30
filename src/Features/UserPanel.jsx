import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile, changePassword } from "../redux/slices/authSlice";
import { fetchMyBookings } from "../redux/slices/bookingSlice";
import toast from "react-hot-toast";
import {
  HiUser,
  HiCalendarDays,
  HiLockClosed,
  HiEye,
  HiEyeSlash,
  HiPencil,
  HiCheck,
  HiXMark,
} from "react-icons/hi2";

function UserPanel() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.auth);
  const { userBookings, isLoading: bookingsLoading } = useSelector(
    (state) => state.booking
  );

  // Estados para el formulario de perfil
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // Estados para cambio de contraseña
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user && !isEditing) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user, isEditing]);

  useEffect(() => {
    let interval;
    if (activeTab === "bookings") {
      dispatch(fetchMyBookings()); // fetch inicial
      interval = setInterval(() => {
        dispatch(fetchMyBookings());
      }, 10000); 
    }
    return () => clearInterval(interval);
  }, [activeTab, dispatch]);

  useEffect(() => {
    console.log("Bookings in UserPanel:", userBookings); // Verifica los datos aquí
  }, [userBookings]);

  const tabs = [
    { id: "profile", name: "Mi Perfil", icon: HiUser },
    { id: "bookings", name: "Mis Clases", icon: HiCalendarDays },
    { id: "password", name: "Cambiar Contraseña", icon: HiLockClosed },
  ];

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await dispatch(
        updateUserProfile(profileData)
      ).unwrap();

      toast.success("Perfil actualizado exitosamente");
      setIsEditing(false);
    } catch (error) {
      toast.error(error?.message || "Error al actualizar el perfil");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Las nuevas contraseñas no coinciden");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("La nueva contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      // Llama a la API real:
      await dispatch(
        changePassword({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        })
      ).unwrap();

      toast.success("Contraseña actualizada exitosamente");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(error?.message || "Error al actualizar la contraseña");
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    const currentUser = user;
    setProfileData({
      name:
        currentUser?.name ||
        (currentUser?.firstName
          ? currentUser.firstName +
            (currentUser.lastName ? " " + currentUser.lastName : "")
          : ""),
      email: currentUser?.email || "",
      phone: currentUser?.phone || "",
      address: currentUser?.address || "",
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status?.toUpperCase()) {
      case "CONFIRMED":
        return "Confirmada";
      case "PENDING":
        return "Pendiente";
      case "CANCELLED":
        return "Cancelada";
      case "REJECTED":
        return "Rechazada";
      case "COMPLETED":
        return "Completada";
      default:
        return "Desconocido";
    }
  };

  const renderProfile = () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Mi Perfil</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <HiPencil className="w-4 h-4" />
            Editar
          </button>
        )}
      </div>

      <form onSubmit={handleProfileSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre Completo
          </label>
          <input
            type="text"
            name="name"
            value={profileData.name}
            onChange={handleProfileChange}
            disabled={!isEditing}
            className={`w-full px-4 py-3 border rounded-lg transition-colors ${
              isEditing
                ? "border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                : "border-gray-200 bg-gray-50"
            }`}
            required
          />
        </div>

        {/* Elimina el campo Apellido */}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={profileData.email}
            onChange={handleProfileChange}
            disabled={!isEditing}
            className={`w-full px-4 py-3 border rounded-lg transition-colors ${
              isEditing
                ? "border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                : "border-gray-200 bg-gray-50"
            }`}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Teléfono
          </label>
          <input
            type="tel"
            name="phone"
            value={profileData.phone}
            onChange={handleProfileChange}
            disabled={!isEditing}
            className={`w-full px-4 py-3 border rounded-lg transition-colors ${
              isEditing
                ? "border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                : "border-gray-200 bg-gray-50"
            }`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dirección
          </label>
          <textarea
            name="address"
            value={profileData.address}
            onChange={handleProfileChange}
            disabled={!isEditing}
            rows={3}
            className={`w-full px-4 py-3 border rounded-lg transition-colors resize-none ${
              isEditing
                ? "border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                : "border-gray-200 bg-gray-50"
            }`}
            placeholder="Ingresa tu dirección completa"
          />
        </div>

        {isEditing && (
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              <HiCheck className="w-4 h-4" />
              {isLoading ? "Guardando..." : "Guardar"}
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <HiXMark className="w-4 h-4" />
              Cancelar
            </button>
          </div>
        )}
      </form>
    </div>
  );

  const renderBookings = () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Mis Clases</h2>

      {bookingsLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando mis clases...</p>
        </div>
      ) : userBookings.length === 0 ? (
        <div className="text-center py-8">
          <HiCalendarDays className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No tienes clases reservadas aún</p>
          <p className="text-gray-500 mt-2">
            ¡Explora nuestras clases y reserva tu primera sesión!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {userBookings.map((booking) => (
            <div
              key={booking.id}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900 mb-1">
                    {booking.className}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    👨‍🏫 {booking.teacherName}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    booking.status
                  )}`}
                >
                  {getStatusText(booking.status)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                <div>
                  <p className="text-gray-500">📅 Fecha</p>
                  <p className="font-medium text-gray-900">
                    {new Date(booking.bookingDate).toLocaleDateString("es-ES", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">⏰ Horario</p>
                  <p className="font-medium text-gray-900">
                    {booking.startTime} - {booking.endTime}
                  </p>
                </div>
              </div>

              {booking.notes && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm">
                    <strong className="text-blue-700">📝 Notas:</strong>
                  </p>
                  <p className="text-sm text-blue-600">{booking.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderPassword = () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Cambiar Contraseña
      </h2>

      <form onSubmit={handlePasswordSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contraseña actual
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <HiEyeSlash className="w-5 h-5" />
              ) : (
                <HiEye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nueva contraseña
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 pr-10"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showNewPassword ? (
                <HiEyeSlash className="w-5 h-5" />
              ) : (
                <HiEye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirmar nueva contraseña
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? (
                <HiEyeSlash className="w-5 h-5" />
              ) : (
                <HiEye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors disabled:opacity-50"
        >
          {isLoading ? "Actualizando..." : "Cambiar Contraseña"}
        </button>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mi Cuenta</h1>
          <p className="mt-2 text-gray-600">
            Gestiona tu perfil y revisa tus clases
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? "bg-yellow-500 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>
          {/* Contenido principal */}
          <div className="lg:col-span-3">
            {activeTab === "profile" && renderProfile()}
            {activeTab === "bookings" && renderBookings()}
            {activeTab === "password" && renderPassword()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserPanel;
