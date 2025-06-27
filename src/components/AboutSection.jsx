import {
  HiCheckBadge,
  HiHeart,
  HiSparkles,
  HiUserGroup,
} from "react-icons/hi2";

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

  const stats = [
    { number: "10+", label: "Años de Experiencia" },
    { number: "1000+", label: "Piezas Creadas" },
    { number: "5", label: "Ceramistas Especializados" },
    { number: "100%", label: "Materiales de Calidad" },
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
            somos más que un taller de cerámica. Somos ceramistas apasionados por
            crear piezas únicas que se conviertan en parte de tu historia
            personal y tu hogar.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
          {/* Left: Image */}
          <div className="relative">
            <div className="aspect-w-4 aspect-h-3 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1565058379802-bbe22375cd8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
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
                Fundado con la visión de crear un espacio donde el arte y la
                expresión personal se encuentran, nuestro taller se ha
                convertido en un referente de calidad y creatividad en el mundo
                del tatuaje.
              </p>
              <p>
                Cada uno de nuestros artistas aporta una perspectiva única,
                especializada en diferentes estilos que van desde el realismo
                hasta el minimalismo, pasando por el tradicional y el new
                school.
              </p>
              <p>
                Nos enorgullecemos de crear un ambiente acogedor donde cada
                cliente se siente cómodo para explorar sus ideas y convertirlas
                en arte permanente.
              </p>
            </div>

            {/* Call to Action */}
            <div className="mt-8">
              <button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-8 py-3 rounded-lg font-semibold transition-colors shadow-lg">
                Conoce Nuestro Equipo
              </button>
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

        {/* Stats Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Nuestra Trayectoria en Números
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-yellow-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
