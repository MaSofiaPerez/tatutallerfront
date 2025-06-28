import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createClass, updateClass } from "../redux/slices/classesSlice";
import { fetchTeachers } from "../redux/slices/usersSlice";
import toast from "react-hot-toast";

function ClassModal({ isOpen, onClose, classData, isEditing }) {
  const dispatch = useDispatch();
  const { teachers, isLoading: teachersLoading } = useSelector(
    (state) => state.users
  );
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    maxCapacity: "",
    level: "Principiante",
    materials: "",
    requirements: "",
    imageUrl: "",
    teacherId: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Teachers temporales como fallback
  const fallbackTeachers = [
    {
      id: "temp-1",
      name: "Profesor",
      lastName: "Temporal 1",
      email: "teacher1@temp.com",
    },
    {
      id: "temp-2",
      name: "Profesor",
      lastName: "Temporal 2",
      email: "teacher2@temp.com",
    },
    {
      id: "temp-3",
      name: "Instructor",
      lastName: "Ceramica",
      email: "ceramica@temp.com",
    },
  ];

  useEffect(() => {
    // Cargar la lista de teachers cuando se abre el modal
    if (isOpen) {
      console.log("Modal abierto, cargando teachers...");
      dispatch(fetchTeachers());
    }
  }, [isOpen, dispatch]);

  useEffect(() => {
    console.log("Teachers actualizados:", teachers);

    // Si no hay teachers, mostrar información de debug
    if (!teachers || teachers.length === 0) {
      console.log("⚠️ No se encontraron teachers. Esto puede indicar:");
      console.log("1. El endpoint /admin/teachers no existe en el backend");
      console.log('2. No hay usuarios con rol "teacher" en la base de datos');
      console.log("3. Problemas de autenticación/autorización");
      console.log("4. La respuesta del backend tiene un formato diferente");
      console.log("💡 Usando teachers temporales como fallback");
    }
  }, [teachers]);

  // Usar teachers del backend si están disponibles, sino usar fallback
  const availableTeachers =
    teachers && teachers.length > 0 ? teachers : fallbackTeachers;

  useEffect(() => {
    if (isEditing && classData) {
      setFormData({
        name: classData.name || "",
        description: classData.description || "",
        price: classData.price || "",
        duration: classData.duration || "",
        maxCapacity: classData.maxCapacity || "",
        level: classData.level || "Principiante",
        materials: classData.materials || "",
        requirements: classData.requirements || "",
        imageUrl: classData.imageUrl || "",
        teacherId: classData.teacherId || "",
      });
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        duration: "",
        maxCapacity: "",
        level: "Principiante",
        materials: "",
        requirements: "",
        imageUrl: "",
        teacherId: "",
      });
    }
  }, [isEditing, classData, isOpen]);

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
        duration: parseInt(formData.duration),
        maxCapacity: parseInt(formData.maxCapacity),
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
                <option value="Principiante">Principiante</option>
                <option value="Intermedio">Intermedio</option>
                <option value="Avanzado">Avanzado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profesor *
                {(!teachers || teachers.length === 0) && (
                  <span className="text-amber-600 text-xs ml-1">
                    (usando datos temporales)
                  </span>
                )}
              </label>
              <select
                name="teacherId"
                value={formData.teacherId}
                onChange={handleChange}
                required
                disabled={teachersLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:opacity-50"
              >
                <option value="">
                  {teachersLoading
                    ? "Cargando profesores..."
                    : "Selecciona un profesor"}
                </option>
                {availableTeachers.map((teacher) => (
                  <option
                    key={teacher.id || teacher._id}
                    value={teacher.id || teacher._id}
                  >
                    {teacher.name || teacher.username || teacher.email}{" "}
                    {teacher.lastName && `${teacher.lastName}`}
                    {String(teacher.id || teacher._id).includes("temp-") &&
                      " (Temporal)"}
                  </option>
                ))}
              </select>
              {(!teachers || teachers.length === 0) && !teachersLoading && (
                <p className="text-sm text-amber-600 mt-1">
                  ⚠️ Usando profesores temporales. Para solucionarlo:
                  <br />• Crea usuarios con rol "teacher" en tu base de datos
                  <br />• O implementa el endpoint /admin/teachers en tu backend
                </p>
              )}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacidad Máxima *
              </label>
              <input
                type="number"
                name="maxCapacity"
                value={formData.maxCapacity}
                onChange={handleChange}
                required
                min="1"
                max="20"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="8"
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL de Imagen
            </label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="https://example.com/imagen-clase.jpg"
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
