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

function BookingSystem({ selectedService }) {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    classEntity: { id: "" },
    bookingDate: "",
    bookingTime: "",
    notes: "",
  });

  const dispatch = useDispatch();
  const {
    isLoading: bookingLoading,
    error: bookingError,
    currentBooking,
  } = useSelector((state) => state.booking);
  const { classes, isLoading: classesLoading } = useSelector(
    (state) => state.classes
  );
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchPublicClasses());
  }, [dispatch]);

  useEffect(() => {
    if (selectedService) {
      setBookingData((prev) => ({
        ...prev,
        classEntity: { id: selectedService.id },
      }));
    }
  }, [selectedService]);

  const timeSlots = [
    "09:00:00",
    "10:30:00",
    "14:00:00",
    "15:30:00",
    "17:00:00",
    "18:30:00",
  ];

  // Usar clases del backend o datos por defecto
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      alert("Debes iniciar sesión para realizar una reserva");
      return;
    }

    try {
      const bookingPayload = {
        classEntity: { id: bookingData.classEntity.id },
        bookingDate: bookingData.bookingDate,
        bookingTime: bookingData.bookingTime,
        notes: bookingData.notes || "",
      };

      const result = await dispatch(createBooking(bookingPayload)).unwrap();
      console.log("Reserva creada exitosamente:", result);

      // Reset form
      setBookingData({
        classEntity: { id: "" },
        bookingDate: "",
        bookingTime: "",
        notes: "",
      });
      setStep(1);

      alert("¡Reserva enviada exitosamente! Te contactaremos para confirmar.");
    } catch (error) {
      console.error("Error al crear reserva:", error);
      alert("Error al enviar la reserva. Por favor, intenta nuevamente.");
    }
  };

  const getMinDate = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Selecciona tu servicio
            </h3>
            <div className="grid gap-4">
              {services.map((service) => (
                <div
                  key={service.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    bookingData.classEntity.id === service.id
                      ? "border-yellow-500 bg-yellow-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() =>
                    handleInputChange("classEntity", { id: service.id })
                  }
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {service.name}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {service.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-yellow-600">
                        ${service.price}
                      </div>
                      <div className="text-xs text-gray-500">
                        {service.duration}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Fecha, hora y artista
            </h3>

            {/* Artista */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Selecciona un instructor (opcional)
              </label>
              <div className="grid sm:grid-cols-2 gap-3">
                <div
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    bookingData.instructorId === ""
                      ? "border-yellow-500 bg-yellow-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => handleInputChange("instructorId", "")}
                >
                  <div className="font-medium text-gray-900">
                    Sin preferencia
                  </div>
                  <div className="text-xs text-gray-600">
                    Te asignaremos el mejor instructor
                  </div>
                </div>
                {artists.map((artist) => (
                  <div
                    key={artist.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      bookingData.instructorId === artist.id
                        ? "border-yellow-500 bg-yellow-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleInputChange("instructorId", artist.id)}
                  >
                    <div className="font-medium text-gray-900">
                      {artist.name}
                    </div>
                    <div className="text-xs text-gray-600">
                      {artist.specialty} • {artist.experience}
                    </div>
                  </div>
                ))}
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
              />
            </div>

            {/* Hora */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hora preferida *
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2">
                {availableTimes.map((time) => (
                  <button
                    key={time}
                    type="button"
                    className={`px-3 py-2 text-sm rounded-md transition-all ${
                      bookingData.bookingTime === time
                        ? "bg-yellow-500 text-gray-900"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => handleInputChange("bookingTime", time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
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
                <div className="bg-gray-50 rounded-lg p-4">
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
                      <span className="text-gray-600">Hora:</span>
                      <span className="font-medium">
                        {bookingData.bookingTime}
                      </span>
                    </div>
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
        return bookingData.bookingDate !== "" && bookingData.bookingTime !== "";
      case 3:
        return isAuthenticated; // Solo necesita estar autenticado
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
            {bookingError}
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
          onSubmit={handleSubmit}
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
                Enviar Reserva
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
              <p>• Te contactaremos en 24 horas para confirmar tu cita</p>
              <p>• Las consultas de diseño son gratuitas y sin compromiso</p>
              <p>
                • Puedes cancelar o reprogramar con 24 horas de anticipación
              </p>
              <p>
                • Trae referencias e ideas para aprovechar mejor la consulta
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BookingSystem;
