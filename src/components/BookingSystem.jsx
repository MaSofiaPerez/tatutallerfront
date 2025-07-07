import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  HiCalendarDays,
  HiClock,
  HiUser,
  HiPhone,
  HiEnvelope,
} from "react-icons/hi2";
import { createBooking, clearError } from "../redux/slices/bookingSlice";
import { fetchPublicClasses } from "../redux/slices/classesSlice";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import esAR from "date-fns/locale/es";

function BookingSystem({ selectedService }) {
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

  const dispatch = useDispatch();
  const {
    isLoading: bookingLoading,
    error: bookingError,
    currentBooking,
    notificationStatus,
    notificationError,
  } = useSelector((state) => state.booking);
  const { classes, isLoading: classesLoading } = useSelector(
    (state) => state.classes
  );
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchPublicClasses());
  }, [dispatch]);

  // Declarar weekDays y allTalleristas solo una vez, al inicio del componente
  const weekDays = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
  const [classesGrid, setClassesGrid] = useState([]);
  const allTalleristas = Array.from(
    new Set(classesGrid.map((cls) => cls.instructor))
  ).filter(Boolean);

  useEffect(() => {
    // Consumir el nuevo endpoint para la grilla de clases
    const fetchClassesGrid = async () => {
      try {
        const res = await fetch("/api/public/classes-grid");
        if (!res.ok) throw new Error("No se pudieron obtener las clases");
        const data = await res.json();
        setClassesGrid(data);
        console.log(
          "Clases traídas del endpoint /api/public/classes-grid:",
          data
        );
      } catch (e) {
        setClassesGrid([]);
        console.error("Error al obtener clases para la grilla:", e);
      }
    };
    fetchClassesGrid();
  }, []);

  // Mapear clases a una estructura por día y tallerista
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

  const [selectedClass, setSelectedClass] = useState(null);

  // Helper para mostrar horario en formato amigable usando startTime y endTime
  function formatTimeRange(start, end) {
    if (!start || !end) return "";
    return `${start} - ${end}`;
  }

  const handleClassClick = (cls) => {
    setSelectedClass(cls);
    handleInputChange("classEntity", { id: cls.id });
    handleInputChange("bookingDate", cls.date || "");
    handleInputChange("startTime", cls.startTime || "");
    handleInputChange("endTime", cls.endTime || "");
    setStep(2);
  };

  const services =
    classes.length > 0
      ? classes.map((cls) => ({
          id: cls.id,
          name: cls.name,
          duration: cls.duration || "2 horas",
          price: cls.price || "50",
          description: cls.description || "",
        }))
      : [
          {
            id: "clase-principiantes",
            name: "Clase para Principiantes",
            duration: "2 horas",
            price: "50",
            description: "Introducción al modelado básico",
          },
          {
            id: "clase-torno",
            name: "Clase de Torno",
            duration: "2 horas",
            price: "60",
            description: "Aprende técnicas de torno",
          },
          {
            id: "clase-esmaltado",
            name: "Clase de Esmaltado",
            duration: "1.5 horas",
            price: "45",
            description: "Técnicas de esmaltado y decoración",
          },
          {
            id: "pieza-personalizada",
            name: "Pieza Personalizada",
            duration: "Variable",
            price: "80+",
            description: "Crea tu pieza única",
          },
          {
            id: "coccion",
            name: "Servicio de Cocción",
            duration: "Variable",
            price: "25",
            description: "Cocción de tus piezas",
          },
        ];

  const artists = [
    {
      id: "maria",
      name: "María",
      specialty: "Torno y Modelado",
      experience: "8 años",
    },
    { id: "ana", name: "Ana", specialty: "Esmaltado", experience: "6 años" },
    {
      id: "diego",
      name: "Diego",
      specialty: "Escultura",
      experience: "10 años",
    },
    {
      id: "sofia",
      name: "Sofía",
      specialty: "Decoración",
      experience: "5 años",
    },
  ];

  const availableTimes = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
  ];

  const handleInputChange = (field, value) => {
    setBookingData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

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
      !bookingData.startTime ||
      !bookingData.endTime
    ) {
      alert("Completa todos los campos obligatorios.");
      return;
    }
    if (bookingData.endTime <= bookingData.startTime) {
      alert("La hora de fin debe ser mayor a la de inicio.");
      return;
    }
    if (
      bookingData.bookingType === "RECURRENTE" &&
      !bookingData.recurrenceEndDate
    ) {
      alert("Debes seleccionar la fecha de fin de recurrencia.");
      return;
    }
    setShowSummary(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert("Debes iniciar sesión para realizar una reserva");
      return;
    }
    try {
      const bookingPayload = {
        classId: bookingData.classEntity.id,
        bookingDate: bookingData.bookingDate,
        startTime:
          bookingData.startTime.length === 5
            ? bookingData.startTime + ":00"
            : bookingData.startTime,
        endTime:
          bookingData.endTime.length === 5
            ? bookingData.endTime + ":00"
            : bookingData.endTime,
        bookingType: bookingData.bookingType,
        recurrenceEndDate:
          bookingData.bookingType === "RECURRENTE" &&
          bookingData.recurrenceEndDate
            ? bookingData.recurrenceEndDate
            : null,
        notes: bookingData.notes || "",
      };
      console.log(
        "Payload enviado al backend:",
        JSON.stringify(bookingPayload, null, 2)
      );
      await dispatch(createBooking(bookingPayload)).unwrap();
      setBookingData({
        classEntity: { id: "" },
        bookingDate: "",
        startTime: "",
        endTime: "",
        bookingType: "PUNTUAL",
        recurrenceEndDate: "",
        notes: "",
      });
      setStep(1);
      setShowSummary(false);
      alert("¡Reserva enviada exitosamente! Te contactaremos para confirmar.");
    } catch (error) {
      alert("Error al enviar la reserva. Por favor, intenta nuevamente.");
    }
  };

  const getMinDate = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const locales = {
    "es-AR": esAR,
  };
  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
    getDay,
    locales,
  });

  // Convert classes to calendar events
  const calendarEvents = classes.map((cls) => ({
    id: cls.id,
    title: cls.name + (cls.description ? ` - ${cls.description}` : ""),
    start: new Date(cls.date + "T" + cls.startTime),
    end: new Date(cls.date + "T" + cls.endTime),
    resource: cls,
  }));

  // Semana típica: Lunes a Sábado, 8:00 a 20:00 (bloques de 2 horas)
  const timeSlots = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"];

  // Mapear clases a una estructura por día y horario
  const schedule = {};
  weekDays.forEach((day) => {
    schedule[day] = {};
    timeSlots.forEach((slot) => {
      schedule[day][slot] = null;
    });
  });
  // Mostrar solo las clases que tengan weekDay y startTime definidos
  classes.forEach((cls) => {
    if (cls.weekDay && cls.startTime) {
      schedule[cls.weekDay][cls.startTime] = cls;
    }
  });

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Selecciona una clase de la semana
            </h3>
            {classes.length === 0 && (
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded mb-4">
                No hay clases agendadas para mostrar en este momento.
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="min-w-full border text-center">
                <thead>
                  <tr>
                    <th className="p-2 border bg-gray-100">Día</th>
                    {/* Eliminado: nombres de talleristas en la cabecera */}
                  </tr>
                </thead>
                <tbody>
                  {weekDays.map((day) => (
                    <tr key={day}>
                      <td className="p-2 border font-semibold bg-gray-50">
                        {day}
                      </td>
                      {/* Mostrar solo las clases de ese día, agrupadas por tallerista */}
                      <td className="p-2 border text-left">
                        {allTalleristas
                          .map((tallerista) => scheduleByDay[day][tallerista])
                          .flat()
                          .filter(Boolean).length === 0 ? (
                          <span className="text-gray-300">-</span>
                        ) : (
                          allTalleristas.map((tallerista) =>
                            scheduleByDay[day][tallerista].map((cls) => (
                              <button
                                key={cls.id}
                                className={`block w-full mb-1 rounded-lg px-2 py-1 shadow font-semibold transition text-gray-900 ${
                                  selectedClass?.id === cls.id
                                    ? "bg-yellow-400"
                                    : "bg-yellow-200 hover:bg-yellow-400"
                                }`}
                                onClick={() => handleClassClick(cls)}
                              >
                                <div>
                                  <span className="font-bold text-xs text-gray-700 mr-2">
                                    {cls.instructor}:
                                  </span>
                                  {cls.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {formatTimeRange(cls.startTime, cls.endTime)}
                                </div>
                              </button>
                            ))
                          )
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
        const validStartTimes = selectedClass
          ? getValidStartTimes(selectedClass)
          : [];
        // Si es recurrente, autoseleccionar la primer fecha válida
        if (
          bookingData.bookingType === "RECURRENTE" &&
          selectedClass &&
          validDates.length > 0 &&
          bookingData.bookingDate !== validDates[0]
        ) {
          handleInputChange("bookingDate", validDates[0]);
        }
        // Si no hay fechas válidas, mostrar mensaje
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
                  onClick={() => handleInputChange("bookingType", "PUNTUAL")}
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
                  onClick={() => handleInputChange("bookingType", "RECURRENTE")}
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
                    handleInputChange("bookingDate", e.target.value)
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
                    handleInputChange("bookingDate", e.target.value)
                  }
                  min={getMinDate()}
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
                  Hora de inicio *
                </label>
                {selectedClass ? (
                  <select
                    value={bookingData.startTime}
                    onChange={(e) => {
                      handleInputChange("startTime", e.target.value);
                      handleInputChange(
                        "endTime",
                        getEndTimeFromStart(e.target.value)
                      );
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    required
                  >
                    <option value="">Selecciona hora</option>
                    {validStartTimes.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="time"
                    value={bookingData.startTime}
                    onChange={(e) =>
                      handleInputChange("startTime", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    required
                    disabled={!!selectedClass}
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hora de fin *
                </label>
                <input
                  type="time"
                  value={bookingData.endTime}
                  readOnly
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
                />
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
                  {formatTimeRange(bookingData.startTime, bookingData.endTime)}
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
                    onChange={(e) => handleInputChange("notes", e.target.value)}
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
                        {
                          services.find(
                            (s) => s.id === bookingData.classEntity.id
                          )?.name
                        }
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

  const isStepValid = () => {
    switch (step) {
      case 1:
        return bookingData.classEntity.id !== "";
      case 2:
        return (
          bookingData.bookingDate !== "" &&
          bookingData.startTime !== "" &&
          bookingData.endTime !== "" &&
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

  // Helpers para fechas y horarios válidos
  function getValidDatesForWeekDay(weekDay, isRecurrent) {
    // weekDay: "Lunes", "Martes", ...
    // Devuelve fechas del mes actual (o próximas 30 días) que caen en ese weekDay
    const weekDayMap = {
      Lunes: 1,
      Martes: 2,
      Miércoles: 3,
      Jueves: 4,
      Viernes: 5,
      Sábado: 6,
      Domingo: 0,
    };
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const result = [];
    // Si es recurrente, solo permitir fechas en las primeras 2 semanas del mes
    const maxDay = isRecurrent ? 14 : 31;
    for (let day = 1; day <= 31; day++) {
      const d = new Date(year, month, day);
      if (d.getMonth() !== month) break;
      if (d.getDay() === weekDayMap[weekDay] && day <= maxDay && d >= today) {
        result.push(d.toISOString().split("T")[0]);
      }
    }
    return result;
  }

  // Helpers para fechas y horarios válidos
  function getValidDatesForClass(cls) {
    // Si la clase tiene un campo date, devolverlo como único valor
    if (!cls) return [];
    if (Array.isArray(cls.date)) return cls.date; // por si en el futuro hay varias fechas
    if (cls.date) return [cls.date];
    return [];
  }

  function getValidStartTimes(cls) {
    // Permitir cualquier horario de inicio entre startTime y endTime - 2h
    if (!cls || !cls.startTime || !cls.endTime) return [];
    const start = cls.startTime;
    const end = cls.endTime;
    // Convertir a minutos
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);
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
    // Suma 2 horas a la hora de inicio
    if (!start) return "";
    const [h, m] = start.split(":").map(Number);
    const date = new Date(2000, 0, 1, h, m);
    date.setHours(date.getHours() + 2);
    return date.toTimeString().slice(0, 5);
  }

  function getLastDayOfMonth() {
    // Si hay bookingDate, usar ese mes, si no, el actual
    const refDate = bookingData.bookingDate
      ? new Date(bookingData.bookingDate)
      : new Date();
    const year = refDate.getFullYear();
    const month = refDate.getMonth();
    const lastDay = new Date(year, month + 1, 0);
    return lastDay.toISOString().split("T")[0];
  }

  function getValidDatesForClassWeekDay(cls, bookingType = "PUNTUAL") {
    // Devuelve fechas del mes actual y siguiente (si es puntual), solo del mes actual si es recurrente
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

  function getFirstValidDateOfMonth(cls) {
    const validDates = getValidDatesForClassWeekDay(cls);
    return validDates.length > 0 ? validDates[0] : null;
  }

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
            {bookingError}
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
        {(bookingLoading || classesLoading) && (
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
          {" "}
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
