import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublicProducts } from "../redux/slices/productsSlice";
import { addProductToCart } from "../redux/slices/cartSlice";
import { HiShoppingBag } from "react-icons/hi2";
import { API_BASE_URL } from "../utils/apiBase";

function Tienda() {
  const dispatch = useDispatch();
  const { products, isLoading, error } = useSelector((state) => state.products);
  const cartToken = useSelector((state) => state.cart?.cartToken ?? null);

  const [categories, setCategories] = useState([
    "Todos",
    "Pigmentos",
    "Esmalte",
    "Materia Prima",
    "Otros",
  ]);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchPublicProducts());
  }, [dispatch]);

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "Todos" || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (product) => {
    // Obtener o generar cartToken
    let token = cartToken || localStorage.getItem("cartToken");

    if (!token) {
      token = crypto.randomUUID();
      localStorage.setItem("cartToken", token);
    }

    dispatch(
      addProductToCart({
        productId: product.id,
        quantity: 1,
        cartToken: token,
      })
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Error al cargar productos
          </h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => dispatch(fetchPublicProducts())}
            className="mt-4 bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 to-black text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Espacio para el logo - temporalmente usando ícono */}
          <div className="mb-6">
            <HiShoppingBag className="w-20 h-20 mx-auto text-gray-300" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Tatú Shop Cerámica
          </h1>
          <div className="w-24 h-1 bg-gray-300 mx-auto mb-6"></div>
          <p className="text-xl md:text-2xl max-w-4xl mx-auto mb-8 opacity-90">
            Materiales cerámicos de calidad para tu taller. Arcillas, pastas,
            óxidos, pigmentos, engobes, esmaltes y más.
          </p>

          {/* Información de envíos y ubicación */}
          <div className="flex justify-center gap-8 mt-8 text-gray-300">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Hacemos envíos</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>Montevideo, Uruguay</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contenido de la tienda */}
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filtros */}
          <div className="mb-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Buscá el producto que necesitás
            </h2>
            <div className="flex flex-col gap-4">
              {/* Búsqueda */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Barro rojo, Esmalte blanco..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 shadow-sm"
                />
                <svg
                  className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 16.65z"
                  />
                </svg>
              </div>

              {/* Categorías */}
              <div className="flex gap-3 flex-wrap justify-center">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-5 py-2 rounded-full font-medium transition-all shadow-sm ${
                      selectedCategory === category
                        ? "bg-gray-800 text-white hover:bg-gray-900"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grid de productos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  {product.imageUrl ? (
                    <img
                      src={
                        product.imageUrl
                          ? product.imageUrl.startsWith("http")
                            ? product.imageUrl
                            : `${API_BASE_URL}/api${product.imageUrl.startsWith("/") ? "" : "/"}${product.imageUrl}`
                          : "/placeholder.jpg"
                      }
                      alt={product.name}
                      className="object-cover w-full h-64"
                      onError={(e) => {
                        if (!e.target.src.endsWith("/placeholder.jpg")) {
                          e.target.onerror = null;
                          e.target.src = "/placeholder.jpg";
                        }
                      }}
                    />
                  ) : (
                    <svg
                      className="w-16 h-16 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  )}
                </div>

                <div className="p-4">
                  <div className="mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {product.name}
                    </h3>
                  </div>

                  <p className="text-gray-600 text-sm mb-3">
                    {product.description}
                  </p>
                  <p className="text-gray-500 text-sm mb-1">
                    {product.cantidadProducto}
                  </p>

                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-gray-800">
                      ${product.price}
                    </span>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-md font-medium transition-colors shadow-md"
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No se encontraron productos
              </h3>
              <p className="text-gray-600">
                Intenta con otros términos de búsqueda o categorías.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Tienda;
