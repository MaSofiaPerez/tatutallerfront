import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeachers } from "../redux/slices/usersSlice";
import toast from "react-hot-toast";

function BookingDetailModal({ isOpen, onClose, booking, onSave, onCancel }) {
  const dispatch = useDispatch();
  const teachers = useSelector((state) => state.users.teachers);
  const isLoadingTeachers = useSelector((state) => state.users.isLoading);

  // Sincronizar form con booking al abrir el modal
  const [form, setForm] = useState({ ...booking });
  useEffect(() => {
    setForm({ ...booking });
  }, [booking]);

  // Cargar profesores si no están en el store
  useEffect(() => {
    if ((!teachers || teachers.length === 0) && isOpen) {
      dispatch(fetchTeachers());
    }
  }, [dispatch, teachers, isOpen]);

  // Manejar cambios en los campos editables
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // DEBUG: Mostrar props para detectar por qué no se muestra el modal
  console.log("BookingDetailModal", { isOpen, booking, teachers });
  if (!isOpen || !booking) return null;

  // Formatear fecha y hora para input datetime-local
  function getDatetimeLocal(date, time) {
    if (!date || !time) return "";
    const [hh = "00", mm = "00"] = time.split(":");
    return `${date}T${hh}:${mm}`;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4">Detalle de Reserva</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cliente
            </label>
            <input
              className="mt-1 block w-full border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
              value={booking.userName || ""}
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              className="mt-1 block w-full border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
              value={booking.userEmail || ""}
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Horario
            </label>
            <input
              name="startTime"
              type="datetime-local"
              className="mt-1 block w-full border-gray-300 rounded-md"
              value={
                form.startTime ||
                getDatetimeLocal(booking.bookingDate, booking.startTime)
              }
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Profesor
            </label>
            <select
              name="profesor"
              className="mt-1 block w-full border-gray-300 rounded-md"
              value={form.profesor || booking.teacherName || ""}
              onChange={handleChange}
              disabled={isLoadingTeachers}
            >
              <option value="">Seleccionar profesor</option>
              {teachers &&
                teachers.length > 0 &&
                teachers.map((teacher) => (
                  <option
                    key={teacher.id || teacher._id}
                    value={teacher.name || teacher.username}
                  >
                    {teacher.name || teacher.username}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Estado
            </label>
            <input
              className="mt-1 block w-full border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
              value={booking.status || ""}
              disabled
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            onClick={onClose}
          >
            Cerrar
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={() => onCancel(form)}
          >
            Cancelar Reserva
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => onSave(form)}
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookingDetailModal;
