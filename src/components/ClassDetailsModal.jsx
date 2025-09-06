import React, { useState, useEffect } from "react";
import api from "../redux/api"; // Usa el cliente centralizado
import { isWithinInterval, parseISO } from "date-fns";
import { useSelector } from "react-redux";
import { API_BASE_URL } from "../utils/apiBase";

const ClassDetailsModal = ({ classId, onClose }) => {
  const [reservations, setReservations] = useState([]);
  const [startDate, setStartDate] = useState(""); // Sin valor inicial
  const [endDate, setEndDate] = useState("");     // Sin valor inicial
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [error, setError] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchReservations = async () => {
      if (!classId) {
        console.error("Invalid classId:", classId);
        setError("El ID de la clase no es válido.");
        return;
      }

      if (isFetching) return;
      setIsFetching(true);

      try {
        const res = await api.get(
          `/admin/classes/${classId}/reservations`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        const data = res.data;
        const formattedReservations = data.map((reservation) => ({
          id: reservation.id,
          userName: reservation.userName || reservation.studentName || "",
          date: reservation.bookingDate,
          startTime: reservation.startTime,
          endTime: reservation.endTime,
          status: reservation.status,
        }));
        setReservations(formattedReservations);
        setError(null);
      } catch (error) {
        setError(
          error.response?.status === 500
            ? "Hubo un problema en el servidor. Por favor, inténtalo más tarde."
            : "No se pudieron cargar las reservas. Por favor, inténtalo de nuevo más tarde."
        );
      } finally {
        setIsFetching(false);
      }
    };

    fetchReservations();
  }, [classId, token]);

  useEffect(() => {
    // Si no hay fechas, mostrar todas
    if (!startDate && !endDate) {
      setFilteredReservations(reservations);
      return;
    }
    const filtered = reservations.filter((reservation) => {
      const reservationDate = parseISO(reservation.date);
      if (startDate && !endDate) {
        return reservationDate >= parseISO(startDate);
      }
      if (!startDate && endDate) {
        return reservationDate <= parseISO(endDate);
      }
      if (startDate && endDate) {
        return isWithinInterval(reservationDate, {
          start: parseISO(startDate),
          end: parseISO(endDate),
        });
      }
      return true;
    });
    setFilteredReservations(filtered);
  }, [startDate, endDate, reservations]);

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 relative">
        <h2 className="text-2xl font-bold mb-4">Detalles de la Clase</h2>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 bg-white border border-gray-300 rounded-full p-2 shadow-md"
          aria-label="Cerrar"
        >
          ✕
        </button>

        {error ? (
          <p className="text-red-500 text-center mb-4">{error}</p>
        ) : (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por rango de fechas:
              </label>
              <div className="flex space-x-4">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                  placeholder="Desde"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                  placeholder="Hasta"
                />
              </div>
            </div>

            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Día
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Horario
                  </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Estado
                  </th>
                
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReservations.map((reserva) => (
                  <tr key={reserva.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reserva.date
                        ? new Date(reserva.date).toLocaleDateString("es-ES")
                        : ""}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reserva.userName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reserva.startTime && reserva.endTime
                        ? `${reserva.startTime} - ${reserva.endTime}`
                        : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{
                        PENDING: "Pendiente",
                        CONFIRMED: "Confirmada",
                        REJECTED: "Rechazada",
                        CANCELLED: "Cancelada",
                        COMPLETED: "Completada"
                      }[reserva.status?.toUpperCase()] || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredReservations.length === 0 && (
              <p className="text-center text-gray-500 mt-4">
                No hay reservas para este rango de fechas.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ClassDetailsModal;
