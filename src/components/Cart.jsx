import { useSelector, useDispatch } from "react-redux";
import { removeCartItem, fetchCart } from "../redux/slices/cartSlice";
import { HiOutlineTrash, HiOutlineShoppingCart } from "react-icons/hi";
import { FiX } from "react-icons/fi";

function Cart({ onClose }) {
  const { cart, isLoading } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const total = cart?.items?.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  ) ?? 0;

  if (isLoading)
    return (
      <div className="fixed top-0 right-0 w-full max-w-md h-full bg-white shadow-lg z-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-500"></div>
      </div>
    );

  return (
    <div className="fixed top-0 right-0 w-full max-w-md h-full bg-white shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <HiOutlineShoppingCart className="text-2xl text-yellow-600" />
          <h2 className="text-xl font-bold text-gray-900">Mi Carrito</h2>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-800 text-2xl"
          title="Cerrar"
        >
          <FiX />
        </button>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {!cart || !cart.items || cart.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <HiOutlineShoppingCart className="text-5xl text-gray-300 mb-2" />
            <h2 className="text-lg font-bold mb-2">Tu carrito está vacío</h2>
            <p className="text-gray-500 mb-4">
              Agrega productos para comenzar tu compra.
            </p>
          </div>
        ) : (
          cart.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b py-4"
            >
              <div className="flex items-center gap-4">
                {item.product.imageUrl ? (
                  <img
                    src={
                      item.product.imageUrl.startsWith("http")
                        ? item.product.imageUrl
                        : `${import.meta.env.VITE_API_URL || "http://localhost:8080/api"}${item.product.imageUrl.startsWith("/") ? "" : "/"}${item.product.imageUrl}`
                    }
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-lg border"
                    onError={(e) => {
                      if (!e.target.src.endsWith("/placeholder.jpg")) {
                        e.target.onerror = null;
                        e.target.src = "/placeholder.jpg";
                      }
                    }}
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded-lg border">
                    <HiOutlineShoppingCart className="text-2xl text-gray-400" />
                  </div>
                )}
                <div>
                  <div className="font-semibold text-gray-900">
                    {item.product.name}
                  </div>
                  <div className="text-xs text-gray-500 mb-1">
                    {item.product.category}
                  </div>
                  <div className="text-sm text-gray-700">
                    Cantidad: <span className="font-bold">{item.quantity}</span>
                  </div>
                  <div className="text-sm text-gray-700 font-bold">
                    ${item.product.price}
                  </div>
                </div>
              </div>
              <button
                onClick={() =>
                  dispatch(
                    removeCartItem({ itemId: item.id, cartToken: cart.token })
                  )
                }
                className="ml-4 p-2 bg-red-100 hover:bg-red-200 rounded-full"
                title="Eliminar"
              >
                <HiOutlineTrash className="text-red-600 text-lg" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t bg-gray-50">
        <div className="flex justify-between items-center mb-3">
          <span className="text-gray-700 font-semibold">Total:</span>
          <span className="text-xl font-bold text-yellow-700">${total}</span>
        </div>
        <button
          className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded-md font-semibold transition-colors"
          disabled={!cart || !cart.items || cart.items.length === 0}
        >
          Finalizar compra
        </button>
      </div>
    </div>
  );
}

export default Cart;