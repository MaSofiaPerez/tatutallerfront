import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDashboardStats,
  fetchRecentBookings,
  fetchMyDashboardStats,
  fetchMyRecentBookings,
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

function AdminPanel() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // 'create' or 'edit'
  const [selectedItem, setSelectedItem] = useState(null);

  // Estados para UserModal
  const [showUserModal, setShowUserModal] = useState(false);
  const [userModalType, setUserModalType] = useState(""); // 'create' or 'edit'
  const [selectedUser, setSelectedUser] = useState(null);

  const dispatch = useDispatch();

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
    if (isTeacher) {
      // Teachers usan sus estudiantes específicos
      return myStudents;
    } else {
      // Admins usan todos los usuarios filtrados
      return filterUsersByRole(users);
    }
  };

  // Redux state
  const {
    stats,
    recentBookings,
    myStats,
    myRecentBookings,
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

  useEffect(() => {
    // Cargar datos iniciales según la tab activa y el rol del usuario
    switch (activeTab) {
      case "dashboard":
        if (isTeacher) {
          // Teachers ven solo sus propias estadísticas y reservas
          dispatch(fetchMyDashboardStats());
          dispatch(fetchMyRecentBookings());
        } else {
          // Admins ven todas las estadísticas
          dispatch(fetchDashboardStats());
          dispatch(fetchRecentBookings());
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
          break;
        case "usuario":
          await dispatch(deleteUser(id)).unwrap();
          break;
        case "clase":
          await dispatch(deleteClass(id)).unwrap();
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
      await dispatch(
        updateBookingStatus({ bookingId, status: newStatus })
      ).unwrap();
    } catch (error) {
      alert(`Error al actualizar estado: ${error}`);
    }
  };

  const renderDashboard = () => {
    // Seleccionar los datos apropiados según el rol
    const currentStats = isTeacher ? myStats : stats;
    const currentBookings = isTeacher ? myRecentBookings : recentBookings;

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
                  {isTeacher ? "Mis Estudiantes" : "Total Usuarios"}
                </h3>
                <p className="text-3xl font-bold text-gray-900">
                  {currentStats?.totalUsers || 0}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">
                  {isTeacher ? "Mis Reservas" : "Total Reservas"}
                </h3>
                <p className="text-3xl font-bold text-gray-900">
                  {currentStats?.totalBookings || 0}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">
                  {isTeacher ? "Mis Ingresos" : "Ingresos"}
                </h3>
                <p className="text-3xl font-bold text-gray-900">
                  ${currentStats?.totalRevenue || 0}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">
                  {isTeacher ? "Mis Clases" : "Clases Activas"}
                </h3>
                <p className="text-3xl font-bold text-gray-900">
                  {currentStats?.totalClasses || 0}
                </p>
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {isTeacher ? "Mis Reservas Recientes" : "Reservas Recientes"}
              </h3>
              <div className="overflow-x-auto">
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
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentBookings && currentBookings.length > 0 ? (
                      currentBookings.map((booking) => (
                        <tr key={booking.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {booking.customerName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {booking.serviceName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {booking.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                booking.status === "confirmed"
                                  ? "bg-green-100 text-green-800"
                                  : booking.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {booking.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          className="px-6 py-4 text-center text-gray-500"
                        >
                          No hay reservas recientes
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

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
                    </thead>{" "}
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
                                {user.role}
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
                                className="text-yellow-600 hover:text-yellow-900"
                              >
                                Editar
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteItem("usuario", user.id)
                                }
                                className="text-red-600 hover:text-red-900"
                              >
                                Eliminar
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

              {productsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products && products.length > 0 ? (
                    products.map((product) => (
                      <div
                        key={product.id}
                        className="bg-white p-6 rounded-lg shadow"
                      >
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          {product.name}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {product.description}
                        </p>
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-2xl font-bold text-green-600">
                            ${product.price}
                          </span>
                          <span className="text-sm text-gray-500">
                            Stock: {product.stock || "Disponible"}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setModalType("edit");
                              setSelectedItem(product);
                              setShowModal(true);
                            }}
                            className="flex-1 bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteItem("producto", product.id)
                            }
                            className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-3 text-center py-8 text-gray-500">
                      No hay productos registrados
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "clases" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  Gestión de Clases
                </h2>
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

              {classesLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {classes && classes.length > 0 ? (
                    classes.map((classItem) => (
                      <div
                        key={classItem.id}
                        className="bg-white p-6 rounded-lg shadow"
                      >
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          {classItem.name}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {classItem.description}
                        </p>
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-2xl font-bold text-green-600">
                            ${classItem.price}
                          </span>
                          <span className="text-sm text-gray-500">
                            {classItem.duration}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setModalType("edit");
                              setSelectedItem(classItem);
                              setShowModal(true);
                            }}
                            className="flex-1 bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteItem("clase", classItem.id)
                            }
                            className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-3 text-center py-8 text-gray-500">
                      No hay clases registradas
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "reservas" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Gestión de Reservas
              </h2>

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
                          Hora
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
                      {bookings && bookings.length > 0 ? (
                        bookings.map((booking) => (
                          <tr key={booking.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <div>
                                <div className="font-medium">
                                  {booking.customerName}
                                </div>
                                <div className="text-gray-500">
                                  {booking.customerEmail}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {booking.serviceName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {booking.date}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {booking.time}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <select
                                value={booking.status}
                                onChange={(e) =>
                                  handleStatusChange(booking.id, e.target.value)
                                }
                                className={`px-2 py-1 text-xs rounded-full border-0 ${
                                  booking.status === "confirmed"
                                    ? "bg-green-100 text-green-800"
                                    : booking.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                <option value="pending">Pendiente</option>
                                <option value="confirmed">Confirmada</option>
                                <option value="cancelled">Cancelada</option>
                                <option value="completed">Completada</option>
                              </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => {
                                  setSelectedItem(booking);
                                  setShowModal(true);
                                }}
                                className="text-yellow-600 hover:text-yellow-900"
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

      {/* Modal para Crear/Editar Clases */}
      {activeTab === "clases" && (
        <ClassModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedItem(null);
            setModalType("");
          }}
          classData={selectedItem}
          isEditing={modalType === "edit"}
        />
      )}

      {/* Modal para Crear/Editar Usuarios */}
      {showUserModal && (
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
    </div>
  );
}

export default AdminPanel;
