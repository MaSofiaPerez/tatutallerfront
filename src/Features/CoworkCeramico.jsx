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
  HiCube,
  HiKey,
  HiAcademicCap,
  HiBuildingStorefront,
  HiMegaphone,
} from "react-icons/hi2";

function CoworkCeramico() {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const planesEspacio = [
    {
      id: 1,
      nombre: "Opción 1: Doble Estantería",
      precio: "$3,375",
      descripcion: "2 estanterías (30x84x200 cm + 45x84x200 cm)",
      caracteristicas: [
        "Dos estanterías amuradas para uso personal",
        "Máximo espacio de almacenamiento",
        "Ideal para producción intensiva",
        "Perfecto para múltiples proyectos",
      ],
      destacado: true,
    },
    {
      id: 2,
      nombre: "Opción 2: Estantería Grande",
      precio: "$2,810",
      descripcion: "1 estantería grande (45x84x200 cm)",
      caracteristicas: [
        "Una estantería amurada grande",
        "Amplio espacio de trabajo",
        "Ideal para proyectos medianos",
        "Equilibrio entre espacio y costo",
      ],
      destacado: false,
    },
    {
      id: 3,
      nombre: "Opción 3: Estantería Chica",
      precio: "$2,250",
      descripcion: "1 estantería chica (30x84x200 cm)",
      caracteristicas: [
        "Una estantería amurada compacta",
        "Espacio eficiente",
        "Ideal para proyectos personales",
        "Opción más económica",
      ],
      destacado: false,
    },
  ];

  const beneficios = [
    {
      icono: HiCube,
      titulo: "Espacio Individual Asignado",
      descripcion:
        "Sector personal del taller asignado según tus necesidades y distribución equitativa",
    },
    {
      icono: HiCog6Tooth,
      titulo: "Maquinarias y Herramientas",
      descripcion:
        "Acceso completo a infraestructura, maquinarias y herramientas colectivas del taller",
    },
    {
      icono: HiSparkles,
      titulo: "Horneadas con Descuento",
      descripcion:
        "Capacitación gratuita en hornos eléctricos + 50% descuento en horneadas propias",
    },
    {
      icono: HiBuildingStorefront,
      titulo: "Materiales con Descuento",
      descripcion:
        "10% de descuento en todos los materiales respecto al precio de venta al público",
    },
    {
      icono: HiAcademicCap,
      titulo: "Cursos con Beneficios",
      descripcion:
        "10% de descuento en cursos y ciclo de formación (sujeto a disponibilidad de cupos)",
    },
    {
      icono: HiUsers,
      titulo: "Espacio para Docencia",
      descripcion:
        "Uso del salón para dictar cursos con solo 15% de comisión. Actividades sin fines de lucro gratuitas",
    },
    {
      icono: HiMegaphone,
      titulo: "Difusión y Comunicación",
      descripcion:
        "Apoyo en difusión por redes sociales + grupo WhatsApp para comunicación interna",
    },
    {
      icono: HiKey,
      titulo: "Acceso Total",
      descripcion:
        "Copia de llave y acceso libre al taller con total autonomía horaria",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-900 to-red-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <HiUsers className="w-20 h-20 mx-auto mb-6 text-white" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Coworking Cerámico
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-4xl mx-auto">
              Un espacio colaborativo para ceramistas, artistas, artesanos,
              estudiantes, docentes y aficionados de las artes del fuego
            </p>
          </div>
        </div>
      </div>

      {/* Objetivos y Espíritu */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              ¿Cuál es el Espíritu del Coworking?
            </h2>
            <div className="w-24 h-1 bg-red-500 mx-auto mb-8"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div className="bg-red-50 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <HiLightBulb className="w-8 h-8 text-red-600 mr-3" />
                Nuestro Objetivo
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Brindar un espacio acondicionado con la infraestructura adecuada
                al quehacer cerámico para que diversos usuarios puedan
                desempeñar su plena actividad productiva y/o artística vinculada
                al oficio de la cerámica, en sana y enriquecedora convivencia.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Facilitar a través de la oferta de espacios, herramientas,
                materiales y servicios la posibilidad de desarrollar proyectos
                cerámicos, ya sean estos motivados por el aprendizaje, el ocio,
                la exploración artística, o la aplicación de estos conocimientos
                al ámbito laboral.
              </p>
            </div>

            <div className="bg-red-50 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <HiUsers className="w-8 h-8 text-red-600 mr-3" />
                Filosofía de Convivencia
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Buscamos alentar el crecimiento de todos los usuarios del taller
                bajo el entendido de que compartir el espacio de trabajo en
                convivencia con otros artistas del rubro enriquece el trabajo
                individual.
              </p>
              <p className="text-gray-700 leading-relaxed">
                La transferencia de conocimientos, el intercambio de materiales,
                el préstamo de herramientas específicas y la recomendación entre
                contactos hacen a un clima propicio para el desarrollo del arte
                y la investigación.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-100 to-red-50 rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Sentido de Pertenencia
            </h3>
            <p className="text-gray-700 max-w-4xl mx-auto leading-relaxed">
              La idea es lograr un sentido de pertenencia al taller, que los
              usuarios puedan apropiarse del espacio y hacer las cosas que
              harían si tuvieran un taller propio, simplemente en consideración
              y respeto mutuo. Asistir en el horario que les resulte cómodo,
              compartir el espacio con familiares y amigos, mostrar su arte y
              sus procesos.
            </p>
          </div>
        </div>
      </section>

      {/* Planes de Espacio */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Opciones de Espacio Personal
            </h2>
            <div className="w-24 h-1 bg-red-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Cada usuario tendrá asignado un sector del taller según sus
              necesidades
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {planesEspacio.map((plan) => (
              <div
                key={plan.id}
                className={`rounded-xl p-8 text-center transition-shadow hover:shadow-lg ${
                  plan.destacado
                    ? "bg-red-50 border-2 border-red-300"
                    : "bg-white border border-gray-200"
                }`}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {plan.nombre}
                </h3>
                <div className="text-4xl font-bold text-red-600 mb-2">
                  {plan.precio}
                </div>
                <p className="text-gray-600 text-sm mb-6">{plan.descripcion}</p>
                <ul className="space-y-3 text-left">
                  {plan.caracteristicas.map((caracteristica, index) => (
                    <li key={index} className="flex items-start">
                      <HiCheck className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">
                        {caracteristica}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Información de Matrícula */}
          <div className="bg-red-600 rounded-xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">
              Matrícula de Ingreso: $3,300
            </h3>
            <p className="text-lg mb-2">📢 ¡Mantente Informado!</p>
            <p className="text-red-100">
              Seguinos en nuestras redes sociales para conocer ofertas
              especiales, descuentos y promociones disponibles
            </p>
          </div>
        </div>
      </section>

      {/* Beneficios Incluidos */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              ¿Qué Incluye Asociarse al Coworking?
            </h2>
            <div className="w-24 h-1 bg-red-500 mx-auto mb-6"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {beneficios.map((beneficio, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <beneficio.icono className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">
                  {beneficio.titulo}
                </h3>
                <p className="text-gray-600 text-sm">{beneficio.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Condiciones y Pagos */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Condiciones y Formas de Pago
            </h2>
            <div className="w-24 h-1 bg-red-500 mx-auto mb-6"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <HiClock className="w-8 h-8 text-red-600 mr-3" />
                Formas de Pago
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <HiCheck className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    <strong>Mensualidad:</strong> Se paga a mes vencido dentro
                    de los primeros 10 días
                  </span>
                </li>
                <li className="flex items-start">
                  <HiCheck className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    <strong>Pagos fuera de fecha:</strong> 10% de recargo
                  </span>
                </li>
                <li className="flex items-start">
                  <HiCheck className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    <strong>Con la matrícula:</strong> Se obtiene copia de llave
                    y libre acceso
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <HiSparkles className="w-8 h-8 text-red-600 mr-3" />
                Condiciones Especiales
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <HiCheck className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    <strong>Ausencias temporales:</strong> Reducir mensualidad a
                    1/3 por 1-2 meses máximo 2 veces al año
                  </span>
                </li>
                <li className="flex items-start">
                  <HiCheck className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    <strong>Para darse de baja:</strong> Devolver llave y vaciar
                    espacio en máximo 7 días
                  </span>
                </li>
                <li className="flex items-start">
                  <HiCheck className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    <strong>Importante:</strong> No asistir al taller no exime
                    de pagos
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            ¿Listo para Formar Parte de Nuestra Comunidad?
          </h2>
          <div className="w-24 h-1 bg-red-500 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 mb-8">
            Únete a nuestro coworking cerámico y disfruta de un espacio diseñado
            para potenciar tu creatividad y conectar con otros artistas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
  href="https://wa.me/59898028302?text=Hola,%20quiero%20consultar%20sobre%20el%20cowork%20cerámico"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
            >
              <HiPhone className="w-5 h-5 mr-2" />
              Consultar por WhatsApp
            </a>
            <a
              href="mailto:cowork@tatutaller.com"
              className="inline-flex items-center px-8 py-3 border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white rounded-lg font-semibold transition-colors"
            >
              <HiEnvelope className="w-5 h-5 mr-2" />
              Enviar Email
            </a>
          </div>

          <div className="mt-12 bg-red-50 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Comprometidos con la Excelencia
            </h3>
            <p className="text-gray-700 leading-relaxed">
              En Tatú Taller nos comprometemos a mostrar la mayor receptividad
              ante todo tipo de propuestas, críticas o sugerencias que busquen
              la mejora continua del espacio personal o colectivo. El coworking
              apuesta a la buena disposición de sus miembros para alcanzar su
              más alto funcionamiento, apelando al sentido común, el buen trato
              y la apertura al diálogo.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CoworkCeramico;
