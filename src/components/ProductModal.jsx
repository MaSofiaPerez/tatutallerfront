import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createProduct, updateProduct } from "../redux/slices/productsSlice";
import toast from "react-hot-toast";

function ProductModal({ isOpen, onClose, productData, isEditing }) {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.products);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    imageUrl: "",
    category: "",
    status: "",
    cantidadProducto: "", // <-- aquí agregas el campo
  });

  const [localLoading, setLocalLoading] = useState(false);

  // Categorías y estados en español
  const categories = [
    "Pigmentos",
    "Esmalte",
    "Materia Prima",
    "Otros"
  ];

  const statuses = [
    "Disponible",
    "Sin Stock",
    "Descontinuado"
  ];

  const backendStatusToFrontend = {
    "Activo": "Disponible",
    "Sin stock": "Sin Stock",
    "Inactivo": "Descontinuado",
    // fallback por si llega el enum directo
    "ACTIVE": "Disponible",
    "OUT_OF_STOCK": "Sin Stock",
    "INACTIVE": "Descontinuado",
  };

  useEffect(() => {
    if (isEditing && productData) {
      setFormData({
        name: productData.name || "",
        description: productData.description || "",
        price: productData.price || "",
        stock: productData.stock || "",
        category: productData.category || "",
        status: backendStatusToFrontend[productData.status] || "Disponible",
        imageUrl: productData.imageUrl || "",
        file: null,
        cantidadProducto: productData.cantidadProducto || "",
      });
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        status: "Disponible",
        imageUrl: "",
        file: null,
        cantidadProducto: "",
      });
    }
  }, [isEditing, productData, isOpen]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setFormData((prev) => ({
        ...prev,
        file: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalLoading(true);

    try {
      const categoryMap = {
        "Pigmentos": "CERAMICA",
        "Esmalte": "HERRAMIENTAS",
        "Materia Prima": "MATERIALES",
        "Otros": "OTROS"
      };

      const statusMap = {
        "Disponible": "ACTIVE",
        "Sin Stock": "OUT_OF_STOCK",
        "Descontinuado": "INACTIVE"
      };

      // Construir el objeto producto (sin file)
      const productPayload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category: categoryMap[formData.category], // <-- Traducción aquí
        status: statusMap[formData.status],       // <-- Traducción aquí
        imageUrl: formData.imageUrl,
        cantidadProducto: formData.cantidadProducto,
      };

      // Usar FormData para enviar archivo + JSON
      const formDataToSend = new FormData();
      formDataToSend.append("product", JSON.stringify(productPayload));
      if (formData.file) {
        formDataToSend.append("file", formData.file);
      }

      if (isEditing) {
        await dispatch(
          updateProduct({ id: productData.id, data: formDataToSend })
        ).unwrap();
        toast.success("Producto actualizado exitosamente");
      } else {
        await dispatch(createProduct(formDataToSend)).unwrap();
        toast.success("Producto creado exitosamente");
      }

      onClose();
    } catch (error) {
      toast.error(
        `Error al ${isEditing ? "actualizar" : "crear"} el producto: ${error}`
      );
    } finally {
      setLocalLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? "Editar Producto" : "Crear Nuevo Producto"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4" encType="multipart/form-data">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Producto *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Ej: Jarrón de Cerámica Artesanal"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="">Selecciona una categoría</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio ($) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="1500.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock *
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Imagen (archivo)
            </label>
            <input
              type="file"
              name="file"
              accept="image/*"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <p className="text-xs text-gray-500 mt-1">
              Puedes subir una imagen o ingresar una URL abajo.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="Describe las características, materiales, dimensiones y cualidades especiales del producto..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cantidad / Presentación *
            </label>
            <input
              type="text"
              name="cantidadProducto"
              value={formData.cantidadProducto}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="Ej: 1 kilo, 200 gramos, 500 ml"
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Información importante:
            </h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>
                • El estado "Disponible" hará que el producto aparezca en la tienda
              </li>
              <li>• El estado "Sin Stock" ocultará el botón de compra</li>
              <li>
                • El estado "Descontinuado" ocultará completamente el producto
              </li>
            </ul>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={localLoading || isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 border border-transparent rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {localLoading || isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isEditing ? "Actualizando..." : "Creando..."}
                </div>
              ) : isEditing ? (
                "Actualizar Producto"
              ) : (
                "Crear Producto"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductModal;
