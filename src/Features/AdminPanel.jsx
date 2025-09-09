import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDashboardStats,
  fetchMyDashboardStats,
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

import PedidosAdmin from "./PedidosAdmin";
import apiClient from "../redux/api";
import { API_BASE_URL } from "../utils/apiBase";

// --------------------------------------------
// Component
// --------------------------------------------
function AdminPanel() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // 'create' | 'edit'
  const [selectedItem, setSelectedItem] = useState(null);

  // Estados para UserModal
  const [showUserModal, setShowUserModal] = useState(false);
  const [userModalType, setUserModalType] = useState(""); // 'create' | 'edit' | 'details'
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

  // --- Pedidos (estado local) ---
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState(null);

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
  const { token } = useSelector((state) => state.auth);
  const teachers = useSelector((state) => state.users.teachers) || [];

  const prevCount = useRef(bookings.length);
  useEffect(() => {
    prevCount.current = bookings.length;
  }, [bookings.length]);

  // Traducción de roles
  const translateRole = (role) => {
    if (!role) return "Alumno";
    const normalized = role.toString().toLowerCase().trim();
    const map = {
      user: "Alumno",
      usuario: "Alumno",
      student: "Alumno",
      estudiante: "Alumno",
      admin: "Administrador",
      administrador: "Administrador",
      administrator: "Administrador",
      teacher: "Tallerista",
      profesor: "Tallerista",
      instructor: "Tallerista",
      tallerista: "Tallerista",
      client: "Cliente",
      cliente: "Cliente",
    };
    return map[normalized] ?? "Alumno";
  };

  // Filtrar usuarios acorde a rol
  const filterUsersByRole = (all) => {
    if (isAdmin) return all;
    if (isTeacher) {
      return all.filter((u) => {
        const role = u.role?.toLowerCase();
        return (
          role === "user" ||
          role === "usuario" ||
          role === "student" ||
          role === "estudiante" ||
          (!role && u.role !== "admin" && u.role !== "teacher")
        );
      });
    }
    return [];
  };

  const getUsersList = () => {
    let list = isTeacher ? myStudents : filterUsersByRole(users);
    if (userSearch.trim()) {
      const q = userSearch.trim().toLowerCase();
      list = list.filter((u) => u.name && u.name.toLowerCase().includes(q));
    }
    return list;
  };

  // Helpers pedidos
  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      setOrdersError(null);
      const res = await fetch(`${API_BASE_URL}/api/pedidos/admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (res.status === 403) {
        setOrdersError("No autorizado");
        setOrders([]);
      } else {
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      }
    } catch {
      setOrdersError("Error al cargar pedidos");
    } finally {
      setOrdersLoading(false);
    }
  };

  const confirmOrder = async (pedidoId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/pedidos/admin/${pedidoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ estado: "CONFIRMADO" }),
      });
      if (res.status === 403) {
        toast.error("No autorizado");
        return;
      }
      if (res.ok) {
        setOrders((prev) =>
          prev.map((p) => (p.id === pedidoId ? { ...p, estado: "CONFIRMADO" } : p))
        );
        toast.success("Pedido confirmado");
      } else {
        toast.error("No se pudo confirmar el pedido");
      }
    } catch {
      toast.error("Error al confirmar el pedido");
    }
  };

  const formatMoney = (n) =>
    typeof n === "number"
      ? n.toLocaleString("es-UY", { style: "currency", currency: "UYU" })
      : n ?? "—";

  // Polling de reservas
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/bookings/count`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.count !== prevCount.current) {
          dispatch(fetchBookings());
          dispatch(fetchClasses());
        }
      } catch {}
    }, 10000);
    return () => clearInterval(interval);
  }, [dispatch, token]);

  // Carga por tab
  useEffect(() => {
    switch (activeTab) {
      case "dashboard":
        isTeacher ? dispatch(fetchMyDashboardStats()) : dispatch(fetchDashboardStats());
        break;
      case "usuarios":
        isTeacher ? dispatch(fetchMyStudents()) : dispatch(fetchUsers());
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
      case "pedidos":
        if (isAdmin) fetchOrders();
        break;
      default:
        break;
    }
  }, [activeTab, dispatch, isAdmin, isTeacher]);

  // Si estoy en clases, mantener data fresca
  useEffect(() => {
    if (activeTab === "clases") {
      dispatch(fetchClasses());
      dispatch(fetchBookings());
    }
  }, [activeTab, dispatch]);

  // Tabs
  const tabs = isTeacher
    ? [
        { id: "clases", name: "Clases", icon: "🎨" },
        { id: "reservas", name: "Reservas", icon: "📅" },
      ]
    : [
        { id: "dashboard", name: "Dashboard", icon: "📊" },
        { id: "usuarios", name: "Usuarios", icon: "👥" },
        { id: "productos", name: "Productos", icon: "🏺" },
        { id: "clases", name: "Clases", icon: "🎨" },
        { id: "reservas", name: "Reservas", icon: "📅" },
        { id: "pedidos", name: "Pedidos", icon: "📦" },
      ];

  // Acciones varias
  const handleDeleteItem = async (type, id) => {
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
      const msg =
        typeof error === "string" && error.includes("foreign key constraint")
          ? "Este producto ya pertenece a un carrito, no se puede eliminar."
          : `Error al eliminar ${type}: ${error}`;
      toast.error(msg);
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
      await apiClient.post(`/api/classes/${classId}/book`);
      dispatch({
        type: "classes/updateAvailableSpots",
        payload: { classId, change: -1 },
      });
      toast.success("Reserva realizada exitosamente");
    } catch (error) {
      console.error("Error al realizar la reserva:", error);
      toast.error("Error al realizar la reserva");
    }
  };

  // --------------------------
  // Render Helpers (Responsive)
  // --------------------------
  const renderDashboard = () => {
    const currentStats = isTeacher ? myStats : stats;

    return (
      <div className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          {isTeacher ? "Mi Dashboard" : "Dashboard"}
        </h2>

        {dashboardLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
              <h3 className="text-xs sm:text-sm font-medium text-gray-500">
                {isTeacher ? "Mis Estudiantes" : "Alumnos Registrados"}
              </h3>
              <p className="mt-1 text-2xl sm:text-3xl font-bold text-gray-900">
                {currentStats?.totalUsers || 0}
              </p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
              <h3 className="text-xs sm:text-sm font-medium text-gray-500">
                {isTeacher ? "Mis Reservas" : "Total de reservas de clases"}
              </h3>
              <p className="mt-1 text-2xl sm:text-3xl font-bold text-gray-900">
                {currentStats?.totalBookings || 0}
              </p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
              <h3 className="text-xs sm:text-sm font-medium text-gray-500">
                Clases Disponibles
              </h3>
              <p className="mt-1 text-2xl sm:text-3xl font-bold text-gray-900">
                {currentStats?.totalClasses || 0}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  const handleViewDetails = (classItem) => {
    if (selectedClassId !== classItem.id) setSelectedClassId(classItem.id);
    setShowDetailsModal(true);
  };

  const filteredClasses = isTeacher
    ? classes.filter(
        (classItem) =>
          classItem.instructor && classItem.instructor.email === user.email
      )
    : classes;

  const filteredBookingsRaw = bookings.filter((booking) => {
    const matchesName = booking.userName
      ?.toLowerCase()
      .includes(bookingSearch.toLowerCase());
    let matchesDate = true;
    if (bookingDateFrom) matchesDate = booking.bookingDate >= bookingDateFrom;
    if (matchesDate && bookingDateTo)
      matchesDate = booking.bookingDate <= bookingDateTo;
    return matchesName && matchesDate;
  });

  const teacherClassIds = filteredClasses.map((cls) => cls.id);
  const filteredBookingsBySearch = filteredBookingsRaw;
  const filteredBookings = isTeacher
    ? filteredBookingsBySearch.filter((b) => teacherClassIds.includes(b.classId))
    : filteredBookingsBySearch;

  // Tabla de clases (table desktop / cards mobile)
  const renderClassesTable = () => {
    // Mobile cards
    const mobile = (
      <ul className="md:hidden space-y-3">
        {filteredClasses.length > 0 ? (
          filteredClasses.map((c) => {
            const capacidadMaxima = c.capacity || c.maxCapacity || 0;
            const cantidadUsuarios = bookings.filter((b) => b.classId === c.id).length;
            const cuposDisponibles = Math.max(capacidadMaxima - cantidadUsuarios, 0);
            return (
              <li key={c.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      {c.instructor?.name || "N/A"}
                    </p>
                    <h3 className="text-base font-semibold text-gray-900">
                      {c.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-700">
                      {c.startTime && c.endTime
                        ? `${c.startTime} - ${c.endTime}`
                        : "Horario N/A"}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Cupos disp.: {cuposDisponibles}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setModalType("edit");
                      setSelectedItem(c);
                      setShowModal(true);
                    }}
                    className="bg-gray-600 text-white px-3 py-1 rounded-md text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteItem("clase", c.id)}
                    className="bg-red-700 text-white px-3 py-1 rounded-md text-sm"
                  >
                    Eliminar
                  </button>
                  <button
                    onClick={() => handleViewDetails(c)}
                    className="bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
                  >
                    Ver Detalle
                  </button>
                </div>
              </li>
            );
          })
        ) : (
          <li className="text-center text-gray-500">No hay clases registradas</li>
        )}
      </ul>
    );

    // Desktop table
    const desktop = (
      <div className="hidden md:block">
        <div className="overflow-x-auto">
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
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClasses.length > 0 ? (
                filteredClasses.map((c) => {
                  const capacidadMaxima = c.capacity || c.maxCapacity || 0;
                  const cantidadUsuarios = bookings.filter((b) => b.classId === c.id).length;
                  const cuposDisponibles = capacidadMaxima - cantidadUsuarios;
                  return (
                    <tr key={c.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {c.instructor?.name || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {c.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {c.startTime && c.endTime ? `${c.startTime} - ${c.endTime}` : "N/A"}{" "}
                        <span className="ml-2 text-xs text-gray-500">
                          (Cupos: {Math.max(cuposDisponibles, 0)})
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => {
                            setModalType("edit");
                            setSelectedItem(c);
                            setShowModal(true);
                          }}
                          className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600 text-sm transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteItem("clase", c.id)}
                          className="bg-red-700 text-white px-3 py-1 rounded-md hover:bg-red-800 text-sm transition-colors"
                        >
                          Eliminar
                        </button>
                        <button
                          onClick={() => handleViewDetails(c)}
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
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                    No hay clases registradas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );

    return (
      <>
        {mobile}
        {desktop}
      </>
    );
  };

  const renderClassesTab = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Gestión de Clases</h2>
        <button
          onClick={() => {
            setModalType("create");
            setSelectedItem(null);
            setShowModal(true);
          }}
          className="w-full sm:w-auto bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700"
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

  // --------------------------
  // Render principal
  // --------------------------
  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Panel de Administración
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Gestiona tu taller de cerámica desde aquí
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="border-b border-gray-200">
          <nav
            className="-mb-px flex gap-2 sm:gap-4 px-3 sm:px-6 overflow-x-auto no-scrollbar"
            aria-label="Tabs"
          >
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`shrink-0 mt-1 py-3 px-3 sm:px-4 border-b-2 text-sm font-medium whitespace-nowrap rounded-t
                    ${active ? "border-yellow-500 text-yellow-700"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 sm:p-6">
          {activeTab === "dashboard" && renderDashboard()}

          {activeTab === "usuarios" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {isTeacher ? "Mis Estudiantes" : "Gestión de Usuarios"}
                </h2>
                {isAdmin && (
                  <button
                    onClick={() => {
                      setUserModalType("create");
                      setSelectedUser(null);
                      setShowUserModal(true);
                    }}
                    className="w-full sm:w-auto bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700"
                  >
                    Agregar Usuario
                  </button>
                )}
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Buscar por nombre..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full sm:w-80 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              {usersLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                </div>
              ) : (
                <div className="bg-white shadow overflow-hidden rounded-md">
                  {/* Mobile cards */}
                  <ul className="sm:hidden divide-y divide-gray-200">
                    {getUsersList() && getUsersList().length > 0 ? (
                      getUsersList().map((u) => (
                        <li key={u.id} className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{u.name}</p>
                              <p className="text-xs text-gray-500">{u.email}</p>
                              <span
                                className={`inline-block mt-2 px-2 py-0.5 text-xs rounded-full ${
                                  u.role === "admin"
                                    ? "bg-purple-100 text-purple-800"
                                    : u.role === "teacher"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {translateRole(u.role)}
                              </span>
                            </div>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <button
                              onClick={() => {
                                setUserModalType("edit");
                                setSelectedUser(u);
                                setShowUserModal(true);
                              }}
                              className="bg-gray-600 text-white px-3 py-1 rounded-md text-sm"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteItem("usuario", u.id)}
                              className="bg-red-700 text-white px-3 py-1 rounded-md text-sm"
                            >
                              Eliminar
                            </button>
                            <button
                              onClick={() => {
                                setUserModalType("details");
                                setSelectedUser(u);
                                setShowUserModal(true);
                              }}
                              className="bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
                            >
                              Ver Detalles
                            </button>
                          </div>
                        </li>
                      ))
                    ) : (
                      <li className="p-6 text-center text-gray-500">
                        {isTeacher ? "No tienes estudiantes asignados" : "No hay usuarios registrados"}
                      </li>
                    )}
                  </ul>

                  {/* Desktop table */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {getUsersList() && getUsersList().length > 0 ? (
                          getUsersList().map((u) => (
                            <tr key={u.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{u.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.email}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <span
                                  className={`px-2 py-1 text-xs rounded-full ${
                                    u.role === "admin"
                                      ? "bg-purple-100 text-purple-800"
                                      : u.role === "teacher"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {translateRole(u.role)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <span
                                  className={`px-2 py-1 text-xs rounded-full ${
                                    u.status === "active"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {u.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                <button
                                  onClick={() => {
                                    setUserModalType("edit");
                                    setSelectedUser(u);
                                    setShowUserModal(true);
                                  }}
                                  className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600 text-sm transition-colors"
                                >
                                  Editar
                                </button>
                                <button
                                  onClick={() => handleDeleteItem("usuario", u.id)}
                                  className="bg-red-700 text-white px-3 py-1 rounded-md hover:bg-red-800 text-sm transition-colors"
                                >
                                  Eliminar
                                </button>
                                <button
                                  onClick={() => {
                                    setUserModalType("details");
                                    setSelectedUser(u);
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
                            <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                              {isTeacher ? "No tienes estudiantes asignados" : "No hay usuarios registrados"}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "productos" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Gestión de Productos</h2>
                <button
                  onClick={() => {
                    setModalType("create");
                    setSelectedItem(null);
                    setShowModal(true);
                  }}
                  className="w-full sm:w-auto bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700"
                >
                  Agregar Producto
                </button>
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Buscar por nombre de producto..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full sm:w-96 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              {productsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                </div>
              ) : (
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {(products || [])
                          .filter((p) =>
                            p.name?.toLowerCase().includes(productSearch.toLowerCase())
                          )
                          .map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50">
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
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
                                      <svg className="h-6 w-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                                      </svg>
                                    </div>
                                  )}
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">
                                      {product.name}
                                    </div>
                                    <div className="text-xs sm:text-sm text-gray-500 max-w-xs truncate">
                                      {product.description}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                  {product.category || "Sin categoría"}
                                </span>
                              </td>
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  ${product.price}
                                </div>
                              </td>
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
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
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    product.status === "Activo"
                                      ? "bg-green-100 text-green-800"
                                      : product.status === "Sin stock"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : product.status === "Inactivo"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {product.status === "Activo"
                                    ? "Disponible"
                                    : product.status === "Sin stock"
                                    ? "Sin Stock"
                                    : product.status === "Inactivo"
                                    ? "Inactivo"
                                    : product.status || "Desconocido"}
                                </span>
                              </td>
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
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
                                  onClick={() => handleDeleteItem("producto", product.id)}
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
                </div>
              )}
            </div>
          )}

          {activeTab === "clases" && renderClassesTab()}

          {activeTab === "reservas" && (
            <div className="space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Gestión de Reservas</h2>

              {/* Filtros */}
              <div className="flex flex-col sm:flex-row sm:items-end gap-3 mb-4">
                <input
                  type="text"
                  placeholder="Buscar por cliente..."
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 w-full sm:w-72"
                />
                <div className="flex flex-col">
                  <label htmlFor="date-from" className="text-xs text-gray-600 mb-1">
                    Desde
                  </label>
                  <input
                    id="date-from"
                    type="date"
                    value={bookingDateFrom}
                    onChange={(e) => setBookingDateFrom(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="date-to" className="text-xs text-gray-600 mb-1">
                    Hasta
                  </label>
                  <input
                    id="date-to"
                    type="date"
                    value={bookingDateTo}
                    onChange={(e) => setBookingDateTo(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
              </div>

              {bookingsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                </div>
              ) : (
                <div className="bg-white shadow overflow-hidden rounded-md">
                  {/* Mobile cards */}
                  <ul className="sm:hidden divide-y divide-gray-200">
                    {filteredBookings && filteredBookings.length > 0 ? (
                      filteredBookings.map((b) => (
                        <li key={b.id} className="p-4">
                          <p className="text-sm font-medium text-gray-900">{b.userName}</p>
                          <p className="text-xs text-gray-500">{b.userEmail}</p>
                          <p className="mt-1 text-sm text-gray-700">{b.className}</p>
                          <p className="text-xs text-gray-500">
                            {b.bookingDate} • {b.startTime}
                          </p>
                          <div className="mt-2">
                            <select
                              value={b.status}
                              onChange={async (e) => {
                                const newStatus = e.target.value;
                                await handleStatusChange(b.id, newStatus);
                              }}
                              className="px-2 py-1 text-xs rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            >
                              <option value="PENDING">Pendiente</option>
                              <option value="CONFIRMED">Confirmada</option>
                              <option value="REJECTED">Rechazada</option>
                            </select>
                          </div>
                          <div className="mt-3">
                            <button
                              onClick={() => {
                                setSelectedItem(b);
                                setShowBookingDetail(true);
                              }}
                              className="bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
                            >
                              Ver Detalles
                            </button>
                          </div>
                        </li>
                      ))
                    ) : (
                      <li className="p-6 text-center text-gray-500">No hay reservas registradas</li>
                    )}
                  </ul>

                  {/* Desktop table */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Clase</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Horario</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredBookings && filteredBookings.length > 0 ? (
                          filteredBookings.map((booking) => (
                            <tr key={booking.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <div>
                                  <div className="font-medium">{booking.userName}</div>
                                  <div className="text-gray-500">{booking.userEmail}</div>
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
                                    await handleStatusChange(booking.id, newStatus);
                                  }}
                                  className="px-2 py-1 text-xs rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-yellow-500
                                  bg-gray-100 text-gray-800"
                                >
                                  <option value="PENDING">Pendiente</option>
                                  <option value="CONFIRMED">Confirmada</option>
                                  <option value="REJECTED">Rechazada</option>
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
                            <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                              No hay reservas registradas
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB Pedidos */}
          {activeTab === "pedidos" && isAdmin && (
            <div className="space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Gestión de Pedidos</h2>

              {ordersLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                </div>
              ) : ordersError ? (
                <div className="py-8 text-red-600 font-bold">{ordersError}</div>
              ) : (
                <div className="bg-white shadow overflow-hidden rounded-md">
                  {/* Mobile cards */}
                  <ul className="sm:hidden divide-y divide-gray-200">
                    {orders.length > 0 ? (
                      orders.map((pedido) => (
                        <li key={pedido.id} className="p-4">
                          <p className="text-sm text-gray-900">{pedido.usuarioEmail || pedido.email || "—"}</p>
                          <p className="text-xs text-gray-500">Total: {formatMoney(pedido.montoTotal)}</p>
                          <span
                            className={`inline-block mt-2 px-2 py-0.5 text-xs rounded-full ${
                              pedido.estado === "CONFIRMADO"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {pedido.estado}
                          </span>
                          {pedido.estado !== "CONFIRMADO" && (
                            <div className="mt-3">
                              <button
                                onClick={() => confirmOrder(pedido.id)}
                                className="bg-green-600 text-white px-3 py-1 rounded-md text-sm"
                              >
                                Confirmar
                              </button>
                            </div>
                          )}
                        </li>
                      ))
                    ) : (
                      <li className="p-6 text-center text-gray-500">No hay pedidos</li>
                    )}
                  </ul>

                  {/* Desktop table */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {orders.length > 0 ? (
                          orders.map((pedido) => (
                            <tr key={pedido.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">{pedido.usuarioEmail || pedido.email || "—"}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 py-1 text-xs rounded-full ${
                                    pedido.estado === "CONFIRMADO"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {pedido.estado}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">{formatMoney(pedido.montoTotal)}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {pedido.estado !== "CONFIRMADO" && (
                                  <button
                                    onClick={() => confirmOrder(pedido.id)}
                                    className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 text-sm transition-colors"
                                  >
                                    Confirmar
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                              No hay pedidos
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modales */}
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

      {activeTab === "clases" && (
        <ClassModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedItem(null);
            setModalType("");
            dispatch(fetchClasses());
            dispatch(fetchBookings());
          }}
          classData={selectedItem}
          isEditing={modalType === "edit"}
          // Solo el profesor logueado como opción
          teachers={isTeacher ? [user] : teachers}
        />
      )}

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
