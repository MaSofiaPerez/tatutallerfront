import { useState } from "react";
import { 
  HiUsers, 
  HiClock, 
  HiCog6Tooth, 
  HiCheck, 
  HiPhone, 
  HiEnvelope,
  HiMapPin,
  HiSparkles,
  HiLightBulb,
  HiCube
} from "react-icons/hi2";

function CoworkCeramico() {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const espacios = [
    {
      id: 1,
      nombre: "Zona de Modelado",
      descripcion: "Espacio amplio con mesas de trabajo profesionales y herramientas compartidas",
      caracteristicas: [
        "10 mesas de trabajo",
        "Herramientas profesionales",
        "Estanterías para secado",
        "Buena iluminación natural"
      ]
    },
    {
      id: 2,
      nombre: "Área de Torno",
      descripcion: "Tornos eléctricos de alta calidad para trabajo especializado",
      caracteristicas: [
        "6 tornos eléctricos",
        "Asientos ergonómicos",
        "Sistema de reciclado de arcilla",
        "Espacio para herramientas personales"
      ]
    },
    {
      id: 3,
      nombre: "Zona de Esmaltado",
      descripcion: "Área especializada con ventilación y equipamiento para acabados",
      caracteristicas: [
        "Mesa con extractor de aire",
        "Amplia gama de esmaltes",
        "Espacio para secado vertical",
        "Instrumentos de aplicación"
      ]
    },
    {
      id: 4,
      nombre: "Área de Almacenaje",
      descripcion: "Espacios personales para guardar proyectos y materiales",
      caracteristicas: [
        "Estanterías personales",
        "Casilleros con llave",
        "Zona de secado controlado",
        "Identificación clara"
      ]
    }
  ];

  const planes = [
    {
      id: "basico",
      nombre: "Plan Básico",
      precio: "$2,500",
      periodo: "mensual",
      horas: "20 horas",
      descripcion: "Perfecto para ceramistas que comienzan en el cowork",
      beneficios: [
        "20 horas mensuales de taller",
        "Acceso a zona de modelado",
        "Herramientas básicas incluidas",
        "1 cocción mensual incluida",
        "Comunidad de ceramistas"
      ],
      popular: false
    },
    {
      id: "estandar",
      nombre: "Plan Estándar",
      precio: "$4,200",
      periodo: "mensual",
      horas: "40 horas",
      descripcion: "La opción más popular para ceramistas regulares",
      beneficios: [
        "40 horas mensuales de taller",
        "Acceso completo a todas las áreas",
        "Herramientas profesionales",
        "3 cocciones mensuales incluidas",
        "Descuentos en materiales",
        "Espacio de almacenaje",
        "Acceso a eventos exclusivos"
      ],
      popular: true
    },
    {
      id: "premium",
      nombre: "Plan Premium",
      precio: "$6,800",
      periodo: "mensual",
      horas: "Ilimitadas",
      descripcion: "Para ceramistas profesionales y proyectos grandes",
      beneficios: [
        "Acceso ilimitado 24/7",
        "Espacio de almacenaje amplio",
        "Cocciones ilimitadas",
        "Descuentos especiales en materiales",
        "Prioridad en uso de equipos",
        "Sesiones de mentoría mensuales",
        "Red de contactos profesionales"
      ],
      popular: false
    }
  ];

  const serviciosAdicionales = [
    {
      icono: <HiCog6Tooth className="w-8 h-8" />,
      titulo: "Mantenimiento de Equipos",
      descripcion: "Mantenemos todos los equipos en perfectas condiciones"
    },
    {
      icono: <HiLightBulb className="w-8 h-8" />,
      titulo: "Workshops y Talleres",
      descripcion: "Eventos regulares con ceramistas invitados"
    },
    {
      icono: <HiUsers className="w-8 h-8" />,
      titulo: "Comunidad Activa",
      descripcion: "Conecta con otros ceramistas y comparte experiencias"
    },
    {
      icono: <HiSparkles className="w-8 h-8" />,
      titulo: "Exhibiciones",
      descripcion: "Oportunidades de mostrar tu trabajo en nuestro espacio"
    }
  ];

  const contactInfo = {
    telefono: "+598 99 123 456",
    email: "cowork@tatutaller.com",
    direccion: "Av. Rivera 1234, Montevideo",
    horarios: "Lunes a Domingo 8:00 - 22:00"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-500 to-red-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <HiUsers className="w-20 h-20 mx-auto mb-6 text-red-100" />
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Cowork Cerámico
          </h1>
          <div className="w-24 h-1 bg-red-200 mx-auto mb-6"></div>
          <p className="text-xl md:text-2xl max-w-4xl mx-auto mb-8 text-red-100">
            Tu espacio creativo profesional. Comparte taller, herramientas y conocimientos 
            con otros ceramistas en un ambiente colaborativo y estimulante.
          </p>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 max-w-2xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-white">24/7</div>
                <div className="text-sm text-red-200">Acceso</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">6</div>
                <div className="text-sm text-red-200">Tornos</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">15</div>
                <div className="text-sm text-red-200">Ceramistas</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">∞</div>
                <div className="text-sm text-red-200">Creatividad</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Espacios Disponibles */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Nuestros Espacios
            </h2>
            <div className="w-24 h-1 bg-red-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Espacios diseñados para la creatividad y la productividad. Cada área está 
              equipada con herramientas profesionales y pensada para el trabajo colaborativo.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {espacios.map((espacio) => (
              <div key={espacio.id} className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    {espacio.id}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{espacio.nombre}</h3>
                    <p className="text-gray-600 mb-4">{espacio.descripcion}</p>
                    <ul className="space-y-2">
                      {espacio.caracteristicas.map((caracteristica, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <HiCheck className="w-5 h-5 text-red-500 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{caracteristica}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Planes de Membresía */}
      <section className="py-20 bg-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Planes de Membresía
            </h2>
            <div className="w-24 h-1 bg-red-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Encuentra el plan que mejor se adapte a tu ritmo de trabajo y necesidades creativas.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {planes.map((plan) => (
              <div 
                key={plan.id} 
                className={`relative bg-white rounded-lg shadow-lg overflow-hidden ${
                  plan.popular ? 'ring-2 ring-red-500 transform scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-red-500 text-white text-center py-2 text-sm font-semibold">
                    MÁS POPULAR
                  </div>
                )}
                <div className={`p-8 ${plan.popular ? 'pt-12' : ''}`}>
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.nombre}</h3>
                    <div className="text-4xl font-bold text-red-500 mb-2">{plan.precio}</div>
                    <div className="text-gray-600">{plan.periodo} • {plan.horas}</div>
                  </div>
                  <p className="text-gray-600 text-center mb-6">{plan.descripcion}</p>
                  <ul className="space-y-3 mb-8">
                    {plan.beneficios.map((beneficio, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <HiCheck className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{beneficio}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                      plan.popular
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    Seleccionar Plan
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Servicios Adicionales */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Servicios Incluidos
            </h2>
            <div className="w-24 h-1 bg-red-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Más que un espacio de trabajo, ofrecemos una experiencia completa para ceramistas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {serviciosAdicionales.map((servicio, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                  {servicio.icono}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{servicio.titulo}</h3>
                <p className="text-gray-600">{servicio.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Información Práctica */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">¿Cómo Funciona?</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Visita el Espacio</h3>
                    <p className="text-gray-600">Agenda una visita para conocer nuestras instalaciones y la comunidad.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Elige tu Plan</h3>
                    <p className="text-gray-600">Selecciona el plan que mejor se adapte a tu ritmo de trabajo.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Formaliza tu Membresía</h3>
                    <p className="text-gray-600">Completa el proceso de inscripción y recibe tu acceso.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">¡Comienza a Crear!</h3>
                    <p className="text-gray-600">Disfruta de tu espacio creativo y conecta con la comunidad.</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Requisitos y Normas</h2>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Para ser miembro necesitas:</h3>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center space-x-2">
                    <HiCheck className="w-5 h-5 text-red-500" />
                    <span className="text-gray-700">Experiencia básica en cerámica</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <HiCheck className="w-5 h-5 text-red-500" />
                    <span className="text-gray-700">Compromiso con el cuidado del espacio</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <HiCheck className="w-5 h-5 text-red-500" />
                    <span className="text-gray-700">Respeto por la comunidad</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <HiCheck className="w-5 h-5 text-red-500" />
                    <span className="text-gray-700">Seguir las normas de seguridad</span>
                  </li>
                </ul>

                <div className="bg-red-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Incluye inducción gratuita:</h4>
                  <p className="text-gray-700 text-sm">
                    Todos los nuevos miembros reciben una sesión de inducción sobre el uso 
                    de equipos, normas del espacio y presentación de la comunidad.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section className="py-20 bg-gradient-to-r from-red-500 to-red-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            ¿Listo para unirte a nuestra comunidad?
          </h2>
          <p className="text-xl text-red-100 mb-12">
            Contáctanos para agendar una visita y conocer nuestro Cowork Cerámico
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
              <HiPhone className="w-8 h-8 text-red-100 mx-auto mb-3" />
              <p className="text-red-100 font-semibold">Teléfono</p>
              <p className="text-red-200">{contactInfo.telefono}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
              <HiEnvelope className="w-8 h-8 text-red-100 mx-auto mb-3" />
              <p className="text-red-100 font-semibold">Email</p>
              <p className="text-red-200">{contactInfo.email}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
              <HiMapPin className="w-8 h-8 text-red-100 mx-auto mb-3" />
              <p className="text-red-100 font-semibold">Dirección</p>
              <p className="text-red-200">{contactInfo.direccion}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
              <HiClock className="w-8 h-8 text-red-100 mx-auto mb-3" />
              <p className="text-red-100 font-semibold">Horarios</p>
              <p className="text-red-200">{contactInfo.horarios}</p>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <a
              href={`tel:${contactInfo.telefono}`}
              className="inline-flex items-center px-8 py-3 bg-white text-red-600 rounded-lg hover:bg-red-50 transition-colors font-semibold"
            >
              <HiPhone className="w-5 h-5 mr-2" />
              Llamar Ahora
            </a>
            <a
              href={`mailto:${contactInfo.email}`}
              className="inline-flex items-center px-8 py-3 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors font-semibold"
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

export default CoworkCeramico;
