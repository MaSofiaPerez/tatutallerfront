// filepath: /Users/ticianogonzalez/Desktop/carpeta sin título/tatutallerfront/tatutallerfront/src/Features/AdminPanel.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, fetchUsers } from '../redux/actions'; // Adjust the import paths as necessary
import ProductModal from '../components/ProductModal'; // Adjust the import paths as necessary
import UserModal from '../components/UserModal'; // Adjust the import paths as necessary
import ClassModal from '../components/ClassModal'; // Adjust the import paths as necessary
import BookingDetailModal from '../components/BookingDetailModal'; // Adjust the import paths as necessary
import ClassDetailsModal from '../components/ClassDetailsModal'; // Adjust the import paths as necessary
import UserDetailsModal from '../components/UserDetailsModal'; // Adjust the import paths as necessary
import { toast } from 'react-toastify';

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

  const {
    users,
    isLoading: usersLoading,
  } = useSelector((state) => state.users);
  const { products, isLoading: productsLoading } = useSelector(
    (state) => state.products
  );
  const { user, isAdmin, isTeacher } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchProducts());
  }, [dispatch]);

  const getUsersList = () => {
    return users.filter(user => user.name.toLowerCase().includes(userSearch.toLowerCase()));
  };

  const renderProductsTable = () => {
    return (
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Producto
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Precio
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Stock
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {product.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${product.price}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {product.stock > 0 ? product.stock : (
                  <button
                    disabled
                    className="bg-gray-300 text-gray-500 px-3 py-1 rounded-md"
                  >
                    Sin Stock
                  </button>
                )}
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
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Panel de Administración</h1>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Productos</h2>
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
        renderProductsTable()
      )}
      {/* Other components and modals would go here */}
    </div>
  );
}

export default AdminPanel;