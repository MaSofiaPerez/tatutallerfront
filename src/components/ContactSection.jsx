import { useState } from "react";
import {
  HiMapPin,
  HiPhone,
  HiEnvelope,
  HiClock,
  HiPaperAirplane,
} from "react-icons/hi2";
import { FaWhatsapp, FaFacebook, FaInstagram } from "react-icons/fa";

function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    subject: "consulta",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el formulario
    console.log("Formulario enviado:", formData);
    alert("¡Mensaje enviado! Te contactaremos pronto.");
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
      subject: "consulta",
    });
  };

  const contactInfo = [
    {
      icon: HiMapPin,
      title: "Dirección",
      content: "Canelones 1033, Montevideo, Uruguay",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: HiPhone,
      title: "Teléfono",
      content: "+598 98 028 302",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: HiEnvelope,
      title: "Email",
      content: "tatutaller@gmail.com",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      icon: HiClock,
      title: "Horarios",
      content: "Lun-Vi: 10:00-20:00",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <section className="py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Contáctanos
          </h2>
          <div className="w-24 h-1 bg-yellow-500 mx-auto mb-6"></div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            ¿Listo para comenzar tu próximo proyecto en cerámica? Estamos aquí
            para ayudarte en cada paso del proceso creativo
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Envíanos un mensaje
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nombre completo *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                  placeholder="Tu nombre completo"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                    placeholder="Tu número de teléfono"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Motivo de consulta
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                >
                  <option value="consulta">Consulta general</option>
                  <option value="cowork">Alquiler de espacio de trabajo</option>
                  <option value="clase">Información sobre clases</option>
                  <option value="pieza">Encargo de pieza personalizada</option>
                  <option value="coccion">Servicio de cocción</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Mensaje *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors resize-none"
                  placeholder="Cuéntanos sobre tu proyecto en cerámica, dudas sobre clases, o cualquier información que nos ayude a brindarte un mejor servicio..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <HiPaperAirplane className="w-5 h-5" />
                Enviar mensaje
              </button>
            </form>
          </div>

          {/* Contact Information & Map */}
          <div className="space-y-8">
            {/* Contact Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              {contactInfo.map((info, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                  <div
                    className={`w-12 h-12 ${info.bgColor} rounded-lg flex items-center justify-center mb-4`}
                  >
                    <info.icon className={`w-6 h-6 ${info.color}`} />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {info.title}
                  </h4>
                  <p className="text-gray-600">{info.content}</p>
                </div>
              ))}
            </div>

            {/* Map placeholder */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h4 className="font-semibold text-gray-900 mb-4">Ubicación</h4>
              <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden">
                {/* Placeholder para mapa - en una app real usarías Google Maps o similar */}
                <div className="w-full h-64 bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                  <div className="text-center text-gray-600">
                    <HiMapPin className="w-12 h-12 mx-auto mb-2" />
                    <p className="font-medium">Mapa interactivo</p>
                    <p className="text-sm">Canelones 1033 esq. Rio Negro</p>
                    <p className="text-sm">
                      Wilson Ferreira Aldunate 1238 esq. Soriano
                    </p>
                    <p className="text-sm">Montevideo, Uruguay</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media & Additional Info */}
            <div className="bg-yellow-500 rounded-xl p-6 text-gray-900">
              <h4 className="font-bold text-xl mb-4">¡Síguenos en redes!</h4>
              <p className="mb-4">
                Mantente al día con nuestros trabajos más recientes y
                promociones especiales.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://www.instagram.com/tatutaller"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                  <FaInstagram className="w-5 h-5" />
                  Instagram
                </a>
                <a
                  href="https://www.facebook.com/share/1FshwF9AD9/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                  <FaFacebook className="w-5 h-5" />
                  Facebook
                </a>
                <a
                  href="https://wa.me/59898028302"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                  <FaWhatsapp className="w-5 h-5" />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
