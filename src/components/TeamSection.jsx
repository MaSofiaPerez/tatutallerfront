import { HiArrowLeft, HiEnvelope, HiPhone } from "react-icons/hi2";
import { Link } from "react-router-dom";

function TeamSection() {
  const teamMembers = [
    {
      id: 1,
      name: "Ana Rodríguez",
      role: "Ceramista Principal & Fundadora",
      specialty: "Torno y Técnicas Tradicionales",
      photo: "/img/team/ana-rodriguez.jpg", // Placeholder para foto
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ana se especializa en técnicas de torno y ha estado trabajando con cerámica por más de 15 años. Su pasión por enseñar y compartir conocimientos la convierte en el corazón de nuestro taller.",
      email: "ana@tatutaller.com",
      phone: "+598 99 111 222",
      experience: "15+ años",
      achievements: [
        "Fundadora del taller",
        "Especialista en torno",
        "Mentora de ceramistas",
      ],
    },
    {
      id: 2,
      name: "Carlos Méndez",
      role: "Maestro Esmaltador",
      specialty: "Esmaltado y Acabados",
      photo: "/img/team/carlos-mendez.jpg", // Placeholder para foto
      description:
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Carlos es nuestro experto en esmaltado, conoce todas las técnicas de acabado y coloración. Su creatividad y precision técnica han dado vida a miles de piezas únicas en nuestro taller.",
      email: "carlos@tatutaller.com",
      phone: "+598 99 333 444",
      experience: "12+ años",
      achievements: [
        "Experto en esmaltado",
        "Innovador en técnicas",
        "Colorista profesional",
      ],
    },
    {
      id: 3,
      name: "Laura Vega",
      role: "Escultora Cerámica",
      specialty: "Escultura y Modelado",
      photo: "/img/team/laura-vega.jpg", // Placeholder para foto
      description:
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Laura aporta una dimensión artística única al taller con sus esculturas y técnicas de modelado avanzadas. Su enfoque en la expresión artística inspira a todos nuestros estudiantes.",
      email: "laura@tatutaller.com",
      phone: "+598 99 555 666",
      experience: "10+ años",
      achievements: [
        "Escultora profesional",
        "Artista reconocida",
        "Especialista en modelado",
      ],
    },
    {
      id: 4,
      name: "Patricia Silva",
      role: "Instructora Infantil",
      specialty: "Cerámica para Niños",
      photo: "/img/team/patricia-silva.jpg", // Placeholder para foto
      description:
        "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Patricia tiene el don especial de conectar con los más pequeños, introduciendo a los niños al maravilloso mundo de la cerámica de manera divertida y educativa.",
      email: "patricia@tatutaller.com",
      phone: "+598 99 777 888",
      experience: "8+ años",
      achievements: [
        "Educadora especializada",
        "Experta en didáctica infantil",
        "Creadora de programas educativos",
      ],
    },
    {
      id: 5,
      name: "Hiroshi Tanaka",
      role: "Maestro en Técnicas Japonesas",
      specialty: "Raku y Cerámica Japonesa",
      photo: "/img/team/hiroshi-tanaka.jpg", // Placeholder para foto
      description:
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. Hiroshi nos trajo las auténticas técnicas japonesas de cerámica, especialmente el Raku. Su enfoque meditativo y filosófico hacia la cerámica aporta una dimensión espiritual única a nuestras clases.",
      email: "hiroshi@tatutaller.com",
      phone: "+598 99 999 000",
      experience: "20+ años",
      achievements: [
        "Maestro en Raku",
        "Especialista en técnicas japonesas",
        "Filosofía cerámica",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
              Conoce Nuestro Equipo
            </h1>
            <div className="w-24 h-1 bg-yellow-500 mx-auto mb-6"></div>
            <p className="text-xl md:text-2xl max-w-4xl mx-auto mb-8 text-gray-700">
              Los talleristas que hacen posible de Tatú Taller. Cada uno aporta
              su experiencia, pasión y estilo único para crear un ambiente de
              aprendizaje continuo.
            </p>
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {teamMembers.map((member, index) => (
              <div
                key={member.id}
                className={`flex flex-col ${
                  index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                } gap-12 items-center`}
              >
                {/* Foto del tallerista */}
                <div className="lg:w-1/3">
                  <div className="relative">
                    <div className="aspect-w-3 aspect-h-4 rounded-2xl overflow-hidden shadow-2xl">
                      <div className="w-full h-96 bg-gray-200 flex items-center justify-center rounded-2xl">
                        <div className="text-center text-gray-400">
                          <div className="text-6xl mb-2">👤</div>
                          <div className="text-sm">Foto de {member.name}</div>
                        </div>
                      </div>
                    </div>

                    {/* Badge de experiencia */}
                    <div className="absolute -top-4 -right-4 bg-yellow-500 text-gray-900 px-4 py-2 rounded-full font-bold shadow-lg">
                      {member.experience}
                    </div>
                  </div>
                </div>

                {/* Información del tallerista */}
                <div className="lg:w-2/3">
                  <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                    <div className="mb-6">
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        {member.name}
                      </h2>
                      <div className="text-xl text-yellow-600 font-semibold mb-2">
                        {member.role}
                      </div>
                      <div className="text-lg text-gray-600 mb-4">
                        Especialidad: {member.specialty}
                      </div>
                    </div>

                    <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                      {member.description}
                    </p>

                    {/* Logros */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">
                        Logros y Especialidades:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {member.achievements.map((achievement, idx) => (
                          <span
                            key={idx}
                            className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium"
                          >
                            {achievement}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Contacto */}
                    <div className="border-t border-gray-200 pt-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">
                        Contacto:
                      </h4>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <a
                          href={`mailto:${member.email}`}
                          className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                        >
                          <HiEnvelope className="w-4 h-4 mr-2" />
                          {member.email}
                        </a>
                        <a
                          href={`tel:${member.phone}`}
                          className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                        >
                          <HiPhone className="w-4 h-4 mr-2" />
                          {member.phone}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Final */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            ¿Te gustaría conocernos en persona?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Vení a visitarnos y conoce a nuestro equipo. ¡Te esperamos!.
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Link
              to="/clases"
              className="inline-flex items-center px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-gray-900 rounded-lg font-semibold transition-colors shadow-lg"
            >
              Ver Nuestras Clases
            </Link>
            <Link
              to="/"
              className="inline-flex items-center px-8 py-3 bg-white text-yellow-600 border-2 border-yellow-600 rounded-lg hover:bg-yellow-50 transition-colors font-semibold"
            >
              <HiArrowLeft className="w-5 h-5 mr-2" />
              Volver al Inicio
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default TeamSection;
