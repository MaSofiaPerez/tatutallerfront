import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import BookingSystem from "../components/BookingSystem";
import {
  HiAcademicCap,
  HiUsers,
  HiClock,
  HiStar,
  HiCalendarDays,
  HiSparkles,
} from "react-icons/hi2";
import { API_BASE_URL } from "../utils/apiBase";

function Clases() {
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    fetch(`${API_BASE_URL}/api/public/classes-grid`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar las clases");
        return res.json();
      })
      .then((data) => {
        setClasses(data);
        setIsLoading(false);
      })
      .catch(() => {
        setError("Ocurrió un error al cargar las clases.");
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <div>Cargando clases...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <HiSparkles className="w-20 h-20 mx-auto mb-6 text-yellow-200" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Clases de Cerámica
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              Aprende el arte de la cerámica con nosotros. Desde principiantes
              hasta técnicas avanzadas de modelado y esmaltado.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() =>
                  document
                    .getElementById("reserva-sistema")
                    .scrollIntoView({ behavior: "smooth" })
                }
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-yellow-600 transition-colors"
              >
                Reservar Ahora
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Información General de Clases */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Modalidades de Clases
            </h2>
            <div className="w-24 h-1 bg-amber-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ofrecemos diferentes modalidades para que puedas elegir la que
              mejor se adapte a tu ritmo y necesidades
            </p>
          </div>

          {/* Precios y Modalidades */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {/* Clase Puntual */}
            <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiCalendarDays className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Clase Puntual
              </h3>
              <div className="text-3xl font-bold text-amber-600 mb-2">
                $1,400
              </div>
              <p className="text-gray-600 text-sm">Por clase única</p>
              <p className="text-gray-500 text-xs mt-2">
                Perfecto para asistir ocasionalmente
              </p>
            </div>

            {/* Mensual */}
            <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiClock className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Mensual</h3>
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                $4,000
              </div>
              <p className="text-gray-600 text-sm">Por un mes</p>
              <p className="text-gray-500 text-xs mt-2">
                Ideal para evaluar tus preferencias
              </p>
            </div>

            {/* Anual con Suscripción */}
            <div className="bg-yellow-50 rounded-xl p-6 text-center border border-yellow-300 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-yellow-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiStar className="w-8 h-8 text-yellow-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Anual</h3>
              <div className="text-3xl font-bold text-yellow-700 mb-2">
                $3,800
              </div>
              <p className="text-gray-700 text-sm">
                Por mes + $500 suscripción
              </p>
              <p className="text-gray-600 text-xs mt-2">
                Suscripción gratuita en marzo
              </p>
            </div>

            {/* Clase de Prueba */}
            <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiAcademicCap className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Clase de Prueba
              </h3>
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                $1,400
              </div>
              <p className="text-gray-600 text-sm">Primera vez</p>
              <p className="text-gray-500 text-xs mt-2">
                Si continúas, solo abonás la diferencia
              </p>
            </div>
          </div>

          {/* Información Importante */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Incluido en el Precio */}
            <div className="bg-gray-50 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <HiStar className="w-5 h-5 text-green-600" />
                </div>
                Incluido en el Precio
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-700">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                  Todos los materiales necesarios
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                  Horneadas de tus piezas
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                  Herramientas de trabajo
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                  Recuperación de clases (hasta 1 mes)
                </li>
              </ul>
            </div>

            {/* Modalidades de Pago */}
            <div className="bg-gray-50 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <HiClock className="w-5 h-5 text-blue-600" />
                </div>
                Formas de Pago
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-700">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                  Dentro de los primeros 10 días del mes
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                  Efectivo o transferencia directa
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                  Si comenzás a mitad de mes: las clases se abonan como
                  puntuales hasta el siguiente mes donde podés optar por mensual
                  o anual
                </li>
              </ul>
            </div>
          </div>

          {/* Información Adicional */}
          <div className="bg-yellow-50 rounded-xl p-8 mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Información Importante
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">
                  💡 Suscripción Gratuita
                </h4>
                <p className="text-gray-700 text-sm mb-4">
                  Todos los años hasta marzo inclusive, la suscripción de $500
                  es gratuita. Los alumnos que continúan del año anterior están
                  exonerados.
                </p>

                <h4 className="font-semibold text-gray-900 mb-3">
                  📅 Recuperación de Clases
                </h4>
                <p className="text-gray-700 text-sm">
                  Podés coordinar con tu tallerista para reponer clases fuera
                  del horario habitual. Tiempo máximo: 1 mes.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">
                  🎨 Eventos Especiales
                </h4>
                <p className="text-gray-700 text-sm mb-2">
                  • Muestra Temática Anual
                </p>
                <p className="text-gray-700 text-sm mb-4">
                  • Día del Patrimonio con clases abiertas
                </p>

                <h4 className="font-semibold text-gray-900 mb-3">
                  ⚠️ Ausencias Prolongadas
                </h4>
                <p className="text-gray-700 text-sm">
                  Después de 30 días de ausencia se pierde el cupo y hay que
                  abonar nuevamente la suscripción.
                </p>
              </div>
            </div>
          </div>

          {/* Cowork Cerámico */}
          <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              ¿Sabías que tenemos Cowork Cerámico?
            </h3>
            <p className="text-gray-700 mb-6">
              Además de los cursos, contamos con un área de cowork equipada para
              aquellos que deseen realizar piezas por su cuenta en un lugar
              adecuado para trabajar.
            </p>
            <Link
              to="/cowork-ceramico"
              className="inline-flex items-center px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
            >
              Conocer Cowork Cerámico
            </Link>
          </div>
        </div>
      </section>

      {/* Sistema de Reservas */}
      <section id="reserva-sistema">
        <BookingSystem selectedService={selectedClass} />
      </section>

      {/* Información Adicional */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                ¿Por qué elegir nuestras clases?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <HiAcademicCap className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Talleristas Experimentados
                    </h3>
                    <p className="text-gray-600">
                      Aprende con ceramistas apasionados que te guiarán paso a
                      paso en tu proceso creativo.
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
                      Máximo 6 estudiantes por clase para garantizar atención
                      personalizada y seguimiento individual.
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
    </div>
  );
}

export default Clases;
