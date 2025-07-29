import { useState } from "react";
import { 
  HiAcademicCap, 
  HiClock, 
  HiStar, 
  HiCheck, 
  HiPhone, 
  HiEnvelope,
  HiMapPin,
  HiUsers
} from "react-icons/hi2";

function CicloFormacion() {
  const [expandedModule, setExpandedModule] = useState(null);

  const modulos = [
    {
      id: 1,
      titulo: "Módulo 1 - Fundamentos",
      duracion: "4 semanas",
      descripcion: "Introducción a la cerámica, tipos de arcilla y herramientas básicas",
      contenidos: [
        "Historia y tipos de cerámica",
        "Conocimiento de arcillas",
        "Herramientas básicas",
        "Técnicas de amasado",
        "Primeras piezas simples"
      ]
    },
    {
      id: 2,
      titulo: "Módulo 2 - Técnicas de Modelado",
      duracion: "6 semanas",
      descripcion: "Desarrollo de técnicas de construcción manual y uso del torno",
      contenidos: [
        "Técnicas de pellizco",
        "Construcción por rollos",
        "Placas y moldes",
        "Introducción al torno",
        "Centrado y cilindros básicos"
      ]
    },
    {
      id: 3,
      titulo: "Módulo 3 - Acabados y Decoración",
      duracion: "5 semanas",
      descripcion: "Técnicas de acabado, texturas y decoración de piezas",
      contenidos: [
        "Técnicas de texturizado",
        "Engobes y óxidos",
        "Decoración con herramientas",
        "Bruñido y pulido",
        "Preparación para secado"
      ]
    },
    {
      id: 4,
      titulo: "Módulo 4 - Esmaltado y Cocción",
      duracion: "6 semanas",
      descripcion: "Proceso completo de esmaltado y técnicas de cocción",
      contenidos: [
        "Tipos de esmaltes",
        "Técnicas de aplicación",
        "Carga de hornos",
        "Procesos de cocción",
        "Acabados finales"
      ]
    }
  ];

  const beneficios = [
    {
      icono: <HiAcademicCap className="w-8 h-8" />,
      titulo: "Formación Integral",
      descripcion: "Aprende desde los fundamentos hasta técnicas avanzadas"
    },
    {
      icono: <HiUsers className="w-8 h-8" />,
      titulo: "Grupos Reducidos",
      descripcion: "Máximo 8 estudiantes por clase para atención personalizada"
    },
    {
      icono: <HiStar className="w-8 h-8" />,
      titulo: "Certificación",
      descripcion: "Obtén tu certificado al completar el ciclo completo"
    },
    {
      icono: <HiClock className="w-8 h-8" />,
      titulo: "Horarios Flexibles",
      descripcion: "Clases matutinas, vespertinas y fines de semana"
    }
  ];

  const contactInfo = {
    telefono: "+598 99 123 456",
    email: "formacion@tatutaller.com",
    direccion: "Av. Rivera 1234, Montevideo",
    horarios: "Lunes a Viernes 9:00 - 18:00"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-yellow-500 to-orange-500 text-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <HiAcademicCap className="w-20 h-20 mx-auto mb-6 text-gray-800" />
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Ciclo de Formación
          </h1>
          <div className="w-24 h-1 bg-gray-800 mx-auto mb-6"></div>
          <p className="text-xl md:text-2xl max-w-4xl mx-auto mb-8 text-gray-800">
            Conviértete en un ceramista profesional con nuestro programa integral de formación. 
            21 semanas de aprendizaje intensivo que te llevarán desde principiante hasta ceramista independiente.
          </p>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 max-w-2xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-gray-800">21</div>
                <div className="text-sm text-gray-700">Semanas</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-800">4</div>
                <div className="text-sm text-gray-700">Módulos</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-800">8</div>
                <div className="text-sm text-gray-700">Max. Estudiantes</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-800">100%</div>
                <div className="text-sm text-gray-700">Práctica</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Módulos del Programa */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Programa de Estudios
            </h2>
            <div className="w-24 h-1 bg-yellow-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nuestro ciclo de formación está estructurado en 4 módulos progresivos que te brindarán 
              todas las herramientas necesarias para dominar el arte de la cerámica.
            </p>
          </div>

          <div className="space-y-6">
            {modulos.map((modulo) => (
              <div key={modulo.id} className="bg-gray-50 rounded-lg overflow-hidden shadow-md">
                <div 
                  className="p-6 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => setExpandedModule(expandedModule === modulo.id ? null : modulo.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-gray-900 font-bold">
                        {modulo.id}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{modulo.titulo}</h3>
                        <p className="text-gray-600">{modulo.descripcion}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                        {modulo.duracion}
                      </span>
                      <div className={`transform transition-transform ${expandedModule === modulo.id ? 'rotate-180' : ''}`}>
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                
                {expandedModule === modulo.id && (
                  <div className="px-6 pb-6 pt-2">
                    <div className="bg-white rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Contenidos del módulo:</h4>
                      <ul className="space-y-2">
                        {modulo.contenidos.map((contenido, index) => (
                          <li key={index} className="flex items-center space-x-2">
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
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{beneficio.titulo}</h3>
                <p className="text-gray-600">{beneficio.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Información y Requisitos */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Información General</h2>
              <div className="space-y-6">
                <div className="bg-yellow-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Modalidades Disponibles</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Intensivo (Lun-Vie)</span>
                      <span className="font-semibold text-yellow-600">5 meses</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Regular (Mar-Jue)</span>
                      <span className="font-semibold text-yellow-600">6 meses</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Fines de Semana</span>
                      <span className="font-semibold text-yellow-600">8 meses</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Incluye</h3>
                  <ul className="space-y-2">
                    {[
                      "Materiales para todas las clases",
                      "Herramientas básicas de trabajo",
                      "Cocciones de todas las piezas",
                      "Manual de técnicas cerámicas",
                      "Certificado de finalización"
                    ].map((item, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <HiCheck className="w-5 h-5 text-yellow-500" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Requisitos e Inscripción</h2>
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Requisitos</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Mayor de 16 años</li>
                    <li>• No se requiere experiencia previa</li>
                    <li>• Compromiso de asistencia (mín. 80%)</li>
                    <li>• Ganas de aprender y crear</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Proceso de Inscripción</h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-sm font-bold text-gray-900 mt-0.5">1</div>
                      <span className="text-gray-700">Contacta para agendar entrevista</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-sm font-bold text-gray-900 mt-0.5">2</div>
                      <span className="text-gray-700">Entrevista y tour por el taller</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-sm font-bold text-gray-900 mt-0.5">3</div>
                      <span className="text-gray-700">Formalización de inscripción</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-sm font-bold text-gray-900 mt-0.5">4</div>
                      <span className="text-gray-700">¡Comienza tu formación!</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section className="py-20 bg-gradient-to-r from-yellow-500 to-orange-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            ¿Listo para comenzar tu formación?
          </h2>
          <p className="text-xl text-gray-800 mb-12">
            Contáctanos para más información sobre nuestro Ciclo de Formación en Cerámica
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
              <HiPhone className="w-8 h-8 text-gray-800 mx-auto mb-3" />
              <p className="text-gray-800 font-semibold">Teléfono</p>
              <p className="text-gray-700">{contactInfo.telefono}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
              <HiEnvelope className="w-8 h-8 text-gray-800 mx-auto mb-3" />
              <p className="text-gray-800 font-semibold">Email</p>
              <p className="text-gray-700">{contactInfo.email}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
              <HiMapPin className="w-8 h-8 text-gray-800 mx-auto mb-3" />
              <p className="text-gray-800 font-semibold">Dirección</p>
              <p className="text-gray-700">{contactInfo.direccion}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
              <HiClock className="w-8 h-8 text-gray-800 mx-auto mb-3" />
              <p className="text-gray-800 font-semibold">Horarios</p>
              <p className="text-gray-700">{contactInfo.horarios}</p>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <a
              href={`tel:${contactInfo.telefono}`}
              className="inline-flex items-center px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold"
            >
              <HiPhone className="w-5 h-5 mr-2" />
              Llamar Ahora
            </a>
            <a
              href={`mailto:${contactInfo.email}`}
              className="inline-flex items-center px-8 py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
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
