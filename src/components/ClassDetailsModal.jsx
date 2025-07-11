import React, { useState, useEffect } from "react";
import apiClient from "../redux/api";
import { startOfMonth, endOfMonth, isWithinInterval, parseISO } from "date-fns";

const ClassDetailsModal = ({ classId, onClose }) => {
  const [reservations, setReservations] = useState([]);
  const [startDate, setStartDate] = useState(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState(endOfMonth(new Date()));
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [error, setError] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const fetchReservations = async () => {
      if (!classId) {
        console.error("Invalid classId:", classId);
        setError("El ID de la clase no es válido.");
        return;
      }

      if (isFetching) return; // Prevent duplicate requests
      setIsFetching(true);

      const url = `/admin/classes/${classId}/reservations`;
      console.log("Fetching reservations from URL:", url);

      try {
        const response = await apiClient.get(url);
        const formattedReservations = response.data.map((reservation) => ({
          id: reservation.id,
          studentName: reservation.studentName,
          date: reservation.date,
          startTime: reservation.startTime,
          endTime: reservation.endTime,
          availableSpots: reservation.availableSpots,
        }));
        setReservations(formattedReservations);
        setError(null);
      } catch (error) {
        console.error("Error fetching reservations:", error);
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
  }, [classId]);

  useEffect(() => {
    const filtered = reservations.filter((reservation) => {
      const reservationDate = parseISO(reservation.date);
      return isWithinInterval(reservationDate, {
        start: startDate,
        end: endDate,
      });
    });
    setFilteredReservations(filtered);
  }, [startDate, endDate, reservations]);

  const handleConfirmReservation = async (reservationId) => {
    try {
      await apiClient.post(`/admin/reservations/${reservationId}/confirm`);
      setReservations((prev) =>
        prev.map((res) =>
          res.id === reservationId
            ? { ...res, availableSpots: res.availableSpots - 1 }
            : res
        )
      );
    } catch (error) {
      console.error("Error confirming reservation:", error);
    }
  };

  const handleCancelReservation = async (reservationId) => {
    try {
      await apiClient.post(`/admin/reservations/${reservationId}/cancel`);
      setReservations((prev) =>
        prev.map((res) =>
          res.id === reservationId
            ? { ...res, availableSpots: res.availableSpots + 1 }
            : res
        )
      );
    } catch (error) {
      console.error("Error canceling reservation:", error);
    }
  };

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
                  value={startDate.toISOString().split("T")[0]}
                  onChange={(e) => setStartDate(new Date(e.target.value))}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                />
                <input
                  type="date"
                  value={endDate.toISOString().split("T")[0]}
                  onChange={(e) => setEndDate(new Date(e.target.value))}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
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
                    Cupos Disponibles
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReservations.map((reservation) => (
                  <tr key={reservation.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reservation.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reservation.studentName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reservation.startTime} - {reservation.endTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reservation.availableSpots}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <button
                        onClick={() => handleConfirmReservation(reservation.id)}
                        className="text-blue-500 hover:underline"
                      >
                        Confirmar
                      </button>
                      <button
                        onClick={() => handleCancelReservation(reservation.id)}
                        className="text-red-500 hover:underline ml-2"
                      >
                        Cancelar
                      </button>
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
