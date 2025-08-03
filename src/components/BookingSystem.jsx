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
  fetchMyBookings,
  fetchBookings,
} from "../redux/slices/bookingSlice";
import toast from "react-hot-toast";
import { fetchPublicClasses } from "../redux/slices/classesSlice";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import esAR from "date-fns/locale/es";

function BookingSystem() {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    classEntity: { id: "" },
    bookingDate: "",
    startTime: "",
    endTime: "",
    bookingType: "PUNTUAL",
    recurrenceEndDate: "",
    notes: "",
  });
  const [showSummary, setShowSummary] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const hasFetchedRef = useRef(false);

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
    fetch("/api/public/classes-grid")
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar clases");
        return res.json();
      })
      .then((data) => {
        setClassesGrid(data);
        setLoading(false);
        console.log(
          "Clases traídas del endpoint /api/public/classes-grid:",
          data
        );
      })
      .catch((error) => {
        console.error("Error al cargar clases:", error);
        setClassesGrid([]);
        setLoading(false);
        toast.error(
          "Error al cargar las clases. Verifica la conexión con el backend."
        );
      });
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

  // Efecto para mostrar errores de reserva
  useEffect(() => {
    if (bookingError) {
      toast.error(`Error de reserva: ${bookingError}`);
      dispatch(clearBookingError());
    }
  }, [bookingError, dispatch]);

  // Mapear clases a una estructura por día y tallerista
  const scheduleByDay = {};
  weekDays.forEach((day) => {
    scheduleByDay[day] = {};
    allTalleristas.forEach((tallerista) => {
      scheduleByDay[day][tallerista] = [];
    });
  });

  classesGrid.forEach((cls) => {
    const dayName = cls.weekDay || cls.dayOfWeek;
    if (dayName && cls.instructor) {
      if (scheduleByDay[dayName] && scheduleByDay[dayName][cls.instructor]) {
        scheduleByDay[dayName][cls.instructor].push(cls);
      }
    }
  });

  // Helper para mostrar horario
  function formatTimeRange(start, end) {
    if (!start || !end) return "";
    return `${start} - ${end}`;
  }

  // Click en clase: selecciona y avanza
  const handleClassClick = (cls) => {
    console.log("Clase seleccionada:", cls);
    setSelectedClass(cls);
    setBookingData((prev) => ({
      ...prev,
      classEntity: { id: cls.id },
      startTime: "",
      endTime: "",
      bookingDate: "",
    }));
    setStep(2);
  };

  // Helpers para fechas válidas
  function getValidDatesForClassWeekDay(cls, bookingType = "PUNTUAL") {
    if (!cls) return [];

    // Obtener el día de la semana (usar weekDay o dayOfWeek)
    const dayName = cls.weekDay || cls.dayOfWeek;
    if (!dayName) return [];

    const weekDayMap = {
      Domingo: 0,
      Lunes: 1,
      Martes: 2,
      Miércoles: 3,
      Jueves: 4,
      Viernes: 5,
      Sábado: 6,
    };
    const targetDay = weekDayMap[dayName];

    if (targetDay === undefined) return [];

    const today = new Date();
    const result = [];
    let monthsToShow = bookingType === "PUNTUAL" ? 2 : 1;

    for (let m = 0; m < monthsToShow; m++) {
      const year = today.getFullYear();
      const month = today.getMonth() + m;
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      for (let day = 1; day <= daysInMonth; day++) {
        const d = new Date(year, month, day);
        if (d.getDay() === targetDay && d >= today) {
          result.push(d.toISOString().split("T")[0]);
        }
      }
    }
    return result;
  }

  // Función para calcular fecha de inicio automática para recurrentes
  function getRecurrentStartDate(cls) {
    if (!cls) return null;

    const dayName = cls.weekDay || cls.dayOfWeek;
    if (!dayName) return null;

    const weekDayMap = {
      Domingo: 0,
      Lunes: 1,
      Martes: 2,
      Miércoles: 3,
      Jueves: 4,
      Viernes: 5,
      Sábado: 6,
    };
    const targetDay = weekDayMap[dayName];

    if (targetDay === undefined) return null;

    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Determinar si estamos después de la segunda semana (día 14)
    const isAfterSecondWeek = currentDay > 14;

    // Si estamos después de la segunda semana, buscar en el mes siguiente
    const targetMonth = isAfterSecondWeek ? currentMonth + 1 : currentMonth;
    const targetYear = targetMonth > 11 ? currentYear + 1 : currentYear;
    const adjustedMonth = targetMonth > 11 ? 0 : targetMonth;

    // Encontrar el primer día de ese tipo en el mes objetivo
    for (let day = 1; day <= 31; day++) {
      const d = new Date(targetYear, adjustedMonth, day);
      if (d.getMonth() !== adjustedMonth) break; // Mes cambió, salir
      if (d.getDay() === targetDay) {
        return {
          date: d.toISOString().split("T")[0],
          isNextMonth: isAfterSecondWeek,
        };
      }
    }

    return null;
  }

  function getRecurrentEndDate(startDate) {
    if (!startDate) return "";

    const start = new Date(startDate);
    const year = start.getFullYear();
    const month = start.getMonth();
    const lastDay = new Date(year, month + 1, 0);
    return lastDay.toISOString().split("T")[0];
  }

  // Horarios válidos para la clase seleccionada
  function getValidStartTimes(cls) {
    if (!cls || !cls.startTime || !cls.endTime) {
      console.log("getValidStartTimes: Clase inválida o sin horarios", cls);
      return [];
    }

    console.log("getValidStartTimes: Procesando clase", cls);
    console.log("Horario de clase:", cls.startTime, "a", cls.endTime);

    const [sh, sm] = cls.startTime.split(":").map(Number);
    const [eh, em] = cls.endTime.split(":").map(Number);
    const startMin = sh * 60 + sm;
    const endMin = eh * 60 + em;

    console.log("Minutos de inicio:", startMin, "Minutos de fin:", endMin);

    const valid = [];
    // Generar slots cada 30 minutos, cada slot dura 2 horas
    for (let min = startMin; min <= endMin - 120; min += 30) {
      const h = Math.floor(min / 60)
        .toString()
        .padStart(2, "0");
      const m = (min % 60).toString().padStart(2, "0");
      valid.push(`${h}:${m}:00`); // Agregar segundos para el backend
    }

    console.log("Horarios válidos generados:", valid);
    return valid;
  }

  function getEndTimeFromStart(start) {
    if (!start) return "";
    const timeParts = start.split(":");
    const h = parseInt(timeParts[0]);
    const m = parseInt(timeParts[1]);
    const date = new Date(2000, 0, 1, h, m);
    date.setHours(date.getHours() + 2);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}:00`; // Devolver con segundos para el backend
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

  // Efecto para actualizar fechas automáticas en reservas recurrentes
  useEffect(() => {
    if (bookingData.bookingType === "RECURRENTE" && selectedClass) {
      const recurrentInfo = getRecurrentStartDate(selectedClass);
      if (recurrentInfo) {
        const endDate = getRecurrentEndDate(recurrentInfo.date);
        setBookingData((prev) => ({
          ...prev,
          bookingDate: recurrentInfo.date,
          recurrenceEndDate: endDate,
        }));
      }
    }
  }, [bookingData.bookingType, selectedClass]);

  // Slots disponibles
  useEffect(() => {
    if (bookingData.classEntity.id && bookingData.bookingDate) {
      if (selectedClass) {
        console.log("Calculando slots disponibles para:", selectedClass);
        console.log("Fecha seleccionada:", bookingData.bookingDate);

        const validTimes = getValidStartTimes(selectedClass);
        console.log("Horarios válidos:", validTimes);

        setAvailableSlots(
          validTimes.map((startTime) => ({
            startTime,
            endTime: getEndTimeFromStart(startTime),
            available: true,
            displayText: `${startTime.substring(0, 5)} - ${getEndTimeFromStart(
              startTime
            ).substring(0, 5)}`, // Mostrar sin segundos al usuario
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Debes iniciar sesión para realizar una reserva");
      return;
    }

    try {
      const bookingPayload = {
        classId: parseInt(bookingData.classEntity.id),
        bookingDate: bookingData.bookingDate,
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        bookingType: bookingData.bookingType,
        notes: bookingData.notes || "",
        ...(bookingData.bookingType === "RECURRENTE" && {
          recurrenceEndDate: bookingData.recurrenceEndDate,
        }),
      };

      console.log("🔍 Datos completos antes de enviar:");
      console.log("- bookingData:", bookingData);
      console.log("- selectedClass:", selectedClass);
      console.log("- bookingPayload final:", bookingPayload);

      // Validar que todos los campos requeridos estén presentes
      if (!bookingPayload.classId) {
        toast.error("Error: ID de clase no válido");
        return;
      }
      if (!bookingPayload.bookingDate) {
        toast.error("Error: Fecha de reserva requerida");
        return;
      }
      if (!bookingPayload.startTime) {
        toast.error("Error: Hora de inicio requerida");
        return;
      }
      if (!bookingPayload.endTime) {
        toast.error("Error: Hora de fin requerida");
        return;
      }

      await dispatch(createBooking(bookingPayload)).unwrap();
      toast.success(
        "¡Reserva enviada exitosamente! Te llegará un email de confirmación con los detalles.",
        {
          duration: 5000,
        }
      );

      // Reset form
      setStep(1);
      setBookingData({
        classEntity: { id: "" },
        bookingDate: "",
        startTime: "",
        endTime: "",
        bookingType: "PUNTUAL",
        recurrenceEndDate: "",
        notes: "",
      });
      setSelectedClass(null);
      setShowSummary(false);
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error(error.message || "Error al crear la reserva");
    }
  };

  // Reset success state
  useEffect(() => {
    if (success) {
      setTimeout(() => {
        dispatch(clearBookingSuccess());
      }, 3000);
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
                                    {formatTimeRange(
                                      cls.startTime,
                                      cls.endTime
                                    )}
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

        console.log("Paso 2 - Clase seleccionada:", selectedClass);
        console.log("Fechas válidas calculadas:", validDates);
        console.log("Slots disponibles:", availableSlots);
        console.log("Tipo de reserva:", bookingData.bookingType);

        if (bookingData.bookingType === "RECURRENTE" && selectedClass) {
          const recurrentInfo = getRecurrentStartDate(selectedClass);
          console.log("Info recurrente:", recurrentInfo);
        }

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
                  onClick={() =>
                    setBookingData((prev) => ({
                      ...prev,
                      bookingType: "PUNTUAL",
                    }))
                  }
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
                  onClick={() =>
                    setBookingData((prev) => ({
                      ...prev,
                      bookingType: "RECURRENTE",
                    }))
                  }
                >
                  Recurrente
                </button>
              </div>
            </div>
            {/* Fecha */}
            {bookingData.bookingType === "PUNTUAL" ? (
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
            ) : (
              // Para RECURRENTE - mostrar fecha calculada automáticamente
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de inicio (calculada automáticamente)
                </label>
                <input
                  type="date"
                  value={bookingData.bookingDate}
                  readOnly
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
                />
                {selectedClass &&
                  getRecurrentStartDate(selectedClass)?.isNextMonth && (
                    <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <p className="text-blue-800 text-sm">
                        <strong>📅 Inicio en el próximo mes:</strong> Como
                        estamos después de la segunda semana, tu clase
                        recurrente comenzará el próximo mes. Si deseas asistir a
                        clases en el mes actual, puedes reservarlas como{" "}
                        <strong>clases puntuales</strong> (se abonan por
                        separado).
                      </p>
                    </div>
                  )}
              </div>
            )}
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
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
                  Fecha de finalización *
                </label>
                <input
                  type="date"
                  value={bookingData.recurrenceEndDate}
                  readOnly
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
                />
                <div className="text-xs text-gray-500 mt-1">
                  La clase se repetirá semanalmente hasta el último día del mes
                  correspondiente.
                </div>
              </div>
            )}
            {step === 2 && selectedClass && bookingData.bookingDate && (
              <div className="text-sm text-gray-500 mb-2">
                {bookingData.bookingType === "PUNTUAL" ? (
                  <>
                    Reservarás para la clase: <b>{selectedClass.name}</b> el{" "}
                    <b>{bookingData.bookingDate}</b>
                    {bookingData.startTime && (
                      <>
                        {" "}
                        de{" "}
                        <b>
                          {formatTimeRange(
                            bookingData.startTime,
                            bookingData.endTime
                          )}
                        </b>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    Reservarás la clase <b>{selectedClass.name}</b> de forma
                    recurrente
                    {bookingData.startTime && (
                      <>
                        {" "}
                        los {selectedClass.weekDay}s de{" "}
                        <b>
                          {formatTimeRange(
                            bookingData.startTime,
                            bookingData.endTime
                          )}
                        </b>
                      </>
                    )}
                    <br />
                    <span className="text-blue-600">
                      Desde el {bookingData.bookingDate} hasta el{" "}
                      {bookingData.recurrenceEndDate}
                    </span>
                  </>
                )}
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
                      <span className="font-medium">{selectedClass?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fecha:</span>
                      <span className="font-medium">
                        {bookingData.bookingDate}
                        {bookingData.bookingType === "RECURRENTE" &&
                          " (inicio automático)"}
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
        if (bookingData.bookingType === "PUNTUAL") {
          return bookingData.bookingDate !== "" && bookingData.startTime !== "";
        } else {
          // Para recurrente, solo necesita horario (fecha se calcula automáticamente)
          return bookingData.startTime !== "";
        }
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
            Por favor, selecciona un horario diferente. No hay cupos disponibles
            en ese horario
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
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Procesando tu reserva...</p>
          </div>
        )}

        {/* Success State */}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md mb-6">
            🎉 ¡Reserva creada exitosamente! Te contactaremos pronto para
            confirmar los detalles.
          </div>
        )}

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNumber
                      ? "bg-yellow-500 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      step > stepNumber ? "bg-yellow-500" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <span className="text-sm text-gray-500">
              Paso {step} de 3:{" "}
              {step === 1
                ? "Seleccionar Clase"
                : step === 2
                ? "Fecha y Hora"
                : "Confirmación"}
            </span>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={showSummary ? handleSubmit : handleSummary}
          className="bg-white rounded-lg shadow-lg p-8 mb-8"
        >
          {renderStepContent()}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Anterior
              </button>
            )}
            {step < 3 && (
              <button
                type="button"
                onClick={nextStep}
                disabled={!isStepValid()}
                className={`px-6 py-2 rounded-md font-medium transition-colors ml-auto ${
                  isStepValid()
                    ? "bg-yellow-500 hover:bg-yellow-600 text-gray-900"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Siguiente
              </button>
            )}
            {step === 3 && (
              <button
                type="submit"
                disabled={!isStepValid()}
                className={`px-6 py-2 rounded-md font-medium transition-colors ml-auto ${
                  isStepValid()
                    ? "bg-yellow-500 hover:bg-yellow-600 text-gray-900"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
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
