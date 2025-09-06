import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  removeCartItem,
  updateCartItem,
  clearCart,
} from "../redux/slices/cartSlice";
import {
  HiOutlineTrash,
  HiOutlineShoppingCart,
  HiMinus,
  HiPlus,
  HiOutlineShoppingBag,
} from "react-icons/hi";
import { FiX } from "react-icons/fi";
import { useState } from "react";
import { API_BASE_URL, getImageUrl } from "../utils/apiBase";
import api from "../redux/api"; // Agrega esta línea

function Cart({ onClose }) {
  const { cart, isLoading, error } = useSelector((state) => state.cart);
  const user = useSelector((state) => state.auth.user); // <--- obtiene el usuario logueado
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const total =
    cart?.items?.reduce(
      (acc, item) => acc + (item.product?.price || 0) * item.quantity,
      0
    ) ?? 0;

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    setIsUpdating(true);
    try {
      await dispatch(
        updateCartItem({
          itemId,
          quantity: newQuantity,
          cartToken: cart?.token,
        })
      );
    } catch (error) {
      console.error("Error al actualizar cantidad:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveItem = async (itemId) => {
    setIsUpdating(true);
    try {
      await dispatch(
        removeCartItem({
          itemId,
          cartToken: cart?.token,
        })
      );
    } catch (error) {
      console.error("Error al eliminar item:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm("¿Estás seguro de que quieres vaciar el carrito?"))
      return;

    setIsUpdating(true);
    try {
      await dispatch(clearCart(cart?.token));
    } catch (error) {
      console.error("Error al vaciar carrito:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleContinueShopping = () => {
    onClose();
    navigate("/tienda");
  };

  const handleCheckout = async () => {
    if (!user?.email) {
      toast.error("No se encontró el email del usuario logueado.");
      return;
    }
    setCheckoutLoading(true);
    try {
      const res = await api.post("/pedidos/checkout", { email: user.email });
      if (res.data && res.data.init_point) {
        window.location.href = res.data.init_point; // Redirige a Mercado Pago
      } else {
        toast.error(res.data?.error || "No se pudo iniciar el pago.");
      }
    } catch (e) {
      toast.error("Error al iniciar el checkout.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  // Maneja el pago en efectivo: da de alta el pedido y redirige a info
  const [cashLoading, setCashLoading] = useState(false);
  const handleCashPayment = async () => {
    if (!user?.email) {
      toast.error("No se encontró el email del usuario logueado.");
      return;
    }
    const token = user?.token || localStorage.getItem("token");
    if (!token) {
      toast.error("Debes iniciar sesión para realizar el pedido.");
      return;
    }
    setCashLoading(true);
    try {
      const res = await api.post(
        "/pedidos",
        { email: user.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.status === 200) {
        navigate("/efectivo-info");
        dispatch(clearCart(cart?.token));
      } else {
        toast.error(
          res.data?.error || "No se pudo registrar el pedido en efectivo."
        );
      }
    } catch (e) {
      toast.error("Error al registrar el pedido en efectivo.");
    } finally {
      setCashLoading(false);
    }
  };

  if (isLoading)
    return (
      <div className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-2xl p-8 mx-4 max-w-sm w-full">
          <div className="text-center">
            <div className="relative mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-200 border-t-yellow-600 mx-auto"></div>
              <HiOutlineShoppingCart className="absolute inset-0 m-auto w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Cargando carrito
            </h3>
            <p className="text-gray-600">Obteniendo tus productos...</p>
          </div>
        </div>
      </div>
    );

  return (
    <>
      {/* Overlay con fondo muy sutil - solo blur sin oscurecer */}
      <div className="fixed inset-0 backdrop-blur-sm z-40" onClick={onClose} />

      {/* Cart Sidebar como overlay flotante */}
      <div className="fixed top-0 right-0 w-full max-w-md h-full bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-yellow-50 to-orange-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-full">
              <HiOutlineShoppingCart className="text-2xl text-yellow-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Mi Carrito</h2>
              <p className="text-sm text-gray-600">
                {cart?.items?.length || 0}{" "}
                {(cart?.items?.length || 0) === 1 ? "producto" : "productos"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Botón discreto de vaciar carrito */}
            {cart?.items && cart.items.length > 0 && (
              <button
                onClick={handleClearCart}
                disabled={isUpdating}
                className="p-2 text-gray-400 hover:text-red-500 disabled:opacity-50 transition-colors group"
                title="Vaciar carrito"
              >
                <HiOutlineTrash className="text-lg group-hover:scale-110 transition-transform" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
              title="Cerrar carrito"
            >
              <FiX className="text-xl text-gray-500 group-hover:text-gray-700" />
            </button>
          </div>
        </div>
        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="flex-shrink-0">
                <svg
                  className="w-5 h-5 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          </div>
        )}{" "}
        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {!cart || !cart.items || cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12">
              <div className="bg-gray-100 rounded-full p-6 mb-6">
                <HiOutlineShoppingBag className="text-6xl text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Tu carrito está vacío
              </h3>
              <p className="text-gray-600 mb-8 max-w-sm">
                Descubre nuestra increíble selección de productos cerámicos y
                agrega algunos a tu carrito
              </p>
              <button
                onClick={handleContinueShopping}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md"
              >
                Explorar tienda
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    {item.product?.imageUrl ? (
                      <img
                        src={getImageUrl(item.product.imageUrl)}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-lg border-2 border-gray-100 shadow-sm"
                        onError={(e) => {
                          e.target.src =
                            'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect width="80" height="80" fill="%23f3f4f6"/><text x="40" y="40" text-anchor="middle" dy="0.3em" fill="%236b7280" font-size="12">Sin imagen</text></svg>';
                        }}
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-lg border-2 border-gray-100">
                        <HiOutlineShoppingCart className="text-3xl text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate text-lg">
                      {item.product?.name || "Producto"}
                    </h4>
                    <p className="text-sm text-gray-500 mb-1">
                      {item.product?.category || "Sin categoría"}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-yellow-600">
                        ${item.product?.price || 0}
                      </span>
                      <span className="text-sm text-gray-400">c/u</span>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                    <button
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity - 1)
                      }
                      disabled={isUpdating || item.quantity <= 1}
                      className="p-2 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-md shadow-sm border transition-colors"
                    >
                      <HiMinus className="text-sm text-gray-600" />
                    </button>
                    <span className="w-12 text-center font-bold text-gray-800">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity + 1)
                      }
                      disabled={isUpdating}
                      className="p-2 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-md shadow-sm border transition-colors"
                    >
                      <HiPlus className="text-sm text-gray-600" />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={isUpdating}
                    className="p-3 bg-red-50 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors group"
                    title="Eliminar producto"
                  >
                    <HiOutlineTrash className="text-red-500 group-hover:text-red-600 text-lg" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Footer */}
        {cart?.items && cart.items.length > 0 && (
          <div className="border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="px-6 py-4">
              {/* Total */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-lg font-semibold text-gray-700">
                      Total a pagar:
                    </span>
                    <p className="text-sm text-gray-500">
                      {cart.items.reduce((acc, item) => acc + item.quantity, 0)}{" "}
                      productos
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-bold text-gradient bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                      ${total.toFixed(2)}
                    </span>
                    <p className="text-sm text-gray-500">UYU</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-md"
                  disabled={isUpdating || checkoutLoading}
                  onClick={handleCheckout}
                >
                  {checkoutLoading ? "Redirigiendo..." : "🛒 Finalizar compra"}
                </button>
                <button
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-md"
                  disabled={isUpdating || cashLoading}
                  onClick={handleCashPayment}
                >
                  {cashLoading ? "Procesando..." : "💵 Pago en efectivo"}
                </button>
                <button
                  onClick={handleContinueShopping}
                  className="w-full bg-white hover:bg-gray-50 text-gray-700 py-2 rounded-lg border border-gray-200 font-medium transition-colors"
                >
                  ← Continuar comprando
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Cart;
