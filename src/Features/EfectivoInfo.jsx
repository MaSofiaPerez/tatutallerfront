import React from "react";

function EfectivoInfo() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full text-center">
        <h1 className="text-3xl font-bold text-green-700 mb-4">
          ¡Pedido realizado con éxito!
        </h1>
        <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-green-100 rounded-full">
          <svg
            className="w-10 h-10 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <p className="text-lg text-gray-700 mb-6">
          Tu pedido fue enviado correctamente y está siendo procesado.
          <br />
          <span className="font-semibold">Forma de pago: Efectivo</span>
        </p>
        <div className="text-left text-gray-600 mb-6">
          <ul className="list-disc list-inside">
            <li>Recibirás un email con los detalles de tu pedido.</li>
            <li>
              El pago se realiza en efectivo al momento de la entrega o retiro.
            </li>
            <li>Si tienes dudas, contáctanos por WhatsApp o email.</li>
          </ul>
        </div>
        <a
          href="/tienda"
          className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-all"
        >
          Volver a la tienda
        </a>
      </div>
    </div>
  );
}

export default EfectivoInfo;
