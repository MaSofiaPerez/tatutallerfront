import {
  HiCheckBadge,
  HiHeart,
  HiSparkles,
  HiUserGroup,
} from "react-icons/hi2";
import { Link } from "react-router-dom";

function AboutSection() {
  const features = [
    {
      icon: HiCheckBadge,
      title: "Experiencia Comprobada",
      description:
        "Más de 10 años creando piezas cerámicas únicas y personalizadas.",
    },
    {
      icon: HiHeart,
      title: "Calidad y Precisión",
      description:
        "Técnicas tradicionales y modernas con máximos estándares de calidad en cada pieza.",
    },
    {
      icon: HiSparkles,
      title: "Ceramistas Especializados",
      description:
        "Equipo de profesionales expertos en diversas técnicas y estilos cerámicos.",
    },
    {
      icon: HiUserGroup,
      title: "Atención Personalizada",
      description:
        "Consultas individuales para crear la pieza perfecta para ti.",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            ¿Quiénes Somos?
          </h2>
          <div className="w-24 h-1 bg-yellow-500 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            En{" "}
            <span className="font-semibold text-yellow-600">Tatú Taller</span>,
            somos ceramistas que creen en el hacer colectivo. Compartimos lo que
            sabemos porque sentimos que el arte se aprende, se vive y se
            disfruta en comunidad.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
          {/* Left: Image */}
          <div className="relative">
            <div className="aspect-w-4 aspect-h-3 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/img/nosotros.jpg"
                alt="Nuestro taller"
                className="w-full h-96 object-cover"
              />
            </div>
            {/* Floating Stats Card */}
            <div className="absolute -bottom-8 -right-8 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-2">
                  10+
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  Años de Experiencia
                </div>
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              Nuestra Historia
            </h3>
            <div className="space-y-6 text-gray-600 leading-relaxed">
              <p>
                Fundamos este taller con una visión clara: crear un espacio
                donde el arte y la expresión personal se encuentren de forma
                auténtica.
              </p>
              <p>
                Creemos profundamente que todas las personas pueden hacer
                cerámica. Por eso, buscamos ofrecer lo necesario para que
                cualquiera pueda acercarse al barro, sin importar su experiencia
                o sus recursos.
              </p>
              <p>
                Cada tallerista que forma parte del equipo aporta una mirada
                propia, con estilos diferentes. Esa diversidad enriquece no solo
                las piezas que nacen acá, sino también los vínculos que se tejen
                en cada encuentro.
              </p>
              <p>
                Nos enorgullece haber construido un ambiente cálido, donde cada
                persona se sienta cómoda para probar, equivocarse, crecer y
                convertir sus ideas en arte con identidad propia.
              </p>
            </div>

            {/* Call to Action */}
            <div className="mt-8">
              <Link
                to="/equipo"
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-8 py-3 rounded-lg font-semibold transition-colors shadow-lg inline-block"
              >
                Conoce Nuestro Equipo
              </Link>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
            >
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-8 h-8 text-yellow-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                {feature.title}
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
