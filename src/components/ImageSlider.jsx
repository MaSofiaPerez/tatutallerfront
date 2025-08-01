import { useState, useEffect } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";

function ImageSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Imágenes del carrusel
  const slides = [
    {
      id: 1,
      image:
        "/img/slider/hacer-una-olla-de-barro-hecha-mano-leccion-de-ceramica-hobby.jpg",
      title: "Clases de Cerámica",
      subtitle: "Disfrutá de la modalidad que más te guste",
      description:
        "Clases para niños y adultos de todo nivel. Aprende desde cero o perfecciona tus habilidades.",
    },
    {
      id: 2,
      image: "/img/slider/composicion-de-elementos-de-alfareria-en-taller.jpg",
      title: "Coworking Cerámico",
      subtitle: "Trabaja a tu ritmo en un ambiente creativo",
      description:
        "Contamos con espacios de trabajo compartidos equipados con todo lo necesario para que puedas desarrollar tus proyectos cerámicos.",
    },
    {
      id: 3,
      image:
        "/img/slider/primer-plano-del-alfarero-femenino-arreglando-las-placas-de-ceramica.jpg",
      title: "Horneamos tus piezas",
      subtitle: "Contamos con hornos de alta calidad y diferentes tamaños",
      description:
        "Puedes cocer tus piezas desde cualquiera de nuestros hornos eléctricos. Precios por horneada completo o fracción según tamaño.",
    },
    {
      id: 4,
      image:
        "/img/slider/primer-plano-de-masa-amasada-florero-de-ceramica-en-la-mesa.jpg",
      title: "Tatú Shop Cerámica",
      subtitle: "Tienda online de insumos cerámicos",
      description:
        "Contamos con variedad de insumos para que puedas crear desde tu hogar o taller.",
    },
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Cambia cada 5 segundos

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    // Reactivar auto-play después de 10 segundos
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <div className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden rounded-xl shadow-lg bg-gray-900">
      {/* Slides Container */}
      <div
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className="min-w-full h-full relative bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${slide.image})`,
            }}
          >
            {/* Overlay Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white px-4 max-w-4xl">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg">
                  {slide.title}
                </h1>
                <h2 className="text-lg md:text-2xl lg:text-3xl font-medium mb-6 text-yellow-300 drop-shadow-lg">
                  {slide.subtitle}
                </h2>
                <p className="text-sm md:text-lg lg:text-xl mb-8 opacity-90 max-w-2xl mx-auto drop-shadow-lg">
                  {slide.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg">
                    Reservar Clase
                  </button>
                  <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors shadow-lg">
                    Ver Galería
                  </button>
                  <button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg">
                    Ir a Tienda
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-2 rounded-full transition-all duration-300 group"
        aria-label="Imagen anterior"
      >
        <HiChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-2 rounded-full transition-all duration-300 group"
        aria-label="Siguiente imagen"
      >
        <HiChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>

      {/* Dots Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-yellow-500 scale-110"
                : "bg-white bg-opacity-60 hover:bg-opacity-80"
            }`}
            aria-label={`Ir a imagen ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-black bg-opacity-30">
        <div
          className="h-full bg-yellow-500 transition-all duration-300"
          style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
        />
      </div>

      {/* Auto-play indicator */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className={`p-2 rounded-full transition-all duration-300 ${
            isAutoPlaying
              ? "bg-green-500 bg-opacity-80 hover:bg-opacity-100"
              : "bg-gray-500 bg-opacity-80 hover:bg-opacity-100"
          } text-white`}
          aria-label={
            isAutoPlaying
              ? "Pausar reproducción automática"
              : "Activar reproducción automática"
          }
        >
          {isAutoPlaying ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

export default ImageSlider;
