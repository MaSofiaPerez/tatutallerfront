import { useState } from "react";
import {
  HiAcademicCap,
  HiClock,
  HiStar,
  HiCheck,
  HiPhone,
  HiEnvelope,
  HiMapPin,
  HiUsers,
} from "react-icons/hi2";

function CicloFormacion() {
  const [expandedModule, setExpandedModule] = useState(null);

  const modulos = [
    {
      id: 1,
      titulo: "Primer año: Introducción a los procesos cerámicos",
      duracion: "1 año",
      descripcion:
        "Nos centramos en el ejercicio y aplicación de diferentes técnicas de construcción y modelado, comprendiendo la importancia de cada etapa del proceso desde la preparación de los materiales.",
      contenidos: [
        "Diferentes técnicas de construcción y modelado",
        "Preparación de materiales cerámicos",
        "Modelado manual y técnicas básicas",
        "Torno alfarero - introducción y práctica",
        "Escultura cerámica",
        "Moldería y técnicas de reproducción",
        "Comprensión integral del proceso cerámico",
      ],
    },
    {
      id: 2,
      titulo: "Segundo año: Investigación de materiales",
      duracion: "1 año",
      descripcion:
        "Profundizaremos en el conocimiento de las materias primas para la elaboración de pastas, engobes, pátinas y esmaltes. Incorporaremos metodologías teóricas y prácticas que nos ampliarán la posibilidad de obtener resultados originales.",
      contenidos: [
        "Conocimiento de materias primas cerámicas",
        "Elaboración de pastas cerámicas",
        "Preparación y aplicación de engobes",
        "Técnicas de pátinas cerámicas",
        "Formulación y aplicación de esmaltes",
        "Metodologías teóricas y prácticas",
        "Experimentación para resultados originales",
      ],
    },
    {
      id: 3,
      titulo: "Tercer año: Especialización en la técnica",
      duracion: "1 año",
      descripcion:
        "El alumno elegirá su orientación en la técnica que sea de su interés: Modelado en Torno, Escultura, o Moldería. La totalidad de la carga horaria en este año, se dedicará al ejercicio y perfeccionamiento de la técnica elegida.",
      contenidos: [
        "Elección de especialización personal",
        "Opción 1: Modelado en Torno avanzado",
        "Opción 2: Escultura cerámica especializada",
        "Opción 3: Moldería y reproducción técnica",
        "Ejercicio intensivo de la técnica elegida",
        "Perfeccionamiento y dominio técnico",
        "Desarrollo de proyecto personal final",
      ],
    },
  ];

  const beneficios = [
    {
      icono: <HiAcademicCap className="w-8 h-8" />,
      titulo: "Formación Integral",
      descripcion:
        "Tres años de aprendizaje progresivo desde fundamentos hasta especialización",
    },
    {
      icono: <HiUsers className="w-8 h-8" />,
      titulo: "Espacio Colectivo",
      descripcion:
        "Ambiente colaborativo para el estudio y desarrollo del conocimiento cerámico",
    },
    {
      icono: <HiStar className="w-8 h-8" />,
      titulo: "Especialización",
      descripcion:
        "Elección de orientación: Torno, Escultura o Moldería en el tercer año",
    },
    {
      icono: <HiClock className="w-8 h-8" />,
      titulo: "Ceramista Independiente",
      descripcion:
        "Formación completa para desarrollarte como ceramista profesional",
    },
  ];

  const contactInfo = {
    telefono: "+598 99 123 456",
    email: "formacion@tatutaller.com",
    direccion: "Av. Rivera 1234, Montevideo",
    horarios: "Lunes a Viernes 9:00 - 18:00",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <HiAcademicCap className="w-20 h-20 mx-auto mb-6 text-yellow-200" />
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Ciclo de Formación
          </h1>
          <div className="w-24 h-1 bg-yellow-300 mx-auto mb-6"></div>
          <p className="text-xl md:text-2xl max-w-4xl mx-auto mb-8 opacity-90">
            El ciclo de formación es una propuesta educativa orientada a la
            formación de ceramistas independientes. Buscamos brindar un espacio
            colectivo para el estudio y desarrollo del conocimiento cerámico.
          </p>
        </div>
      </section>

      {/* Módulos del Programa */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Estructura del Ciclo Formativo
            </h2>
            <div className="w-24 h-1 bg-yellow-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              El ciclo está conformado por tres años curriculares con énfasis en
              diferentes aspectos que comprendemos fundamentales para la
              formación de ceramistas independientes.
            </p>
          </div>

          <div className="space-y-6">
            {modulos.map((modulo) => (
              <div
                key={modulo.id}
                className="bg-gray-50 rounded-lg overflow-hidden shadow-md"
              >
                <div
                  className="p-6 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() =>
                    setExpandedModule(
                      expandedModule === modulo.id ? null : modulo.id
                    )
                  }
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-gray-900 font-bold">
                        {modulo.id}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {modulo.titulo}
                        </h3>
                        <p className="text-gray-600">{modulo.descripcion}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                        {modulo.duracion}
                      </span>
                      <div
                        className={`transform transition-transform ${
                          expandedModule === modulo.id ? "rotate-180" : ""
                        }`}
                      >
                        <svg
                          className="w-6 h-6 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {expandedModule === modulo.id && (
                  <div className="px-6 pb-6 pt-2">
                    <div className="bg-white rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Contenidos del módulo:
                      </h4>
                      <ul className="space-y-2">
                        {modulo.contenidos.map((contenido, index) => (
                          <li
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <HiCheck className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                            <span className="text-gray-700">{contenido}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-20 bg-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              ¿Por qué elegir nuestro Ciclo de Formación?
            </h2>
            <div className="w-24 h-1 bg-yellow-500 mx-auto mb-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {beneficios.map((beneficio, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-900">
                  {beneficio.icono}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {beneficio.titulo}
                </h3>
                <p className="text-gray-600">{beneficio.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Información del Programa */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Información del Programa
            </h2>
            <div className="w-24 h-1 bg-yellow-500 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-yellow-50 rounded-lg p-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                El Programa Incluye
              </h3>
              <ul className="space-y-3">
                {[
                  "Materiales para todas las clases",
                  "Herramientas básicas de trabajo",
                  "Cocciones de todas las piezas",
                  "Manual de técnicas cerámicas",
                  "Certificado de finalización",
                ].map((item, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <HiCheck className="w-6 h-6 text-yellow-500 flex-shrink-0" />
                    <span className="text-gray-700 text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                Requisitos
              </h3>
              <ul className="space-y-3">
                {[
                  "No se requiere experiencia previa",
                  "Compromiso de asistencia",
                  "Ganas de aprender y crear",
                  "Disposición para el trabajo en equipo",
                ].map((item, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <HiCheck className="w-6 h-6 text-yellow-500 flex-shrink-0" />
                    <span className="text-gray-700 text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-yellow-600 mb-6">
            ¿Te interesa conocer más sobre el programa?
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Contáctanos para recibir información detallada sobre nuestro Ciclo
            de Formación, horarios, modalidades y proceso de inscripción.
          </p>

          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <a
              href="https://wa.me/59899123456?text=Hola%21%20Me%20interesa%20conocer%20m%C3%A1s%20sobre%20el%20Ciclo%20de%20Formaci%C3%B3n%20en%20Cer%C3%A1mica"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-3 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-600 transition-colors font-semibold"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-2.462-.96-4.779-2.705-6.526-1.745-1.746-4.065-2.711-6.526-2.713-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.092-.634zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              Consultar por WhatsApp
            </a>
            <a
              href="mailto:formacion@tatutaller.com?subject=Consulta%20sobre%20Ciclo%20de%20Formaci%C3%B3n&body=Hola%21%20Me%20interesa%20recibir%20m%C3%A1s%20informaci%C3%B3n%20sobre%20el%20Ciclo%20de%20Formaci%C3%B3n%20en%20Cer%C3%A1mica."
              className="inline-flex items-center px-8 py-3 bg-white text-yellow-600 border-2 border-yellow-600 rounded-lg hover:bg-yellow-50 transition-colors font-semibold"
            >
              <HiEnvelope className="w-5 h-5 mr-2" />
              Enviar Email
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CicloFormacion;
