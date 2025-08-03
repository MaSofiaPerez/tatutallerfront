import { useState } from "react";
import { HiMapPin, HiPhone, HiEnvelope } from "react-icons/hi2";
import { FaWhatsapp, FaFacebook, FaInstagram } from "react-icons/fa";
import InteractiveMap from "./InteractiveMap";

function ContactSection() {
  const contactInfo = [
    {
      icon: HiMapPin,
      title: "Ubicaciones",
      content: "Canelones 1033 • Wilson Ferreira Aldunate 1238",
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

        {/* Contact Information & Map */}
        <div className="space-y-8">
          {/* Contact Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg text-center"
              >
                <div
                  className={`w-12 h-12 ${info.bgColor} rounded-lg flex items-center justify-center mx-auto mb-4`}
                >
                  <info.icon className={`w-6 h-6 ${info.color}`} />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2 text-base">
                  {info.title}
                </h4>
                <p className="text-gray-600 text-sm">{info.content}</p>
              </div>
            ))}
          </div>

          {/* Map */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h4 className="font-semibold text-gray-900 mb-4">Ubicación</h4>
            <div className="h-64 bg-gray-200 rounded-lg overflow-hidden">
              <InteractiveMap />
            </div>
          </div>

          {/* Social Media - Compact */}
          <div className="flex justify-center">
            <div className="bg-yellow-500 rounded-xl p-6 text-gray-900 text-center inline-block">
              <h4 className="font-bold text-xl mb-3">¡Síguenos en redes!</h4>
              <p className="mb-4 text-sm">
                Mantente al día con nuestros trabajos más recientes
              </p>
              <div className="flex gap-3">
                <a
                  href="https://www.instagram.com/tatutaller"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 text-sm"
                >
                  <FaInstagram className="w-4 h-4" />
                  Instagram
                </a>
                <a
                  href="https://www.facebook.com/share/1FshwF9AD9/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 text-sm"
                >
                  <FaFacebook className="w-4 h-4" />
                  Facebook
                </a>
                <a
                  href="https://wa.me/59898028302"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 text-sm"
                >
                  <FaWhatsapp className="w-4 h-4" />
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
