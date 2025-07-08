import { Link } from "react-router-dom";
import {
  HiMapPin,
  HiPhone,
  HiEnvelope,
  HiClock,
  HiHeart,
} from "react-icons/hi2";

function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Inicio", path: "/" },
    { name: "Sobre Nosotros", path: "/nosotros" },
    { name: "Servicios", path: "/servicios" },
    { name: "Galería", path: "/galeria" },
    { name: "Contacto", path: "/contacto" },
  ];

  const services = [
    { name: "Clases de Cerámica", path: "/clases" },
    { name: "Piezas Personalizadas", path: "/servicios/piezas" },
    { name: "Cocción", path: "/servicios/coccion" },
    { name: "Esmaltado", path: "/servicios/esmaltado" },
    { name: "Alquiler de Espacio", path: "/servicios/alquiler" },
  ];

  const socialLinks = [
    {
      name: "Instagram",
      url: "https://instagram.com/tatutaller",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.35-1.052-2.35-2.35 0-1.297 1.053-2.35 2.35-2.35 1.298 0 2.351 1.053 2.351 2.35 0 1.298-1.053 2.35-2.351 2.35zm7.718 0c-1.297 0-2.35-1.052-2.35-2.35 0-1.297 1.053-2.35 2.35-2.35 1.298 0 2.351 1.053 2.351 2.35 0 1.298-1.053 2.35-2.351 2.35z" />
        </svg>
      ),
    },
    {
      name: "Facebook",
      url: "https://facebook.com/tatutaller",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      name: "WhatsApp",
      url: "https://wa.me/59899123456",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
        </svg>
      ),
    },
    {
      name: "TikTok",
      url: "https://tiktok.com/@tatutaller",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <img
                src="/img/imageslogotatu.png"
                alt="Tatu Taller"
                className="w-12 h-12"
              />
              <h3 className="text-2xl font-bold text-yellow-500">
                Tatú Taller
              </h3>
            </div>

            {/* Social Media */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-yellow-500 p-3 rounded-full transition-colors group"
                  aria-label={social.name}
                >
                  <span className="text-gray-300 group-hover:text-gray-900">
                    {social.icon}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-yellow-500 mb-6">
              Enlaces Rápidos
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-yellow-500 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold text-yellow-500 mb-6">
              Nuestros Servicios
            </h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.name}>
                  <Link
                    to={service.path}
                    className="text-gray-300 hover:text-yellow-500 transition-colors"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-yellow-500 mb-6">
              Información de Contacto
            </h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <HiMapPin className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">
                    Canelones 1033
                    <br />
                    Wilson Ferreira Aldunate 1238
                    <br />
                    Montevideo, Uruguay
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <HiPhone className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                <p className="text-gray-300">+598 028 302</p>
              </div>

              <div className="flex items-center space-x-3">
                <HiEnvelope className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                <p className="text-gray-300">tatutaller@gmail.com</p>
              </div>

              <div className="flex items-start space-x-3">
                <HiClock className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">
                    Lun - Vi: 10:00 - 20:00
                    <br />
                    Sáb - Dom: Cerrado
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                © {currentYear} Tatú Taller. Todos los derechos reservados.
              </p>
            </div>

            <div className="mt-4 md:mt-0 flex items-center justify-center md:justify-end space-x-1 text-gray-400 text-sm">
              <span>Hecho con</span>
              <HiHeart className="w-4 h-4 text-red-500" />
              <span>en Uruguay</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-center md:justify-between items-center space-y-2 md:space-y-0">
              <div className="flex space-x-4 text-xs text-gray-400">
                <Link
                  to="/privacy"
                  className="hover:text-yellow-500 transition-colors"
                >
                  Política de Privacidad
                </Link>
                <Link
                  to="/terms"
                  className="hover:text-yellow-500 transition-colors"
                >
                  Términos de Servicio
                </Link>
                <Link
                  to="/cookies"
                  className="hover:text-yellow-500 transition-colors"
                >
                  Política de Cookies
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
