import { useState } from "react";
import BookingSystem from "../components/BookingSystem";
import { HiAcademicCap, HiUsers, HiClock, HiStar, HiCalendarDays } from "react-icons/hi2";

function Clases() {
  const [selectedClass, setSelectedClass] = useState(null);

  const classTypes = [
    {
      id: "principiantes",
      name: "Curso para Principiantes",
      duration: "4 semanas",
      price: "$200",
      description: "Aprende las bases de la cerámica desde cero. Incluye técnicas básicas de modelado y esmaltado.",
      features: [
        "Fundamentos del trabajo con arcilla",
        "Técnicas básicas de modelado",
        "Uso del torno de alfarero",
        "Proceso de secado y cocción",
        "Aplicación de esmaltes básicos"
      ],
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "avanzado",
      name: "Curso Avanzado",
      duration: "6 semanas",
      price: "$350",
      description: "Perfecciona tu técnica con métodos avanzados. Para estudiantes con conocimientos básicos.",
      features: [
        "Técnicas avanzadas de modelado",
        "Decoración y texturizado",
        "Esmaltes especializados",
        "Cocción en alta temperatura",
        "Creación de piezas complejas"
      ],
      image: "https://images.unsplash.com/photo-1594736797933-d0902e3a17b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "masterclass",
      name: "Masterclass Especializada",
      duration: "2 días",
      price: "$150",
      description: "Workshops intensivos con ceramistas invitados en técnicas específicas.",
      features: [
        "Ceramistas reconocidos",
        "Técnicas exclusivas",
        "Certificado de participación",
        "Material incluido",
        "Networking profesional"
      ],
      image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    }
  ];

  const upcomingClasses = [
    {
      id: 1,
      type: "principiantes",
      startDate: "2025-07-15",
      instructor: "María González",
      spotsAvailable: 8,
      totalSpots: 12
    },
    {
      id: 2,
      type: "avanzado",
      startDate: "2025-07-22",
      instructor: "Ana Rodríguez",
      spotsAvailable: 3,
      totalSpots: 8
    },
    {
      id: 3,
      type: "masterclass",
      startDate: "2025-08-05",
      instructor: "Diego Silva",
      spotsAvailable: 15,
      totalSpots: 20
    }
  ];

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
                onClick={() => document.getElementById('clases-disponibles').scrollIntoView({ behavior: 'smooth' })}
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Ver Clases Disponibles
              </button>
              <button 
                onClick={() => document.getElementById('reserva-sistema').scrollIntoView({ behavior: 'smooth' })}
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors"
              >
                Reservar Ahora
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tipos de Clases */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Nuestros Cursos
            </h2>
            <div className="w-24 h-1 bg-yellow-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ofrecemos diferentes niveles de formación para que puedas desarrollar 
              tus habilidades paso a paso
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {classTypes.map((classType) => (
              <div
                key={classType.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-100"
              >
                <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                  <img
                    src={classType.image}
                    alt={classType.name}
                    className="w-full h-48 object-cover"
                  />
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900">
                      {classType.name}
                    </h3>
                    <span className="text-2xl font-bold text-yellow-600">
                      {classType.price}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">
                    {classType.description}
                  </p>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <HiClock className="w-4 h-4 mr-2" />
                    <span>Duración: {classType.duration}</span>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <h4 className="font-semibold text-gray-900">Incluye:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {classType.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <HiStar className="w-4 h-4 text-yellow-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <button
                    onClick={() => {
                      setSelectedClass(classType.id);
                      document.getElementById('reserva-sistema').scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Inscribirse
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clases Próximas */}
      <section id="clases-disponibles" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Próximas Clases
            </h2>
            <div className="w-24 h-1 bg-yellow-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600">
              Revisa las fechas disponibles y reserva tu lugar
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingClasses.map((upcomingClass) => {
              const classInfo = classTypes.find(ct => ct.id === upcomingClass.type);
              return (
                <div
                  key={upcomingClass.id}
                  className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {classInfo?.name}
                    </h3>
                    <span className="text-lg font-bold text-yellow-600">
                      {classInfo?.price}
                    </span>
                  </div>
                  
                  <div className="space-y-3 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <HiCalendarDays className="w-4 h-4 mr-2 text-yellow-600" />
                      <span>Inicio: {new Date(upcomingClass.startDate).toLocaleDateString('es-ES')}</span>
                    </div>
                    <div className="flex items-center">
                      <HiAcademicCap className="w-4 h-4 mr-2 text-yellow-600" />
                      <span>Instructor: {upcomingClass.instructor}</span>
                    </div>
                    <div className="flex items-center">
                      <HiUsers className="w-4 h-4 mr-2 text-yellow-600" />
                      <span>
                        Cupos: {upcomingClass.spotsAvailable}/{upcomingClass.totalSpots} disponibles
                      </span>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{
                        width: `${((upcomingClass.totalSpots - upcomingClass.spotsAvailable) / upcomingClass.totalSpots) * 100}%`
                      }}
                    ></div>
                  </div>
                  
                  <button
                    onClick={() => {
                      setSelectedClass(upcomingClass.type);
                      document.getElementById('reserva-sistema').scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`w-full py-2 rounded-lg font-medium transition-colors ${
                      upcomingClass.spotsAvailable > 0
                        ? "bg-yellow-500 hover:bg-yellow-600 text-gray-900"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    disabled={upcomingClass.spotsAvailable === 0}
                  >
                    {upcomingClass.spotsAvailable > 0 ? "Reservar Lugar" : "Sin Cupos"}
                  </button>
                </div>
              );
            })}
          </div>
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
                    <h3 className="font-semibold text-gray-900 mb-2">Instructores Certificados</h3>
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
                    <h3 className="font-semibold text-gray-900 mb-2">Grupos Reducidos</h3>
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
                    <h3 className="font-semibold text-gray-900 mb-2">Material Incluido</h3>
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
