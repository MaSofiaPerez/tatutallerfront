import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserBookings } from "../redux/slices/bookingSlice";

function UserDetailsModal({ isOpen, onClose, userId, userData }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const dispatch = useDispatch();
  const { userBookings, isLoading } = useSelector((state) => state.booking);

  useEffect(() => {
    if (isOpen && userId) {
      console.log("🔍 Dispatching fetchUserBookings with userId:", userId);
      dispatch(fetchUserBookings(userId));
    }
  }, [isOpen, userId, dispatch]);

  useEffect(() => {
    setFilteredReservations(userBookings);
  }, [userBookings]);

  useEffect(() => {
    if (startDate && endDate) {
      const filtered = userBookings.filter((reservation) => {
        const dateStr = reservation.bookingDate || reservation.date;
        if (!dateStr) return false;
        const reservationDate = new Date(dateStr);
        reservationDate.setHours(0,0,0,0);
        const start = new Date(startDate);
        start.setHours(0,0,0,0);
        const end = new Date(endDate);
        end.setHours(23,59,59,999);
        return reservationDate >= start && reservationDate <= end;
      });
      setFilteredReservations(filtered);
    } else {
      setFilteredReservations(userBookings);
    }
  }, [startDate, endDate, userBookings]);

  const renderReservations = () => {
    if (isLoading) {
      return <p className="text-gray-600">Cargando reservas...</p>;
    }

    if (filteredReservations.length === 0) {
      return (
        <p className="text-gray-600">
          {startDate && endDate
            ? "No se han encontrado reservas entre las fechas seleccionadas."
            : "No se han encontrado reservas."}
        </p>
      );
    }

    return (
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Clase
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Profesor
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Horario
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredReservations.map((reservation) => (
            <tr key={reservation.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {reservation.className || "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {reservation.teacherName || "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {reservation.bookingDate || reservation.date
                  ? new Date(reservation.bookingDate || reservation.date).toLocaleDateString()
                  : "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {`${reservation.startTime} - ${reservation.endTime}` || "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Detalles del Usuario
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Datos del Usuario */}
        <div className="mb-4">
          <p>
            <strong>Nombre:</strong> {userData?.name || "N/A"}
          </p>
          <p>
            <strong>Apellido:</strong> {userData?.lastName || "N/A"}
          </p>
          <p>
            <strong>Email:</strong> {userData?.email || "N/A"}
          </p>
          <p>
            <strong>Teléfono:</strong> {userData?.phone || "N/A"}
          </p>
          <p>
            <strong>Dirección:</strong> {userData?.address || "N/A"}
          </p>
        </div>

        {/* Reservas del Usuario */}
        <h4 className="text-md font-semibold text-gray-800 mb-2">
          Clases Reservadas
        </h4>
        <div className="flex gap-4 mb-4 items-end">
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

        {renderReservations()}
      </div>
    </div>
  );
}

export default UserDetailsModal;
