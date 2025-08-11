import { useSelector, useDispatch } from "react-redux";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { fetchCart } from "../redux/slices/cartSlice";

function CartButton({ onClick }) {
  const dispatch = useDispatch();
  const { cart, cartToken, isLoading } = useSelector((state) => state.cart);

  // Calcular el total de items en el carrito
  const totalItems =
    cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  const handleCartClick = async () => {
    try {
      // Obtener o generar cartToken
      let token = cartToken || localStorage.getItem("cartToken");

      if (!token) {
        token = crypto.randomUUID();
        localStorage.setItem("cartToken", token);
      }

      // Cargar el carrito antes de abrirlo
      await dispatch(fetchCart(token));

      // Ejecutar la función onClick pasada desde el componente padre
      if (onClick) {
        onClick();
      }
    } catch (error) {
      console.error("Error al cargar el carrito:", error);
      // Aún así abrir el carrito con estado vacío
      if (onClick) {
        onClick();
      }
    }
  };

  return (
    <button
      onClick={handleCartClick}
      disabled={isLoading}
      className="relative p-3 text-gray-600 hover:text-yellow-600 transition-all duration-200 disabled:opacity-50 group"
      title={`Ver carrito${totalItems > 0 ? ` (${totalItems} items)` : ""}`}
    >
      <div className="relative">
        <HiOutlineShoppingCart className="text-2xl group-hover:scale-110 transition-transform duration-200" />

        {/* Badge de cantidad */}
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded-full min-w-5 h-5 flex items-center justify-center px-1 shadow-lg animate-pulse">
            {totalItems > 99 ? "99+" : totalItems}
          </span>
        )}

        {/* Loading spinner */}
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
          </span>
        )}
      </div>
    </button>
  );
}

export default CartButton;
