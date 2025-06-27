import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { logoutUser } from "../redux/slices/authSlice";
import {
  HiShoppingCart,
  HiUser,
  HiBars3,
  HiXMark,
  HiEllipsisVertical,
  HiCog6Tooth,
} from "react-icons/hi2";

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLeftMenuOpen, setIsLeftMenuOpen] = useState(false);
  const [isRightMenuOpen, setIsRightMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const { user, isAuthenticated, isAdmin } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  const toggleLeftMenu = () => {
    setIsLeftMenuOpen(!isLeftMenuOpen);
    setIsRightMenuOpen(false);
  };

  const toggleRightMenu = () => {
    setIsRightMenuOpen(!isRightMenuOpen);
    setIsLeftMenuOpen(false);
  };

  const closeMenus = () => {
    setIsLeftMenuOpen(false);
    setIsRightMenuOpen(false);
  };

  return (
    <>
      {/* Overlay */}
      {(isLeftMenuOpen || isRightMenuOpen) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={closeMenus}
        />
      )}

      {/* Left Side Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          isLeftMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-medium text-gray-800">Taller</h3>
          <button
            onClick={closeMenus}
            className="text-gray-500 hover:text-gray-700"
          >
            <HiXMark className="w-6 h-6" />
          </button>
        </div>
        <nav className="p-4">
          <ul className="space-y-4">
            <li>
              <Link
                to="/clases"
                className="block text-gray-700 hover:text-yellow-600 transition-colors"
                onClick={closeMenus}
              >
                Clases de Cerámica
              </Link>
            </li>
            <li>
              <Link
                to="/ciclo-formacion"
                className="block text-gray-700 hover:text-yellow-600 transition-colors"
                onClick={closeMenus}
              >
                Ciclo de Formación
              </Link>
            </li>
            <li>
              <Link
                to="/cowork"
                className="block text-gray-700 hover:text-yellow-600 transition-colors"
                onClick={closeMenus}
              >
                Cowork
              </Link>
            </li>
            <li>
              <Link
                to="/alquiler-hornos"
                className="block text-gray-700 hover:text-yellow-600 transition-colors"
                onClick={closeMenus}
              >
                Alquiler de Hornos
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Right Side Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          isRightMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-medium text-gray-800">Tienda</h3>
          <button
            onClick={closeMenus}
            className="text-gray-500 hover:text-gray-700"
          >
            <HiXMark className="w-6 h-6" />
          </button>
        </div>
        <nav className="p-4">
          <ul className="space-y-4">
            <li>
              <Link
                to="/tienda"
                className="block text-gray-700 hover:text-yellow-600 transition-colors"
                onClick={closeMenus}
              >
                Tienda Online
              </Link>
            </li>
            <li>
              <Link
                to="/account"
                className="block text-gray-700 hover:text-yellow-600 transition-colors"
                onClick={closeMenus}
              >
                Mi Cuenta
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-md sticky top-0 z-30">
        <div className="container mx-auto px-4">
          {/* Header Content */}
          <div className="flex justify-between items-center py-4">
            {/* Left Side - Mobile Menu + Logo */}
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button (Left) */}
              <button
                onClick={toggleLeftMenu}
                className="md:hidden text-gray-600 hover:text-gray-800"
              >
                <HiBars3 className="w-6 h-6" />
              </button>

              {/* Logo and Title */}
              <Link to="/" className="flex items-center space-x-3">
                <img
                  src="/img/imageslogotatu.png"
                  alt="Tatu Taller"
                  className="w-12 h-12 md:w-16 md:h-16"
                />
                <h1 className="text-xl md:text-2xl font-medium text-gray-800">
                  Tatú Taller
                </h1>
              </Link>
            </div>

            {/* Right Side - User Actions */}
            <div className="flex items-center space-x-4">
              {/* TEMPORAL: Botón directo al admin para testing */}
              <Link
                to="/admin"
                className="flex items-center space-x-1 bg-yellow-600 text-white px-3 py-1 rounded-md hover:bg-yellow-700 transition-colors"
              >
                <HiCog6Tooth className="w-4 h-4" />
                <span className="text-sm">Admin Demo</span>
              </Link>

              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <span className="hidden md:inline text-gray-700">
                    Hola, {user?.name}
                  </span>

                  {/* Admin Panel Button */}
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center space-x-1 bg-yellow-600 text-white px-3 py-1 rounded-md hover:bg-yellow-700 transition-colors"
                    >
                      <HiCog6Tooth className="w-4 h-4" />
                      <span className="hidden lg:inline text-sm">Admin</span>
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-gray-800 p-1"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <HiUser className="w-5 h-5" />
                  <span className="hidden md:inline">Mi Cuenta</span>
                </Link>
              )}

              <Link
                to="/cart"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 relative transition-colors"
              >
                <HiShoppingCart className="w-5 h-5" />
                <span className="hidden md:inline">Carrito</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Button (Right) */}
              <button
                onClick={toggleRightMenu}
                className="md:hidden text-gray-600 hover:text-gray-800"
              >
                <HiEllipsisVertical className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:block border-t border-gray-200">
          <div className="container mx-auto px-4">
            <ul className="flex justify-center space-x-8 py-4">
              <li>
                <Link
                  to="/clases"
                  className="text-gray-700 hover:text-yellow-600 font-medium transition-colors relative group"
                >
                  Clases
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-600 transition-all group-hover:w-full"></span>
                </Link>
              </li>
              <li>
                <Link
                  to="/ciclo-formacion"
                  className="text-gray-700 hover:text-yellow-600 font-medium transition-colors relative group"
                >
                  Ciclo de Formación
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-600 transition-all group-hover:w-full"></span>
                </Link>
              </li>
              <li>
                <Link
                  to="/cowork"
                  className="text-gray-700 hover:text-yellow-600 font-medium transition-colors relative group"
                >
                  Cowork
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-600 transition-all group-hover:w-full"></span>
                </Link>
              </li>
              <li>
                <Link
                  to="/alquiler-hornos"
                  className="text-gray-700 hover:text-yellow-600 font-medium transition-colors relative group"
                >
                  Alquiler de Hornos
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-600 transition-all group-hover:w-full"></span>
                </Link>
              </li>
              <li>
                <Link
                  to="/tienda"
                  className="text-gray-700 hover:text-yellow-600 font-medium transition-colors relative group"
                >
                  Tienda
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-600 transition-all group-hover:w-full"></span>
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </header>
    </>
  );
}

export default Navbar;
