import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createClass, updateClass } from "../redux/slices/classesSlice";
import toast from "react-hot-toast";

function ClassModal({ isOpen, onClose, classData, isEditing }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    maxCapacity: "",
    level: "Todos los Niveles",
    materials: "",
    requirements: "",
    teacherId: user?.id || "", // <-- inicializa con el ID del usuario
    dayOfWeek: "",
    startTime: "",
    endTime: "",
    duration: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isEditing && classData) {
      setFormData({
        name: classData.name || "",
        description: classData.description || "",
        price: classData.price || "",
        maxCapacity: classData.maxCapacity || "",
        level: classData.level || "Todos los Niveles",
        materials: classData.materials || "",
        requirements: classData.requirements || "",
        teacherId: classData.instructor?.id || user?.id || "", // <-- fallback al usuario logueado
        dayOfWeek: classData.dayOfWeek || "",
        startTime: classData.startTime || "",
        endTime: classData.endTime || "",
        duration: classData.duration || "",
      });
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        maxCapacity: "",
        level: "Principiante",
        materials: "",
        requirements: "",
        teacherId: user?.id || "", // <-- fallback al usuario logueado
        dayOfWeek: "",
        startTime: "",
        endTime: "",
        duration: "",
      });
    }
  }, [isEditing, classData, isOpen, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const classPayload = {
        ...formData,
        price: parseFloat(formData.price),
        maxCapacity: parseInt(formData.maxCapacity),
        duration: formData.duration || null,
        dayOfWeek: formData.dayOfWeek,
        startTime: formData.startTime,
        endTime: formData.endTime,
        teacherId: parseInt(formData.teacherId),
      };

      if (isEditing) {
        await dispatch(
          updateClass({ id: classData.id, ...classPayload })
        ).unwrap();
        toast.success("Clase actualizada exitosamente");
      } else {
        await dispatch(createClass(classPayload)).unwrap();
        toast.success("Clase creada exitosamente");
      }

      onClose();
    } catch (error) {
      toast.error(
        `Error al ${isEditing ? "actualizar" : "crear"} la clase: ${error}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? "Editar Clase" : "Crear Nueva Clase"}
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de la Clase *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Ej: Cerámica para Principiantes"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nivel *
              </label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option key="Principiante" value="Principiante">
                  Principiante
                </option>
                <option key="Intermedio" value="Intermedio">
                  Intermedio
                </option>
                <option key="Avanzado" value="Avanzado">
                  Avanzado
                </option>
                <option key="Todos los Niveles" value="Todos los Niveles">
                  Todos los Niveles
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profesor *
              </label>
              <select
                name="teacherId"
                value={formData.teacherId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Día de la Semana *
              </label>
              <select
                name="dayOfWeek"
                value={formData.dayOfWeek}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option key="default" value="">
                  Selecciona un día
                </option>
                <option key="MONDAY" value="MONDAY">
                  Lunes
                </option>
                <option key="TUESDAY" value="TUESDAY">
                  Martes
                </option>
                <option key="WEDNESDAY" value="WEDNESDAY">
                  Miércoles
                </option>
                <option key="THURSDAY" value="THURSDAY">
                  Jueves
                </option>
                <option key="FRIDAY" value="FRIDAY">
                  Viernes
                </option>
                <option key="SATURDAY" value="SATURDAY">
                  Sábado
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hora de inicio *
              </label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hora de Fin *
              </label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
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
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="Describe qué se aprende en esta clase..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                placeholder="2500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duración (min) *
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                min="30"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="120"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Materiales Incluidos
            </label>
            <textarea
              name="materials"
              value={formData.materials}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="Arcilla, herramientas básicas, esmaltes, acceso al horno..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Requisitos Previos
            </label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="Ninguno para principiantes, experiencia básica para cursos avanzados..."
            />
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
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 border border-transparent rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isEditing ? "Actualizando..." : "Creando..."}
                </div>
              ) : isEditing ? (
                "Actualizar Clase"
              ) : (
                "Crear Clase"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ClassModal;
