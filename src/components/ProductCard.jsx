import { useState } from "react";

function ProductCard({ product, onEdit, onDelete, showActions = false }) {
  const [imageError, setImageError] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-UY', {
      style: 'currency',
      currency: 'UYU'
    }).format(price);
  };

  const getCategoryName = (categoryId) => {
    const categories = {
      vasijas: "Vasijas y Jarrones",
      platos: "Platos y Vajilla", 
      tazas: "Tazas y Mugs",
      decorativo: "Artículos Decorativos",
      macetas: "Macetas y Contenedores",
      figuras: "Figuras y Esculturas",
      cuencos: "Cuencos y Bowls",
      herramientas: "Herramientas de Cerámica",
      materiales: "Materiales y Arcillas",
      otros: "Otros"
    };
    return categories[categoryId] || categoryId;
  };

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border-l-4 ${
      product.isActive ? 'border-green-500' : 'border-red-500'
    }`}>
      {/* Imagen del producto */}
      <div className="relative h-48 bg-gray-200">
        {product.imageUrl && !imageError ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <svg 
              className="w-16 h-16 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
            </svg>
          </div>
        )}
        
        {/* Badge de estado */}
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 text-xs rounded-full font-medium ${
            product.isActive 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {product.isActive ? 'Disponible' : 'No disponible'}
          </span>
        </div>
      </div>

      {/* Contenido de la tarjeta */}
      <div className="p-4">
        {/* Título y categoría */}
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {product.name}
          </h3>
          {product.category && (
            <p className="text-sm text-blue-600 mt-1">
              {getCategoryName(product.category)}
            </p>
          )}
        </div>

        {/* Descripción */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
          {product.description}
        </p>

        {/* Precio y stock */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-bold text-green-600">
            {formatPrice(product.price)}
          </span>
          <span className={`text-sm px-2 py-1 rounded font-medium ${
            product.stock > 10 
              ? 'bg-green-100 text-green-800'
              : product.stock > 0
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}>
            Stock: {product.stock || 0}
          </span>
        </div>

        {/* Acciones (para admin) */}
        {showActions && (
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(product)}
              className="flex-1 bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 text-sm font-medium transition-colors"
            >
              Editar
            </button>
            <button
              onClick={() => onDelete(product.id)}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 text-sm font-medium transition-colors"
            >
              Eliminar
            </button>
          </div>
        )}

        {/* Botón para tienda (para clientes) */}
        {!showActions && product.isActive && product.stock > 0 && (
          <button className="w-full bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 font-medium transition-colors">
            Agregar al Carrito
          </button>
        )}

        {!showActions && (!product.isActive || product.stock === 0) && (
          <button 
            disabled 
            className="w-full bg-gray-300 text-gray-500 py-2 px-4 rounded-md cursor-not-allowed font-medium"
          >
            No Disponible
          </button>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
