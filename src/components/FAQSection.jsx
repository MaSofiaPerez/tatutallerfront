import { useState } from "react";
import { HiChevronDown, HiChevronUp } from "react-icons/hi2";

function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "¿Cómo prepararme para mi primera clase de cerámica?",
      answer:
        "Solo necesitas traer ropa cómoda que se pueda ensuciar o un delantal. Nosotros proporcionamos todos los materiales: arcilla, herramientas y acceso al torno. Es recomendable llegar con las uñas cortas y el cabello recogido.",
    },
    {
      question: "¿Cuánto tiempo tarda en cocerse una pieza?",
      answer:
        "El proceso completo incluye secado (1-2 semanas), primera cocción o bizcochado (8-12 horas), esmaltado y segunda cocción (8-10 horas). En total, una pieza puede tardar entre 3-4 semanas desde su creación hasta estar lista.",
    },
    {
      question: "¿Qué cuidados necesita una pieza antes de la cocción?",
      answer:
        "Debe secarse lentamente y de manera uniforme para evitar grietas. La cubrimos con plástico húmedo y la dejamos secar gradualmente. Es importante que no tenga burbujas de aire ni partes muy gruesas que puedan explotar en el horno.",
    },
    {
      question: "¿Es difícil aprender a usar el torno?",
      answer:
        "El torno requiere práctica y paciencia, pero con nuestras clases progresivas cualquier persona puede aprender. Comenzamos con técnicas básicas de centrado y vamos avanzando gradualmente. La mayoría logra hacer su primera pieza en las primeras clases.",
    },
    {
      question: "¿Puedo crear mis propios diseños?",
      answer:
        "¡Absolutamente! Nos encanta trabajar con las ideas de nuestros estudiantes. Puedes traer referencias, bocetos o ideas para tus piezas. Nuestros ceramistas te ayudarán a adaptar y perfeccionar el diseño según las posibilidades técnicas de la cerámica.",
    },
    {
      question: "¿Qué incluye el precio de las clases?",
      answer:
        "El precio incluye todos los materiales (arcilla, herramientas, esmaltes), uso del torno, cocción de las piezas y asesoramiento personalizado. También incluye las primeras cocciones y los materiales básicos para comenzar.",
    },
    {
      question: "¿Hay clases para niños?",
      answer:
        "Sí, ofrecemos clases especiales para niños a partir de 8 años con técnicas adaptadas a su edad. Los menores de 12 años deben estar acompañados por un adulto. Tenemos programas específicos para diferentes grupos etarios.",
    },
    {
      question: "¿Qué medidas de seguridad toman en el taller?",
      answer:
        "Mantenemos un ambiente seguro con ventilación adecuada, equipos de protección personal, protocolos de manejo de hornos y materiales, y todas las medidas de seguridad industrial necesarias para el trabajo con cerámica.",
    },
    {
      question: "¿Cómo reservo una clase?",
      answer:
        "Puedes reservar tu clase llamando al taller, enviando un WhatsApp, o usando nuestro sistema de reservas online. Recomendamos agendar con anticipación, especialmente para cursos intensivos o masterclasses.",
    },
    {
      question: "¿Qué pasa si necesito cancelar o reprogramar mi clase?",
      answer:
        "Entendemos que pueden surgir imprevistos. Pedimos aviso con al menos 24 horas de anticipación para cancelaciones. Para reprogramar, contacta lo antes posible. Las cancelaciones de último minuto pueden estar sujetas a una tarifa.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Preguntas Frecuentes
          </h2>
          <div className="w-24 h-1 bg-yellow-500 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Resolvemos las dudas más comunes sobre nuestros servicios y el
            proceso de tatuaje
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
            >
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors"
                onClick={() => toggleFAQ(index)}
              >
                <span className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </span>
                <span className="flex-shrink-0">
                  {openIndex === index ? (
                    <HiChevronUp className="w-5 h-5 text-yellow-600" />
                  ) : (
                    <HiChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </span>
              </button>

              {openIndex === index && (
                <div className="px-6 pb-4">
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <div className="bg-yellow-50 rounded-lg p-8 border border-yellow-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              ¿Tienes más preguntas?
            </h3>
            <p className="text-gray-600 mb-6">
              Nuestro equipo está aquí para ayudarte con cualquier duda
              adicional
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-6 py-3 rounded-lg font-semibold transition-colors">
                Contactar por WhatsApp
              </button>
              <button className="border-2 border-yellow-500 text-yellow-700 hover:bg-yellow-500 hover:text-gray-900 px-6 py-3 rounded-lg font-semibold transition-colors">
                Llamar al Taller
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FAQSection;
