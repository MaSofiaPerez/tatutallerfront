import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function UserDetailsModal({ isOpen, onClose, userData }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  if (!isOpen || !userData) return null;

  const filteredReservations = (userData.reservations || []).filter((reservation) => {
    const reservationDate = new Date(reservation.date);
    if (startDate && reservationDate < startDate) return false;
    if (endDate && reservationDate > endDate) return false;
    return true;
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Detalles del Usuario</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="mb-4">
          <p>
            <strong>Nombre:</strong> {userData.name || "N/A"}
          </p>
          <p>
            <strong>Apellido:</strong> {userData.lastName || "N/A"}
          </p>
          <p>
            <strong>Email:</strong> {userData.email || "N/A"}
          </p>
          <p>
            <strong>Teléfono:</strong> {userData.phone || "N/A"}
          </p>
          <p>
            <strong>Dirección:</strong> {userData.address || "N/A"}
          </p>
        </div>

        <h4 className="text-md font-semibold text-gray-800 mb-2">
          Clases Reservadas
        </h4>
        <div className="flex gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Desde
            </label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hasta
            </label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
        </div>

        {filteredReservations.length > 0 ? (
          <ul className="list-disc pl-5">
            {filteredReservations.map((reservation) => (
              <li key={reservation.id} className="mb-2">
                <p>
                  <strong>Clase:</strong> {reservation.className || "N/A"}
                </p>
                <p>
                  <strong>Fecha:</strong> {reservation.date ? new Date(reservation.date).toLocaleDateString() : "N/A"}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">
            No se encontraron clases reservadas en el rango de fechas seleccionado.
          </p>
        )}
      </div>
    </div>
  );
}

export default UserDetailsModal;
