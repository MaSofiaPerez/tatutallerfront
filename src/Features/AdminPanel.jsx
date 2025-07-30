import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDashboardStats,
  // fetchMonthlyRevenue y fetchPopularClasses se implementarán más tarde
} from "../redux/slices/dashboardSlice";
import {
  fetchUsers,
  fetchMyStudents,
  deleteUser,
  updateUserRole,
} from "../redux/slices/usersSlice";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../redux/slices/productsSlice";
import {
  fetchClasses,
  createClass,
  updateClass,
  deleteClass,
} from "../redux/slices/classesSlice";
import {
  fetchBookings,
  updateBookingStatus,
} from "../redux/slices/bookingSlice";
import ClassModal from "../components/ClassModal";
import UserModal from "../components/UserModal";
import ProductModal from "../components/ProductModal";
import BookingDetailModal from "../components/BookingDetailModal";
import ClassDetailsModal from "../components/ClassDetailsModal";
import UserDetailsModal from "../components/UserDetailsModal";
import toast from "react-hot-toast";
import apiClient from "../redux/api"; // Corrige la ruta para usar el cliente API existente

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api";

function AdminPanel() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // 'create' or 'edit'
  const [selectedItem, setSelectedItem] = useState(null);

  // Estados para UserModal
  const [showUserModal, setShowUserModal] = useState(false);
  const [userModalType, setUserModalType] = useState(""); // 'create' or 'edit'
  const [selectedUser, setSelectedUser] = useState(null);

  const [showBookingDetail, setShowBookingDetail] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState(null);

  const dispatch = useDispatch();
  const [userSearch, setUserSearch] = useState("");
  const [bookingSearch, setBookingSearch] = useState("");
  const [bookingDateFrom, setBookingDateFrom] = useState("");
  const [bookingDateTo, setBookingDateTo] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [classTeacherSearch, setClassTeacherSearch] = useState("");

  // Función para traducir roles para la interfaz de usuario
  const translateRole = (role) => {
    // Manejar casos nulos, undefined o vacíos
    if (!role) {
      return "Alumno"; // Por defecto, usuarios sin rol son alumnos
    }

    // Normalizar el rol: convertir a minúsculas y quitar espacios
    const normalizedRole = role.toString().toLowerCase().trim();

    const roleTranslations = {
      user: "Alumno",
      usuario: "Alumno", // Por si viene en español
      student: "Alumno",
      estudiante: "Alumno", // Por si viene en español
      admin: "Administrador",
      administrador: "Administrador",
      administrator: "Administrador",
      teacher: "Tallerista",
      profesor: "Tallerista",
      instructor: "Tallerista",
      tallerista: "Tallerista",
    };

    return roleTranslations[normalizedRole] || "Alumno"; // Por defecto "Alumno" si no encuentra el rol
  };

  // Función para filtrar usuarios según el rol del usuario logueado
  const filterUsersByRole = (allUsers) => {
    if (isAdmin) {
      // Los admins ven todos los usuarios
      return allUsers;
    }

    if (isTeacher) {
      // Los teachers ven sus estudiantes específicos obtenidos de fetchMyStudents
      // Ya no necesitamos filtrar aquí porque myStudents ya contiene solo los estudiantes del teacher
      return allUsers.filter((userItem) => {
        const role = userItem.role?.toLowerCase();
        return (
          role === "user" ||
          role === "usuario" ||
          role === "student" ||
          role === "estudiante" ||
          (!role && userItem.role !== "admin" && userItem.role !== "teacher")
        );
      });
    }

    // Fallback: no mostrar usuarios
    return [];
  };

  // Obtener la lista de usuarios apropiada según el rol
  const getUsersList = () => {
    let list = isTeacher ? myStudents : filterUsersByRole(users);
    if (userSearch.trim() !== "") {
      const searchLower = userSearch.trim().toLowerCase();
      list = list.filter(
        (u) => u.name && u.name.toLowerCase().includes(searchLower)
      );
    }
    return list;
  };

  // Redux state
  const {
    stats,
    myStats,
    isLoading: dashboardLoading,
  } = useSelector((state) => state.dashboard);
  const {
    users,
    myStudents,
    isLoading: usersLoading,
  } = useSelector((state) => state.users);
  const { products, isLoading: productsLoading } = useSelector(
    (state) => state.products
  );
  const { user, isAdmin, isTeacher } = useSelector((state) => state.auth);
  const { classes, isLoading: classesLoading } = useSelector(
    (state) => state.classes
  );
  const { bookings, isLoading: bookingsLoading } = useSelector(
    (state) => state.booking
  );
  const { token } = useSelector((state) => state.auth); // Agrega esta línea

  const prevCount = useRef(bookings.length);

  useEffect(() => {
    prevCount.current = bookings.length;
  }, [bookings.length]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          "http://localhost:8080/api/admin/bookings/count",
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (data.count !== prevCount.current) {
          dispatch(fetchBookings());
          dispatch(fetchClasses()); // <-- Agrega esto
        }
      } catch (e) {
        // Opcional: manejar error
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [dispatch, token]);

  useEffect(() => {
    // Cargar datos iniciales según la tab activa y el rol del usuario
    switch (activeTab) {
      case "dashboard":
        if (isTeacher) {
          // Teachers ven solo sus propias estadísticas y reservas
          dispatch(fetchMyDashboardStats());
        } else {
          // Admins ven todas las estadísticas
          dispatch(fetchDashboardStats());
        }
        // dispatch(fetchMonthlyRevenue()); // TODO: Implementar en el backend
        // dispatch(fetchPopularClasses()); // TODO: Implementar en el backend
        break;
      case "usuarios":
        if (isTeacher) {
          // Teachers solo ven sus estudiantes
          dispatch(fetchMyStudents());
        } else {
          // Admins ven todos los usuarios
          dispatch(fetchUsers());
        }
        break;
      case "productos":
        dispatch(fetchProducts());
        break;
      case "clases":
        dispatch(fetchClasses());
        break;
      case "reservas":
        dispatch(fetchBookings());
        break;
    }
  }, [activeTab, dispatch, isAdmin, isTeacher]);

  useEffect(() => {
    if (activeTab === "clases") {
      dispatch(fetchClasses());
      dispatch(fetchBookings());
    }
  }, [activeTab, dispatch]);

  const tabs = [
    { id: "dashboard", name: "Dashboard", icon: "📊" },
    // Admins y teachers pueden ver usuarios/estudiantes
    ...(isAdmin || isTeacher
      ? [
          {
            id: "usuarios",
            name: isTeacher ? "Mis Estudiantes" : "Usuarios",
            icon: "👥",
          },
        ]
      : []),
    // Solo admins pueden ver productos
    ...(isAdmin ? [{ id: "productos", name: "Productos", icon: "🏺" }] : []),
    { id: "clases", name: "Clases", icon: "🎨" },
    { id: "reservas", name: "Reservas", icon: "📅" },
  ];

  const handleDeleteItem = async (type, id) => {
    if (!window.confirm(`¿Estás seguro de eliminar este ${type}?`)) return;

    try {
      switch (type) {
        case "producto":
          await dispatch(deleteProduct(id)).unwrap();
          toast.success("Producto eliminado exitosamente");
          break;
        case "usuario":
          await dispatch(deleteUser(id)).unwrap();
          toast.success("Usuario eliminado exitosamente");
          break;
        case "clase":
          await dispatch(deleteClass(id)).unwrap();
          toast.success("Clase eliminada exitosamente");
          break;
        default:
          break;
      }
    } catch (error) {
      alert(`Error al eliminar ${type}: ${error}`);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const response = await dispatch(
        updateBookingStatus({ bookingId, status: newStatus })
      ).unwrap();
      toast.success(response.message);
    } catch (error) {
      toast.error(error);
    }
  };

  const handleBooking = async (classId) => {
    try {
      // Simular una reserva en el backend
      await apiClient.post(`/api/classes/${classId}/book`);

      // Actualizar el estado local de classes
      dispatch({
        type: "classes/updateAvailableSpots",
        payload: {
          classId,
          change: -1, // Reducir en 1 el cupo disponible
        },
      });

      toast.success("Reserva realizada exitosamente");
    } catch (error) {
      console.error("Error al realizar la reserva:", error);
      toast.error("Error al realizar la reserva");
    }
  };

  const renderDashboard = () => {
    // Seleccionar los datos apropiados según el rol
    const currentStats = isTeacher ? myStats : stats;

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {isTeacher ? "Mi Dashboard" : "Dashboard"}
        </h2>

        {dashboardLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">
                  {isTeacher ? "Mis Estudiantes" : "Alumnos Registrados"}
                </h3>
                <p className="text-3xl font-bold text-gray-900">
                  {currentStats?.totalUsers || 0}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">
                  {isTeacher ? "Mis Reservas" : "Total de reservas de clases"}
                </h3>
                <p className="text-3xl font-bold text-gray-900">
                  {currentStats?.totalBookings || 0}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">
                  Clases Disponibles
                </h3>
                <p className="text-3xl font-bold text-gray-900">
                  {currentStats?.totalClasses || 0}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  const renderClassesTable = () => {
    const futureClassesWithReservations = classes.filter((classItem) => {
      const hasReservations =
        classItem.reservations && classItem.reservations.length > 0;
      const isFutureClass = new Date(classItem.startTime) > new Date();
      return hasReservations || isFutureClass;
    });

    return (
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Profesor
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Clase
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Horario
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Cupos Disponibles
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredClasses.length > 0 ? (
            filteredClasses.map((classItem) => {
              const capacidadMaxima = classItem.capacity || classItem.maxCapacity || 0;
              const cantidadUsuarios = bookings.filter(
                (b) => b.classId === classItem.id
              ).length;
              const cuposDisponibles = capacidadMaxima - cantidadUsuarios;
              return (
                <tr key={classItem.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {classItem.instructor?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {classItem.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {classItem.startTime && classItem.endTime
                      ? `${classItem.startTime} - ${classItem.endTime}`
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {cuposDisponibles}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => {
                        setModalType("edit");
                        setSelectedItem(classItem);
                        setShowModal(true);
                      }}
                      className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600 text-sm transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteItem("clase", classItem.id)}
                      className="bg-red-700 text-white px-3 py-1 rounded-md hover:bg-red-800 text-sm transition-colors"
                    >
                      Eliminar
                    </button>
                    <button
                      onClick={() => handleViewDetails(classItem)}
                      className="bg-blue-700 text-white px-3 py-1 rounded-md hover:bg-blue-800 text-sm transition-colors"
                    >
                      Ver Detalle
                    </button>
                  </td>
                </tr>
              );
            })
           ) : (
            <tr>
              <td
                colSpan="5"
                className="px-6 py-4 text-center text-gray-500"
              >
                No hay clases registradas
              </td>
            </tr>
          )}
        </tbody>
      </table>
    );
  };

  const handleViewDetails = (classItem) => {
    if (selectedClassId !== classItem.id) {
      setSelectedClassId(classItem.id);
    }
    setShowDetailsModal(true);
  };

  const renderClassesTab = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Clases</h2>
          <button
            onClick={() => {
              setModalType("create");
              setSelectedItem(null);
              setShowModal(true);
            }}
            className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700"
          >
            Agregar Clase
          </button>
        </div>
        {classesLoading || bookingsLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
          </div>
        ) : (
          renderClassesTable()
        )}
      </div>
    );
  };

  // Filtrado
  const filteredBookings = bookings.filter((booking) => {
    const matchesName =
      booking.userName?.toLowerCase().includes(bookingSearch.toLowerCase());

    let matchesDate = true;
    if (bookingDateFrom) {
      matchesDate = booking.bookingDate >= bookingDateFrom;
    }
    if (matchesDate && bookingDateTo) {
      matchesDate = booking.bookingDate <= bookingDateTo;
    }
    return matchesName && matchesDate;
  });

  // Filtrado de productos por nombre
  const filteredProducts = products.filter((product) =>
    product.name?.toLowerCase().includes(productSearch.toLowerCase())
  );

  // Filtrado de clases por profesor
  const filteredClasses = classes.filter((classItem) =>
    classItem.instructor?.name
      ?.toLowerCase()
      .includes(classTeacherSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Panel de Administración
        </h1>
        <p className="text-gray-600">
          Gestiona tu taller de cerámica desde aquí
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-yellow-500 text-yellow-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "dashboard" && renderDashboard()}

          {activeTab === "usuarios" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {isTeacher ? "Mis Estudiantes" : "Gestión de Usuarios"}
                </h2>
                {isAdmin && (
                  <button
                    onClick={() => {
                      setUserModalType("create");
                      setSelectedUser(null);
                      setShowUserModal(true);
                    }}
                    className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700"
                  >
                    Agregar Usuario
                  </button>
                )}
              </div>
              {/* Filtro por nombre */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Buscar por nombre..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              {usersLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                </div>
              ) : (
                <div className="bg-white shadow overflow-hidden rounded-md">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Nombre
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Rol
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Estado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {getUsersList() && getUsersList().length > 0 ? (
                        getUsersList().map((user) => (
                          <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {user.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {user.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${
                                  user.role === "admin"
                                    ? "bg-purple-100 text-purple-800"
                                    : user.role === "teacher"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {translateRole(user.role)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${
                                  user.status === "active"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {user.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                              <button
                                onClick={() => {
                                  setUserModalType("edit");
                                  setSelectedUser(user);
                                  setShowUserModal(true);
                                }}
                                className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600 text-sm transition-colors"
                              >
                                Editar
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteItem("usuario", user.id)
                                }
                                className="bg-red-700 text-white px-3 py-1 rounded-md hover:bg-red-800 text-sm transition-colors"
                              >
                                Eliminar
                              </button>
                              <button
                                onClick={() => {
                                  setUserModalType("details");
                                  setSelectedUser(user);
                                  setShowUserModal(true);
                                }}
                                className="bg-blue-700 text-white px-3 py-1 rounded-md hover:bg-blue-800 text-sm transition-colors"
                              >
                                Ver Detalles
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="5"
                            className="px-6 py-4 text-center text-gray-500"
                          >
                            {isTeacher
                              ? "No tienes estudiantes asignados"
                              : "No hay usuarios registrados"}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "productos" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  Gestión de Productos
                </h2>
                <button
                  onClick={() => {
                    setModalType("create");
                    setSelectedItem(null);
                    setShowModal(true);
                  }}
                  className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700"
                >
                  Agregar Producto
                </button>
              </div>
              {/* Filtro por nombre de producto */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Buscar por nombre de producto..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              {productsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                </div>
              ) : (
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                  {filteredProducts && filteredProducts.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Producto
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Categoría
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Precio
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Stock
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Estado
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Acciones
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredProducts.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  {product.imageUrl ? (
                                    <img
                                      className="h-12 w-12 rounded-lg object-cover mr-4"
                                      src={
                                        product.imageUrl.startsWith("http")
                                          ? product.imageUrl
                                          : `${API_BASE_URL}${product.imageUrl.startsWith("/") ? "" : "/"}${product.imageUrl}`
                                      }
                                      alt={product.name}
                                      onError={(e) => {
                                        if (!e.target.src.endsWith("/placeholder.jpg")) {
                                          e.target.onerror = null;
                                          e.target.src = "/placeholder.jpg";
                                        }
                                      }}
                                    />
                                  ) : (
                                    <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center mr-4">
                                      <svg
                                        className="h-6 w-6 text-gray-400"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                                      </svg>
                                    </div>
                                  )}
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">
                                      {product.name}
                                    </div>
                                    <div className="text-sm text-gray-500 max-w-xs truncate">
                                      {product.description}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                  {product.category || "Sin categoría"}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  ${product.price}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    product.stock > 10
                                      ? "bg-green-100 text-green-800"
                                      : product.stock > 0
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {product.stock || 0}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    product.status === "AVAILABLE"
                                      ? "bg-green-100 text-green-800"
                                      : product.status === "OUT_OF_STOCK"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {product.status === "AVAILABLE"
                                    ? "Disponible"
                                    : product.status === "OUT_OF_STOCK"
                                    ? "Sin Stock"
                                    : product.status === "DISCONTINUED"
                                    ? "Descontinuado"
                                    : product.status || "Desconocido"}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                <button
                                  onClick={() => {
                                    setModalType("edit");
                                    setSelectedItem(product);
                                    setShowModal(true);
                                  }}
                                  className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600 text-sm transition-colors"
                                >
                                  Editar
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteItem("producto", product.id)
                                  }
                                  className="bg-red-700 text-white px-3 py-1 rounded-md hover:bg-red-800 text-sm transition-colors"
                                >
                                  Eliminar
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        No hay productos
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Comienza creando tu primer producto.
                      </p>
                      <div className="mt-6">
                        <button
                          onClick={() => {
                            setModalType("create");
                            setSelectedItem(null);
                            setShowModal(true);
                          }}
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700"
                        >
                          Agregar Producto
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "clases" && renderClassesTab()}

          {activeTab === "reservas" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Gestión de Reservas
              </h2>

              {/* Filtros para reservas */}
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Buscar por cliente..."
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <div className="flex flex-col">
                  <label htmlFor="date-from" className="text-xs text-gray-600 mb-1">Desde</label>
                  <input
                    id="date-from"
                    type="date"
                    value={bookingDateFrom}
                    onChange={(e) => setBookingDateFrom(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="Desde"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="date-to" className="text-xs text-gray-600 mb-1">Hasta</label>
                  <input
                    id="date-to"
                    type="date"
                    value={bookingDateTo}
                    onChange={(e) => setBookingDateTo(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="Hasta"
                  />
                </div>
              </div>

              {bookingsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                </div>
              ) : (
                <div className="bg-white shadow overflow-hidden rounded-md">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Cliente
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Servicio
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Fecha
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Tallerista
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Estado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredBookings && filteredBookings.length > 0 ? (
                        filteredBookings.map((booking) => (
                          <tr key={booking.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <div>
                                <div className="font-medium">
                                  {booking.userName}
                                </div>
                                <div className="text-gray-500">
                                  {booking.userEmail}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {booking.className}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {booking.bookingDate}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {booking.startTime}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <select
                                value={booking.status}
                                onChange={async (e) => {
                                  const newStatus = e.target.value;
                                  await handleStatusChange(
                                    booking.id,
                                    newStatus
                                  );
                                }}
                                className={`px-2 py-1 text-xs rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-yellow-500
                                  ${
                                    booking.status === "CONFIRMED"
                                      ? "bg-green-100 text-green-800"
                                      : booking.status === "PENDING"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : booking.status === "REJECTED"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-gray-100 text-gray-800"
                                  }
                                `}
                              >
                                <option key="pending" value="PENDING">
                                  Pendiente
                                </option>
                                <option key="confirmed" value="CONFIRMED">
                                  Confirmada
                                </option>
                                <option key="rejected" value="REJECTED">
                                  Rechazada
                                </option>
                              </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => {
                                  setSelectedItem(booking);
                                  setShowBookingDetail(true);
                                }}
                                className="bg-blue-700 text-white px-3 py-1 rounded-md hover:bg-blue-800 text-sm transition-colors"
                              >
                                Ver Detalles
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="6"
                            className="px-6 py-4 text-center text-gray-500"
                          >
                            No hay reservas registradas
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal para Crear/Editar Productos */}
      {activeTab === "productos" && (
        <ProductModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedItem(null);
            setModalType("");
          }}
          productData={selectedItem}
          isEditing={modalType === "edit"}
          categories={["Pigmentos", "Esmalte", "Materia Prima", "Otros"]}
        />
      )}

      {/* Modal para Crear/Editar Clases */}
      {activeTab === "clases" && (
        <ClassModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedItem(null);
            setModalType("");
            // Refresca clases y reservas al cerrar el modal (tras crear o editar)
            dispatch(fetchClasses());
            dispatch(fetchBookings());
          }}
          classData={selectedItem}
          isEditing={modalType === "edit"}
        />
      )}

      {/* Modal para Crear/Editar Usuarios */}
      {showUserModal && userModalType !== "details" && (
        <UserModal
          isOpen={showUserModal}
          onClose={() => {
            setShowUserModal(false);
            setSelectedUser(null);
            setUserModalType("");
          }}
          userData={selectedUser}
          isEditing={userModalType === "edit"}
        />
      )}

      {/* Modal para Ver Detalles de Usuario */}
      {showUserModal && userModalType === "details" && (
        <UserDetailsModal
          isOpen={showUserModal}
          onClose={() => {
            setShowUserModal(false);
            setSelectedUser(null);
            setUserModalType("");
          }}
          userData={selectedUser}
          userId={selectedUser?.id}
        />
      )}

      {/* Modal para Detalles de Reserva */}
      {activeTab === "reservas" && (
        <BookingDetailModal
          isOpen={showBookingDetail}
          onClose={() => {
            setShowBookingDetail(false);
            setSelectedItem(null);
          }}
          booking={selectedItem}
          onSave={() => {
            setShowBookingDetail(false);
            setSelectedItem(null);
            dispatch(fetchBookings());
          }}
          onCancel={() => {
            setShowBookingDetail(false);
            setSelectedItem(null);
            dispatch(fetchBookings());
          }}
        />
      )}

      {/* Modal para Detalles de Clases (Reservas de Clases) */}
      {showDetailsModal && (
        <ClassDetailsModal
          classId={selectedClassId}
          onClose={() => setShowDetailsModal(false)}
        />
      )}
    </div>
  );
}

export default AdminPanel;
