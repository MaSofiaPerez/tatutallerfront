import { useState } from "react";
import {
  HiFire,
  HiClock,
  HiCurrencyDollar,
  HiCheck,
  HiPhone,
  HiEnvelope,
  HiMapPin,
  HiExclamationTriangle,
  HiInformationCircle,
  HiScale,
} from "react-icons/hi2";

function AlquilerHornos() {
  const [selectedHorno, setSelectedHorno] = useState(null);

  const hornos = [
    {
      id: 1,
      nombre: "Horno Eléctrico Pequeño",
      capacidad: "0.3 m³",
      temperatura: "1280°C",
      ideal: "Piezas pequeñas y medianas",
      tiempo: "8-12 horas",
      precio: "$800",
      descripcion:
        "Perfecto para ceramistas independientes y piezas personales",
      especificaciones: [
        "Capacidad: 120 litros",
        "Dimensiones internas: 40x40x75cm",
        "Control digital de temperatura",
        "Programas preestablecidos",
        "Ideal para 15-25 piezas pequeñas",
      ],
    },
    {
      id: 2,
      nombre: "Horno Eléctrico Mediano",
      capacidad: "0.6 m³",
      temperatura: "1300°C",
      ideal: "Producciones medianas",
      tiempo: "12-16 horas",
      precio: "$1,400",
      descripcion:
        "La opción más versátil para talleres y producciones regulares",
      especificaciones: [
        "Capacidad: 240 litros",
        "Dimensiones internas: 50x50x95cm",
        "Control programable avanzado",
        "Sistema de ventilación",
        "Ideal para 30-50 piezas medianas",
      ],
    },
    {
      id: 3,
      nombre: "Horno Eléctrico Grande",
      capacidad: "1.2 m³",
      temperatura: "1320°C",
      ideal: "Producciones grandes",
      tiempo: "16-24 horas",
      precio: "$2,200",
      descripcion: "Para producciones comerciales y proyectos de gran escala",
      especificaciones: [
        "Capacidad: 480 litros",
        "Dimensiones internas: 60x60x130cm",
        "Control industrial preciso",
        "Sistema de seguridad avanzado",
        "Ideal para 60-100 piezas grandes",
      ],
    },
    {
      id: 4,
      nombre: "Horno a Gas Artesanal",
      capacidad: "0.8 m³",
      temperatura: "1350°C",
      ideal: "Efectos especiales",
      tiempo: "10-14 horas",
      precio: "$1,800",
      descripcion: "Para técnicas tradicionales y efectos únicos de reducción",
      especificaciones: [
        "Capacidad: 320 litros",
        "Cocción oxidante y reductora",
        "Alimentación a gas natural",
        "Control manual experto",
        "Ideal para técnicas ancestrales",
      ],
    },
  ];

  const serviciosIncluidos = [
    {
      icono: <HiInformationCircle className="w-8 h-8" />,
      titulo: "Asesoramiento Técnico",
      descripcion:
        "Te ayudamos a programar la cocción según tu tipo de piezas y esmaltes",
    },
    {
      icono: <HiScale className="w-8 h-8" />,
      titulo: "Carga y Descarga",
      descripcion:
        "Servicio de carga profesional incluido para optimizar el espacio",
    },
    {
      icono: <HiClock className="w-8 h-8" />,
      titulo: "Monitoreo 24/7",
      descripcion:
        "Supervisión constante del proceso de cocción por nuestros expertos",
    },
    {
      icono: <HiCheck className="w-8 h-8" />,
      titulo: "Garantía de Proceso",
      descripcion:
        "Garantizamos la correcta ejecución del ciclo de cocción programado",
    },
  ];

  const tiposCoccion = [
    {
      tipo: "Bizcocho",
      temperatura: "950°C - 1000°C",
      descripcion: "Primera cocción para endurecer la arcilla",
      duracion: "8-10 horas",
      recomendacion: "Esencial para todas las piezas antes del esmaltado",
    },
    {
      tipo: "Esmalte",
      temperatura: "1180°C - 1280°C",
      descripcion: "Segunda cocción para fundir los esmaltes",
      duracion: "10-12 horas",
      recomendacion: "Temperatura específica según tipo de esmalte",
    },
    {
      tipo: "Alta Temperatura",
      temperatura: "1280°C - 1320°C",
      descripcion: "Para gres y porcelana de alta resistencia",
      duracion: "12-16 horas",
      recomendacion: "Ideal para piezas utilitarias y esculturas",
    },
    {
      tipo: "Reducción",
      temperatura: "1200°C - 1300°C",
      descripcion: "Técnica especial en atmósfera reductora",
      duracion: "12-14 horas",
      recomendacion: "Solo en horno a gas, efectos únicos garantizados",
    },
  ];

  const normasSeguridad = [
    "Las piezas deben estar completamente secas (mínimo 7 días)",
    "Grosor máximo de pared: 2cm para bizcocho, 1.5cm para esmalte",
    "No se aceptan piezas con burbujas de aire o grietas",
    "Los esmaltes deben estar aplicados uniformemente",
    "Se debe informar sobre cualquier técnica especial utilizada",
    "Las piezas grandes requieren evaluación previa",
    "No nos hacemos responsables por roturas debido a defectos de fabricación",
  ];

  const contactInfo = {
    telefono: "+598 99 123 456",
    email: "hornos@tatutaller.com",
    direccion: "Av. Rivera 1234, Montevideo",
    horarios: "Lunes a Viernes 9:00 - 17:00",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <HiFire className="w-20 h-20 mx-auto mb-6 text-green-600" />
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-green-600">
            Alquiler de Hornos
          </h1>
          <div className="w-24 h-1 bg-green-500 mx-auto mb-6"></div>
          <p className="text-xl md:text-2xl max-w-4xl mx-auto mb-8 text-gray-700">
            Cocción profesional para tus piezas cerámicas. Hornos eléctricos y a
            gas con monitoreo experto para resultados perfectos en cada cocción.
          </p>
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-green-600">4</div>
                <div className="text-sm text-gray-600">Hornos</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">1350°C</div>
                <div className="text-sm text-gray-600">Temp. Máx</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">24/7</div>
                <div className="text-sm text-gray-600">Monitoreo</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">15+</div>
                <div className="text-sm text-gray-600">Años Exp.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tipos de Hornos */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Nuestros Hornos
            </h2>
            <div className="w-24 h-1 bg-green-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Contamos con diferentes tipos de hornos para satisfacer todas tus
              necesidades de cocción, desde piezas personales hasta producciones
              comerciales.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {hornos.map((horno) => (
              <div
                key={horno.id}
                className={`bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer ${
                  selectedHorno === horno.id
                    ? "ring-2 ring-green-500 bg-green-50"
                    : ""
                }`}
                onClick={() =>
                  setSelectedHorno(selectedHorno === horno.id ? null : horno.id)
                }
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {horno.nombre}
                    </h3>
                    <p className="text-gray-600 mb-3">{horno.descripcion}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      {horno.precio}
                    </div>
                    <div className="text-sm text-gray-500">por cocción</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-600">
                      {horno.capacidad}
                    </div>
                    <div className="text-xs text-gray-500">Capacidad</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-600">
                      {horno.temperatura}
                    </div>
                    <div className="text-xs text-gray-500">Temp. Máx</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-600">
                      {horno.tiempo}
                    </div>
                    <div className="text-xs text-gray-500">Duración</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-600">
                      {horno.ideal}
                    </div>
                    <div className="text-xs text-gray-500">Ideal para</div>
                  </div>
                </div>

                {selectedHorno === horno.id && (
                  <div className="mt-4 pt-4 border-t border-green-200">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Especificaciones técnicas:
                    </h4>
                    <ul className="space-y-2">
                      {horno.especificaciones.map((spec, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <HiCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tipos de Cocción */}
      <section className="py-20 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Tipos de Cocción
            </h2>
            <div className="w-24 h-1 bg-green-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ofrecemos diferentes tipos de cocción según las necesidades de tus
              piezas y proyectos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tiposCoccion.map((coccion, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {coccion.tipo}
                  </h3>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {coccion.temperatura}
                  </span>
                </div>
                <p className="text-gray-600 mb-3">{coccion.descripcion}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    <HiClock className="w-4 h-4 inline mr-1" />
                    {coccion.duracion}
                  </span>
                </div>
                <div className="mt-3 p-3 bg-green-50 rounded-lg">
                  <p className="text-green-800 text-sm">
                    <strong>Recomendación:</strong> {coccion.recomendacion}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Servicios Incluidos */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Servicios Incluidos
            </h2>
            <div className="w-24 h-1 bg-green-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Más que solo alquiler de hornos, te ofrecemos un servicio integral
              para garantizar los mejores resultados en tus cocciones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {serviciosIncluidos.map((servicio, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                  {servicio.icono}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {servicio.titulo}
                </h3>
                <p className="text-gray-600">{servicio.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Normas y Procedimientos */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Proceso de Reserva
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Consulta y Evaluación
                    </h3>
                    <p className="text-gray-600">
                      Contáctanos para evaluar tus piezas y determinar el tipo
                      de cocción necesaria.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Programación
                    </h3>
                    <p className="text-gray-600">
                      Agendamos la fecha de cocción según disponibilidad y tipo
                      de horno.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Entrega de Piezas
                    </h3>
                    <p className="text-gray-600">
                      Trae tus piezas 24hs antes de la cocción para inspección y
                      carga.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Cocción y Entrega
                    </h3>
                    <p className="text-gray-600">
                      Realizamos la cocción y te notificamos cuando esté listo
                      para retirar.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Normas de Seguridad
              </h2>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center space-x-2 mb-4">
                  <HiExclamationTriangle className="w-6 h-6 text-orange-500" />
                  <h3 className="text-xl font-semibold text-gray-900">
                    Importante leer antes de traer piezas
                  </h3>
                </div>
                <ul className="space-y-3">
                  {normasSeguridad.map((norma, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 text-sm">{norma}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <p className="text-green-800 text-sm">
                    <strong>Garantía:</strong> Garantizamos la correcta
                    ejecución del proceso de cocción. No nos responsabilizamos
                    por roturas debido a defectos en la fabricación de las
                    piezas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Precios y Descuentos */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Tarifas y Descuentos
            </h2>
            <div className="w-24 h-1 bg-green-500 mx-auto mb-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Cocción Individual
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Horno Pequeño</span>
                  <span className="font-semibold text-green-600">$800</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Horno Mediano</span>
                  <span className="font-semibold text-green-600">$1,400</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Horno Grande</span>
                  <span className="font-semibold text-green-600">$2,200</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Horno a Gas</span>
                  <span className="font-semibold text-green-600">$1,800</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Bonos Mensuales
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">5 cocciones</span>
                  <div className="text-right">
                    <span className="font-semibold text-green-600">
                      15% OFF
                    </span>
                    <div className="text-xs text-gray-500">$3,400</div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">10 cocciones</span>
                  <div className="text-right">
                    <span className="font-semibold text-green-600">
                      25% OFF
                    </span>
                    <div className="text-xs text-gray-500">$6,000</div>
                  </div>
                </div>
                <div className="text-sm text-green-700 mt-4">
                  * Válido por 3 meses. No acumulable.
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Servicios Extra
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Carga urgente (24hs)</span>
                  <span className="font-semibold text-green-600">+$200</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cocción express</span>
                  <span className="font-semibold text-green-600">+50%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Almacenaje extra</span>
                  <span className="font-semibold text-green-600">$50/día</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Asesoramiento técnico</span>
                  <span className="font-semibold text-green-600">Incluido</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-green-600 mb-6">
            ¿Listo para cocer tus piezas?
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Contáctanos para programar la cocción de tus piezas cerámicas
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow-md p-6">
              <HiPhone className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <p className="text-gray-800 font-semibold">Teléfono</p>
              <p className="text-gray-600">{contactInfo.telefono}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <HiEnvelope className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <p className="text-gray-800 font-semibold">Email</p>
              <p className="text-gray-600">{contactInfo.email}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <HiMapPin className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <p className="text-gray-800 font-semibold">Dirección</p>
              <p className="text-gray-600">{contactInfo.direccion}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <HiClock className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <p className="text-gray-800 font-semibold">Horarios</p>
              <p className="text-gray-600">{contactInfo.horarios}</p>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <a
              href={`tel:${contactInfo.telefono}`}
              className="inline-flex items-center px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              <HiPhone className="w-5 h-5 mr-2" />
              Llamar Ahora
            </a>
            <a
              href={`mailto:${contactInfo.email}`}
              className="inline-flex items-center px-8 py-3 bg-white text-green-600 border-2 border-green-600 rounded-lg hover:bg-green-50 transition-colors font-semibold"
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

export default AlquilerHornos;
