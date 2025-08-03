import ImageSlider from "../components/ImageSlider";
import AboutSection from "../components/AboutSection";
import FAQSection from "../components/FAQSection";
import ContactSection from "../components/ContactSection";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen">
      {/* Image Slider */}
      <div className="mb-16">
        <ImageSlider />
      </div>

      {/* Services Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Nuestros Servicios
            </h2>
            <div className="w-24 h-1 bg-yellow-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ofrecemos una amplia gama de servicios y herramientas para que
              disfrutes de la cerámica como quieras.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow border border-gray-100">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Tienda Web
              </h3>
              <p className="text-gray-600 mb-4">
                Contamos con una tienda online para que puedas comprar
                materiales cerámicos desde la comodidad de tu hogar.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow border border-gray-100">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Cursos libres y para compartir
              </h3>
              <p className="text-gray-600 mb-4">
                Clases adaptadas a tu ritmo sin importar tu nivel de
                experiencia.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow border border-gray-100">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Alquiler de espacio y Cocción.
              </h3>
              <p className="text-gray-600 mb-4">
                Servicio completo de cocción y espacio para poder crear tus
                propias piezas sin necesidad de montar tu propio taller.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Clases CTA Section */}
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            ¿Quieres aprender el arte de la cerámica?
          </h2>
          <p className="text-xl text-gray-800 mb-8 max-w-3xl mx-auto">
            Ya sea que quieras pasar un día divertido o estar todo un mes con
            las manos en el barro, ¡Tenemos el plan perfecto para vos! Clases
            libres y flexibles, adaptadas a tu ritmo y nivel de experiencia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/clases"
              className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-block"
            >
              Ver y Reservar Clases
            </Link>
          </div>
        </div>
      </div>

      {/* About Section */}
      <AboutSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Contact Section */}
      <ContactSection />
    </div>
  );
}

export default Home;
