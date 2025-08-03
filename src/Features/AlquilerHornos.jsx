import {
  HiFire,
  HiClock,
  HiCheck,
  HiEnvelope,
  HiExclamationTriangle,
} from "react-icons/hi2";

function AlquilerHornos() {
  const servicios = [
    {
      icono: <HiClock className="w-8 h-8" />,
      titulo: "Piezas Puntuales",
      descripcion:
        "Horneado de piezas individuales o pequeños lotes en un plazo de 10 días",
    },
    {
      icono: <HiFire className="w-8 h-8" />,
      titulo: "Horneada Completa",
      descripcion:
        "Agenda una horneada completa en un plazo menor a una semana",
    },
    {
      icono: <HiCheck className="w-8 h-8" />,
      titulo: "Variedad de Tamaños",
      descripcion:
        "Hornos de diferentes capacidades para ajustarnos al volumen de piezas",
    },
    {
      icono: <HiCheck className="w-8 h-8" />,
      titulo: "Mejor Precio",
      descripcion:
        "Garantizamos el menor costo posible y la mayor velocidad de entrega",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <HiFire className="w-20 h-20 mx-auto mb-6 text-green-200" />
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Servicio de Horneadas
          </h1>
          <div className="w-24 h-1 bg-green-300 mx-auto mb-6"></div>
          <p className="text-xl md:text-2xl max-w-4xl mx-auto mb-8 opacity-90">
            Nuestro servicio de horneadas permite a quienes tienen la
            posibilidad de trabajar desde sus casas o talleres, hornear sus
            piezas de una forma ágil y accesible.
          </p>
        </div>
      </section>

      {/* Información del Servicio */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              ¿Cómo Funciona?
            </h2>
            <div className="w-24 h-1 bg-green-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Se pueden hornear piezas puntuales o pequeños lotes en un plazo de
              10 días, o bien agendar una horneada completa en un plazo menor a
              una semana. Contamos con variedad de tamaños de hornos disponibles
              que nos permiten ajustarnos al volumen de piezas que se precisan
              hornear. De esta manera garantizamos el menor costo posible, y la
              mayor velocidad de la entrega.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {servicios.map((servicio, index) => (
              <div
                key={index}
                className="bg-green-50 rounded-lg p-8 text-center"
              >
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white">
                  {servicio.icono}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {servicio.titulo}
                </h3>
                <p className="text-gray-600 text-lg">{servicio.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ventajas del Servicio */}
      <section className="py-20 bg-green-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Ventajas de Nuestro Servicio
            </h2>
            <div className="w-24 h-1 bg-green-500 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                Flexibilidad
              </h3>
              <ul className="space-y-3">
                {[
                  "Trabaja desde tu casa o taller",
                  "Horneado de piezas individuales",
                  "Pequeños lotes personalizados",
                  "Horneadas completas programadas",
                ].map((item, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <HiCheck className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                Eficiencia
              </h3>
              <ul className="space-y-3">
                {[
                  "Hornos de diferentes tamaños",
                  "Ajuste al volumen de piezas",
                  "Menor costo posible",
                  "Mayor velocidad de entrega",
                ].map((item, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <HiCheck className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border-l-4 border-green-500">
            <p className="text-gray-700">
              <strong>Importante:</strong> Garantizamos la correcta ejecución
              del proceso de cocción según las especificaciones acordadas. No
              nos responsabilizamos por roturas debido a defectos en la
              fabricación de las piezas o materiales defectuosos.
            </p>
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-green-600 mb-6">
            ¿Necesitas hornear tus piezas?
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Contáctanos para conocer precios, disponibilidad y coordinar el
            horneado de tus piezas cerámicas.
          </p>

          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <a
              href="https://wa.me/59899123456?text=Hola%21%20Me%20interesa%20conocer%20precios%20y%20disponibilidad%20del%20servicio%20de%20horneadas"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-2.462-.96-4.779-2.705-6.526-1.745-1.746-4.065-2.711-6.526-2.713-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.092-.634zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              Consultar Precios por WhatsApp
            </a>
            <a
              href="mailto:hornos@tatutaller.com?subject=Consulta%20sobre%20Servicio%20de%20Horneadas&body=Hola%21%20Me%20interesa%20conocer%20precios%20y%20disponibilidad%20del%20servicio%20de%20horneadas."
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
