/**
 * VERSIÓN MODIFICADA SIN INTEGRACIÓN A REDUX
 *
 * Esta es la versión de Clases.jsx sin la integración a Redux. Ahora se
 * consumen los datos directamente desde el backend utilizando fetch.
 */

import { useEffect, useState } from "react";
import BookingSystem from "../components/BookingSystem";
import {
  HiAcademicCap,
  HiUsers,
  HiClock,
  HiStar,
} from "react-icons/hi2";

function Clases() {
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    fetch("http://localhost:8080/api/public/classes-grid")
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
      <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Clases de Cerámica
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              Aprende el arte de la cerámica con ceramistas experimentados.
              Desde principiantes hasta técnicas avanzadas de modelado y esmaltado.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() =>
                  document
                    .getElementById("clases-disponibles")
                    .scrollIntoView({ behavior: "smooth" })
                }
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Ver Clases Disponibles
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById("reserva-sistema")
                    .scrollIntoView({ behavior: "smooth" })
                }
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors"
              >
                Reservar Ahora
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tipos de Clases */}
      <section className="py-16 bg-white" id="clases-disponibles">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Nuestros Cursos
            </h2>
            <div className="w-24 h-1 bg-yellow-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ofrecemos diferentes niveles de formación para que puedas desarrollar tus habilidades paso a paso
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-500"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-600 py-8">
              Ocurrió un error al cargar las clases.
            </div>
          ) : classes && classes.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {classes.map((classItem) => (
                <div
                  key={classItem.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-100"
                >
                  <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                    <img
                      src={
                        classItem.image ||
                        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                      }
                      alt={classItem.name}
                      className="w-full h-48 object-cover"
                    />
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-900">
                        {classItem.name}
                      </h3>
                      <span className="text-2xl font-bold text-yellow-600">
                        ${classItem.price}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-4">{classItem.description}</p>

                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <HiClock className="w-4 h-4 mr-2" />
                      <span>Duración: {classItem.duration} min</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <HiUsers className="w-4 h-4 mr-2" />
                      <span>
                        Capacidad máxima: {classItem.capacity} estudiantes
                      </span>
                    </div>

                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <HiAcademicCap className="w-4 h-4 mr-2" />
                      <span>Nivel: {classItem.level}</span>
                    </div>

                    {classItem.includes && (
                      <div className="space-y-2 mb-6">
                        <h4 className="font-semibold text-gray-900">Incluye:</h4>
                        <ul className="text-sm text-gray-600">
                          {classItem.includes.map((item, index) => (
                            <li key={index} className="flex items-center">
                              <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <button
                      onClick={() => setSelectedClass(classItem)}
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 py-3 rounded-lg font-semibold transition-colors"
                    >
                      Reservar Clase
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              No hay clases disponibles en este momento.
            </div>
          )}
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
                      Instructores Certificados
                    </h3>
                    <p className="text-gray-600">
                      Aprende de ceramistas profesionales con años de experiencia y reconocimiento en la industria.
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
                      Máximo 12 estudiantes por clase para garantizar atención personalizada y seguimiento individual.
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
                      Todos los materiales necesarios están incluidos: arcilla, herramientas, esmaltes y acceso al horno.
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
