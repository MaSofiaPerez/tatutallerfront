import { useState } from "react";
import BookingSystem from "../components/BookingSystem";
import {
  HiAcademicCap,
  HiUsers,
  HiClock,
  HiStar,
  HiCalendarDays,
} from "react-icons/hi2";

// DATOS ESTÁTICOS TEMPORALES - Para evitar el bucle infinito
const STATIC_CLASSES = [
  {
    id: 1,
    name: "Iniciación al Torno",
    description: "Aprende las técnicas básicas del torno cerámico",
    price: 2500,
    duration: 120,
    capacity: 8,
    level: "Principiante",
    instructor: "María García",
  },
  {
    id: 2,
    name: "Esmaltes y Decoración",
    description: "Técnicas avanzadas de esmaltado y decoración",
    price: 3000,
    duration: 180,
    capacity: 6,
    level: "Intermedio",
    instructor: "Carlos López",
  },
  {
    id: 3,
    name: "Cerámica Raku",
    description: "Técnica japonesa tradicional de cocción",
    price: 3500,
    duration: 240,
    capacity: 4,
    level: "Avanzado",
    instructor: "Ana Martínez",
  },
];

function Clases() {
  const [selectedClass, setSelectedClass] = useState(null);

  // Usar datos estáticos temporalmente
  const classes = STATIC_CLASSES;
  const isLoading = false;
  const error = null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Error al cargar clases
          </h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner de aviso temporal */}
      <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              ⚠️ Modo temporal: Datos estáticos para evitar problemas con el
              backend.
            </p>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-yellow-50 to-orange-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Nuestras Clases de Cerámica
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Aprende el arte milenario de la cerámica con nuestros instructores
              expertos. Desde principiantes hasta técnicas avanzadas.
            </p>
          </div>
        </div>
      </section>

      {/* Classes Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {classes.map((classItem) => (
              <div
                key={classItem.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt={classItem.name}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      {classItem.level}
                    </span>
                    <span className="text-2xl font-bold text-yellow-600">
                      ${classItem.price}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {classItem.name}
                  </h3>

                  <p className="text-gray-600 mb-4">{classItem.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <HiClock className="w-4 h-4 mr-2" />
                      {classItem.duration} minutos
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <HiUsers className="w-4 h-4 mr-2" />
                      Máximo {classItem.capacity} personas
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <HiAcademicCap className="w-4 h-4 mr-2" />
                      Instructor: {classItem.instructor}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedClass(classItem)}
                    className="w-full bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 transition-colors"
                  >
                    Reservar Clase
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Information Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <HiCalendarDays className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Horarios Flexibles
                  </h3>
                  <p className="text-gray-600">
                    Ofrecemos clases en diferentes horarios para adaptarnos a tu
                    agenda. Consulta disponibilidad al reservar.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <HiUsers className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Grupos Reducidos
                  </h3>
                  <p className="text-gray-600">
                    Mantenemos grupos pequeños para asegurar atención
                    personalizada y un mejor aprendizaje.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <HiStar className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Material Incluido
                  </h3>
                  <p className="text-gray-600">
                    Todos los materiales necesarios están incluidos: arcilla,
                    herramientas, esmaltes y acceso al horno.
                  </p>
                </div>
              </div>
            </div>

            <div className="aspect-w-4 aspect-h-3">
              <img
                src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Clase de cerámica"
                className="w-full h-96 object-cover rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {selectedClass && (
        <BookingSystem
          isOpen={!!selectedClass}
          onClose={() => setSelectedClass(null)}
          classData={selectedClass}
        />
      )}
    </div>
  );
}

export default Clases;
