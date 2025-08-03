import { HiArrowLeft } from "react-icons/hi2";
import { Link } from "react-router-dom";

function Gallery() {
  const galleryImages = [
    {
      id: 1,
      src: "/img/gallery/taller-espacio-1.jpg",
      alt: "Vista general del taller",
    },
    {
      id: 2,
      src: "/img/gallery/estudiantes-trabajando.jpg",
      alt: "Estudiantes trabajando en sus piezas",
    },
    {
      id: 3,
      src: "/img/gallery/tornos-en-uso.jpg",
      alt: "Área de tornos durante una clase",
    },
    {
      id: 4,
      src: "/img/gallery/piezas-alumnos-1.jpg",
      alt: "Creaciones de nuestros alumnos",
    },
    {
      id: 5,
      src: "/img/gallery/horno-abierto.jpg",
      alt: "Horno después de una horneada",
    },
    {
      id: 6,
      src: "/img/gallery/mesa-trabajo.jpg",
      alt: "Mesa de trabajo con herramientas",
    },
    {
      id: 7,
      src: "/img/gallery/piezas-secando.jpg",
      alt: "Piezas secándose en las estanterías",
    },
    {
      id: 8,
      src: "/img/gallery/clase-grupal.jpg",
      alt: "Clase grupal de cerámica",
    },
    {
      id: 9,
      src: "/img/gallery/esmaltado-proceso.jpg",
      alt: "Proceso de esmaltado",
    },
    {
      id: 10,
      src: "/img/gallery/piezas-alumnos-2.jpg",
      alt: "Variedad de piezas terminadas",
    },
    {
      id: 11,
      src: "/img/gallery/taller-ambiente.jpg",
      alt: "Ambiente acogedor del taller",
    },
    {
      id: 12,
      src: "/img/gallery/horneada-resultado.jpg",
      alt: "Resultado de una horneada exitosa",
    },
    {
      id: 13,
      src: "/img/gallery/herramientas-ceramica.jpg",
      alt: "Herramientas de cerámica",
    },
    {
      id: 14,
      src: "/img/gallery/estudiante-concentrado.jpg",
      alt: "Estudiante concentrado en su trabajo",
    },
    {
      id: 15,
      src: "/img/gallery/piezas-variadas.jpg",
      alt: "Variedad de estilos y técnicas",
    },
  ];

  // Crear placeholders para las imágenes
  const ImagePlaceholder = ({ image }) => (
    <div className="aspect-square bg-gradient-to-br from-amber-50 to-orange-100 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
      <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="text-4xl mb-2">📸</div>
        <div className="text-xs text-center px-2 text-gray-600">
          <div className="font-medium">{image.alt}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
              Galería del Taller
            </h1>
            <div className="w-24 h-1 bg-yellow-500 mx-auto mb-6"></div>
            <p className="text-xl md:text-2xl max-w-4xl mx-auto mb-8 text-gray-700">
              Conoce nuestro espacio, ve las creaciones de nuestros alumnos y
              siente el ambiente creativo que se vive en Tatú Taller día a día.
            </p>
          </div>
        </div>
      </section>

      {/* Galería */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {galleryImages.map((image) => (
              <ImagePlaceholder key={image.id} image={image} />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-yellow-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            ¿Te gusta lo que ves?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Vení a conocer nuestro taller en persona. ¡Te esperamos!.
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Link
              to="/clases"
              className="inline-flex items-center px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-gray-900 rounded-lg font-semibold transition-colors shadow-lg"
            >
              Inscríbete a una Clase
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

export default Gallery;
