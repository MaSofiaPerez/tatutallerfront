import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  HiCalendarDays,
  HiClock,
  HiUser,
  HiPhone,
  HiEnvelope,
} from "react-icons/hi2";
import {
  createBooking,
  clearBookingError,
  clearBookingSuccess,
} from "../redux/slices/bookingSlice";
import { fetchMyBookings, fetchBookings } from "../redux/slices/bookingSlice"; // importa esto
import toast from "react-hot-toast";

function BookingSystem() {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    classEntity: { id: "" },
    bookingDate: "",
    startTime: "",
    bookingType: "PUNTUAL",
    recurrenceEndDate: "",
    notes: "",
  });
  const [showSummary, setShowSummary] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [classesGrid, setClassesGrid] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState(null);

  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const {
    isLoading: bookingLoading,
    error: bookingError,
    notificationStatus,
    notificationError,
    success,
  } = useSelector((state) => state.booking);

  // Fetch clases-grid del backend
  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:8080/api/public/classes-grid")
      .then((res) => res.json())
      .then((data) => {
        setClassesGrid(data);
        setLoading(false);
      })
      .catch(() => setClassesGrid([]));
  }, []);

  const weekDays = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

  // Instructores únicos
  const allTalleristas = Array.from(
    new Set(classesGrid.map((cls) => cls.instructor))
  ).filter(Boolean);

  // Estructura por día e instructor
  const scheduleByDay = {};
  weekDays.forEach((day) => {
    scheduleByDay[day] = {};
    allTalleristas.forEach((tallerista) => {
      scheduleByDay[day][tallerista] = [];
    });
  });
  classesGrid.forEach((cls) => {
    if (cls.weekDay && cls.instructor) {
      scheduleByDay[cls.weekDay][cls.instructor].push(cls);
    }
  });

  // Helper para mostrar horario
  function formatTimeRange(start, end) {
    if (!start || !end) return "";
    return `${start} - ${end}`;
  }

  // Click en clase: selecciona y avanza
  const handleClassClick = (cls) => {
    setSelectedClass(cls);
    setBookingData((prev) => ({
      ...prev,
      classEntity: { id: cls.id },
      startTime: "",
      bookingDate: "",
    }));
    setStep(2);
  };

  // Helpers para fechas válidas
  function getValidDatesForClassWeekDay(cls, bookingType = "PUNTUAL") {
    if (!cls || !cls.weekDay) return [];
    const weekDayMap = {
      Domingo: 0,
      Lunes: 1,
      Martes: 2,
      Miércoles: 3,
      Jueves: 4,
      Viernes: 5,
      Sábado: 6,
    };
    const targetDay = weekDayMap[cls.weekDay];
    const today = new Date();
    const result = [];
    let monthsToShow = bookingType === "PUNTUAL" ? 2 : 1;
    for (let m = 0; m < monthsToShow; m++) {
      const year = today.getFullYear();
      const month = today.getMonth() + m;
      for (let day = 1; day <= 31; day++) {
        const d = new Date(year, month, day);
        if (d.getMonth() !== month % 12) break;
        if (d.getDay() === targetDay && d >= today) {
          result.push(d.toISOString().split("T")[0]);
        }
      }
    }
    return result;
  }

  // Horarios válidos para la clase seleccionada
  function getValidStartTimes(cls) {
    if (!cls || !cls.startTime || !cls.endTime) return [];
    const [sh, sm] = cls.startTime.split(":").map(Number);
    const [eh, em] = cls.endTime.split(":").map(Number);
    const startMin = sh * 60 + sm;
    const endMin = eh * 60 + em;
    const valid = [];
    for (let min = startMin; min <= endMin - 120; min += 30) {
      const h = Math.floor(min / 60)
        .toString()
        .padStart(2, "0");
      const m = (min % 60).toString().padStart(2, "0");
      valid.push(`${h}:${m}`);
    }
    return valid;
  }

  function getEndTimeFromStart(start) {
    if (!start) return "";
    const [h, m] = start.split(":").map(Number);
    const date = new Date(2000, 0, 1, h, m);
    date.setHours(date.getHours() + 2);
    return date.toTimeString().slice(0, 5);
  }

  function getLastDayOfMonth() {
    const refDate = bookingData.bookingDate
      ? new Date(bookingData.bookingDate)
      : new Date();
    const year = refDate.getFullYear();
    const month = refDate.getMonth();
    const lastDay = new Date(year, month + 1, 0);
    return lastDay.toISOString().split("T")[0];
  }

  // Slots disponibles (puedes adaptar esto si tu backend los provee)
  useEffect(() => {
    if (bookingData.classEntity.id && bookingData.bookingDate) {
      // Aquí podrías hacer fetch a /available-slots si tu backend lo soporta
      // Por ahora, generamos slots locales
      if (selectedClass) {
        const validTimes = getValidStartTimes(selectedClass);
        setAvailableSlots(
          validTimes.map((startTime) => ({
            startTime,
            endTime: getEndTimeFromStart(startTime),
            available: true,
            displayText: `${startTime} - ${getEndTimeFromStart(startTime)}`,
          }))
        );
      }
    } else {
      setAvailableSlots([]);
    }
  }, [bookingData.classEntity.id, bookingData.bookingDate, selectedClass]);

  // Limpia el error cuando cambian los datos relevantes
  useEffect(() => {
    if (bookingError) {
      dispatch(clearBookingError());
    }
  }, [
    bookingData.classEntity.id,
    bookingData.bookingDate,
    bookingData.startTime,
    bookingData.bookingType,
    dispatch,
  ]);

  // Navegación
  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };
  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  // Validaciones y resumen antes de enviar
  const handleSummary = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert("Debes iniciar sesión para realizar una reserva");
      return;
    }
    if (
      !bookingData.classEntity.id ||
      !bookingData.bookingDate ||
      !bookingData.startTime
    ) {
      alert("Completa todos los campos obligatorios.");
      return;
    }
    setShowSummary(true);
    //window.scrollTo({ top: 0, behavior: "smooth" }); esto me llevaba muy para arriba
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    try {
      const payload = {
        ...bookingData,
        classId: bookingData.classEntity.id,
        endTime: availableSlots.find(
          (slot) => slot.startTime === bookingData.startTime
        )?.endTime,
      };
      const resultAction = await dispatch(createBooking(payload));
      if (createBooking.fulfilled.match(resultAction)) {
        dispatch(fetchMyBookings());
        setBookingData({
          classEntity: { id: "" },
          bookingDate: "",
          startTime: "",
          bookingType: "PUNTUAL",
          recurrenceEndDate: "",
          notes: "",
        });
        setStep(1);
        setShowSummary(false);
        // Quita esta línea:
        // toast.success("¡Reserva realizada con éxito!");
      }
    } catch (error) {
      // alert("Error al enviar la reserva. Por favor, intenta nuevamente.");
    }
  };

  const toastShown = useRef(false);

  // Notificación de éxito
  useEffect(() => {
    if (success && !toastShown.current) {
      toastShown.current = true;
      toast.success("¡Reserva realizada con éxito!");
      dispatch(clearBookingSuccess());
      dispatch(fetchBookings()); // 🚩 Actualiza la lista global de reservas
      setTimeout(() => {
        toastShown.current = false;
      }, 500); // Permite mostrar el toast de nuevo en la próxima reserva
    }
  }, [success, dispatch]);

  // Render de los pasos
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Selecciona una clase de la semana
            </h3>
            {loading ? (
              <div className="text-center py-8">Cargando clases...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border text-center">
                  <thead>
                    <tr>
                      <th className="p-2 border bg-gray-100">Día</th>
                      <th className="p-2 border bg-gray-100">Clases</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weekDays.map((day) => (
                      <tr key={day}>
                        <td className="p-2 border font-semibold bg-gray-50">
                          {day}
                        </td>
                        <td className="p-2 border text-left">
                          {allTalleristas
                            .map((tallerista) => scheduleByDay[day][tallerista])
                            .flat()
                            .filter(Boolean).length === 0 ? (
                            <span className="text-gray-300">-</span>
                          ) : (
                            allTalleristas.map((tallerista) =>
                              scheduleByDay[day][tallerista].map((cls) => (
                                <div
                                  key={cls.id}
                                  className="mb-2 bg-yellow-200 rounded px-2 py-1 cursor-pointer hover:bg-yellow-300"
                                  onClick={() => handleClassClick(cls)}
                                >
                                  <span className="font-bold text-xs text-gray-700 mr-2">
                                    {cls.instructor}:
                                  </span>
                                  {cls.name}
                                  <div className="text-xs text-gray-500">
                                    {formatTimeRange(cls.startTime, cls.endTime)}
                                  </div>
                                </div>
                              ))
                            )
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <p className="text-gray-500 text-sm mt-2">
              Haz click en una clase para reservar.
            </p>
          </div>
        );
      case 2:
        // Lógica para fechas y horas válidas
        const validDates = selectedClass
          ? getValidDatesForClassWeekDay(selectedClass, bookingData.bookingType)
          : [];
        const noValidDates = selectedClass && validDates.length === 0;
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Fecha, hora y tipo de reserva
            </h3>
            {/* Tipo de reserva */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de reserva *
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  className={`px-4 py-2 rounded-md border font-medium transition-colors ${
                    bookingData.bookingType === "PUNTUAL"
                      ? "bg-yellow-500 text-gray-900 border-yellow-500"
                      : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                  }`}
                  onClick={() => setBookingData((prev) => ({ ...prev, bookingType: "PUNTUAL" }))}
                >
                  Puntual
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 rounded-md border font-medium transition-colors ${
                    bookingData.bookingType === "RECURRENTE"
                      ? "bg-yellow-500 text-gray-900 border-yellow-500"
                      : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                  }`}
                  onClick={() => setBookingData((prev) => ({ ...prev, bookingType: "RECURRENTE" }))}
                >
                  Recurrente
                </button>
              </div>
            </div>
            {/* Fecha */}
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Fecha preferida *
              </label>
              {noValidDates ? (
                <div className="text-red-500 text-sm mb-2">
                  No hay fechas disponibles para esta clase. Por favor
                  comunícate con el taller.
                </div>
              ) : selectedClass ? (
                <select
                  id="date"
                  value={bookingData.bookingDate}
                  onChange={(e) =>
                    setBookingData((prev) => ({
                      ...prev,
                      bookingDate: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  required
                  disabled={bookingData.bookingType === "RECURRENTE"}
                >
                  <option value="">Selecciona una fecha</option>
                  {validDates.map((date) => (
                    <option key={date} value={date}>
                      {date}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="date"
                  id="date"
                  value={bookingData.bookingDate}
                  onChange={(e) =>
                    setBookingData((prev) => ({
                      ...prev,
                      bookingDate: e.target.value,
                    }))
                  }
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  required
                  disabled={!!selectedClass}
                />
              )}
            </div>
            {/* Hora inicio y fin */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Horario *
                </label>
                {selectedClass ? (
                  <select
                    id="startTime"
                    value={bookingData.startTime}
                    onChange={(e) =>
                      setBookingData((prev) => ({
                        ...prev,
                        startTime: e.target.value,
                        endTime: getEndTimeFromStart(e.target.value),
                      }))
                    }
                    required
                  >
                    <option value="">Selecciona un horario</option>
                    {availableSlots.map((slot) => (
                      <option
                        key={slot.startTime}
                        value={slot.startTime}
                        disabled={!slot.available}
                      >
                        {slot.displayText}{" "}
                        {slot.available ? "" : "(No disponible)"}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="time"
                    value={bookingData.startTime}
                    onChange={(e) =>
                      setBookingData((prev) => ({
                        ...prev,
                        startTime: e.target.value,
                        endTime: getEndTimeFromStart(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    required
                    disabled={!!selectedClass}
                  />
                )}
              </div>
            </div>
            {/* Fecha de fin de recurrencia */}
            {bookingData.bookingType === "RECURRENTE" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de fin de recurrencia *
                </label>
                <input
                  type="date"
                  value={getLastDayOfMonth()}
                  readOnly
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
                />
                <div className="text-xs text-gray-500 mt-1">
                  La recurrencia finaliza automáticamente el último día del mes.
                </div>
              </div>
            )}
            {step === 2 && selectedClass && (
              <div className="text-sm text-gray-500 mb-2">
                Reservarás para la clase: <b>{selectedClass.name}</b> el{" "}
                <b>{bookingData.bookingDate}</b> de{" "}
                <b>
                  {formatTimeRange(
                    bookingData.startTime,
                    bookingData.endTime
                  )}
                </b>
              </div>
            )}
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Confirmación de reserva
            </h3>
            {!isAuthenticated ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
                <p className="text-yellow-800">
                  Debes <strong>iniciar sesión</strong> para realizar una
                  reserva.
                </p>
              </div>
            ) : (
              <>
                <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
                  <p className="text-green-800">
                    Reservando como: <strong>{user?.name}</strong> (
                    {user?.email})
                  </p>
                </div>
                <div>
                  <label
                    htmlFor="notes"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Observaciones (opcional)
                  </label>
                  <textarea
                    id="notes"
                    rows={4}
                    value={bookingData.notes}
                    onChange={(e) =>
                      setBookingData((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                    placeholder="Menciona cualquier comentario adicional, preferencias o consultas..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  />
                </div>
                {/* Resumen */}
                <div className="bg-gray-50 rounded-lg p-4 mt-4">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Resumen de tu reserva
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Clase:</span>
                      <span className="font-medium">
                        {selectedClass?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fecha:</span>
                      <span className="font-medium">
                        {bookingData.bookingDate}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Horario:</span>
                      <span className="font-medium">
                        {bookingData.startTime} - {bookingData.endTime}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tipo:</span>
                      <span className="font-medium">
                        {bookingData.bookingType === "RECURRENTE"
                          ? "Recurrente"
                          : "Puntual"}
                      </span>
                    </div>
                    {bookingData.bookingType === "RECURRENTE" &&
                      bookingData.recurrenceEndDate && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Hasta:</span>
                          <span className="font-medium">
                            {bookingData.recurrenceEndDate}
                          </span>
                        </div>
                      )}
                    {bookingData.notes && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Observaciones:</span>
                        <span className="font-medium">{bookingData.notes}</span>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  // Validación de pasos
  const isStepValid = () => {
    switch (step) {
      case 1:
        return bookingData.classEntity.id !== "";
      case 2:
        return (
          bookingData.bookingDate !== "" &&
          bookingData.startTime !== "" &&
          (bookingData.bookingType === "PUNTUAL" ||
            (bookingData.bookingType === "RECURRENTE" &&
              bookingData.recurrenceEndDate !== ""))
        );
      case 3:
        return isAuthenticated;
      default:
        return false;
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Reserva tu Clase
          </h2>
          <div className="w-24 h-1 bg-yellow-500 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Agenda tu cita de forma fácil y rápida. Te contactaremos para
            confirmar disponibilidad.
          </p>
        </div>

        {/* Error Message */}
        {bookingError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6">
            Por favor, selecciona un horario diferente. No hay cupos disponibles en ese horario
          </div>
        )}

        {/* Notification Status */}
        {notificationStatus === "sending" && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-md mb-6">
            📧 Enviando notificación al profesor...
          </div>
        )}

        {notificationStatus === "sent" && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md mb-6">
            ✅ Profesor notificado por email exitosamente
          </div>
        )}

        {notificationStatus === "failed" && (
          <div className="bg-orange-100 border border-orange-400 text-orange-700 px-4 py-3 rounded-md mb-6">
            ⚠️ Reserva creada, pero no se pudo notificar al profesor por email.
            Te contactaremos directamente.
            {notificationError && (
              <div className="text-sm mt-1">Error: {notificationError}</div>
            )}
          </div>
        )}

        {/* Loading State */}
        {bookingLoading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
            <span className="ml-3 text-gray-600">Procesando...</span>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNumber
                      ? "bg-yellow-500 text-gray-900"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      step > stepNumber ? "bg-yellow-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4 space-x-8 text-sm text-gray-600">
            <span className={step >= 1 ? "font-medium text-yellow-600" : ""}>
              Servicio
            </span>
            <span className={step >= 2 ? "font-medium text-yellow-600" : ""}>
              Fecha y Hora
            </span>
            <span className={step >= 3 ? "font-medium text-yellow-600" : ""}>
              Contacto
            </span>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={showSummary ? handleSubmit : handleSummary}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={prevStep}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                step === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              disabled={step === 1}
            >
              Anterior
            </button>
            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  isStepValid()
                    ? "bg-yellow-500 hover:bg-yellow-600 text-gray-900"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
                disabled={!isStepValid()}
              >
                Siguiente
              </button>
            ) : (
              <button
                type="submit"
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  isStepValid()
                    ? "bg-yellow-500 hover:bg-yellow-600 text-gray-900"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
                disabled={!isStepValid()}
              >
                {showSummary ? "Enviar Reserva" : "Ver Resumen"}
              </button>
            )}
          </div>
        </form>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
            <h4 className="font-semibold text-gray-900 mb-2">
              Información importante
            </h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                • El profesor será notificado automáticamente por email sobre tu
                reserva
              </p>
              <p>
                • Te contactarán en 24 horas para confirmar tu primera clase
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BookingSystem;
