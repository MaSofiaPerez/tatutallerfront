import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix para los iconos de Leaflet en React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Icono personalizado para el taller
const createCustomIcon = (color = "#dc2626") => {
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          color: white;
          font-size: 14px;
          font-weight: bold;
          transform: rotate(45deg);
        ">🏺</div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
};

function InteractiveMap() {
  // Ubicaciones del taller - Direcciones reales
  const tallerLocations = [
    {
      id: 1,
      name: "TatuTaller",
      address: "Wilson Ferreira Aldunate 1238, Montevideo",
      coordinates: [-34.90820560176461, -56.195351189895334],
    },
    {
      id: 2,
      name: "TatuTaller",
      address: "Canelones 1033, Montevideo",
      coordinates: [-34.908666899314554, -56.19362673037519],
    },
  ];

  // Centro del mapa (punto medio entre las dos ubicaciones reales)
  const mapCenter = [-34.905, -56.1896];

  const openInGoogleMaps = (coordinates, address) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${coordinates[0]},${coordinates[1]}`;
    window.open(url, "_blank");
  };

  return (
    <div className="w-full h-full">
      <MapContainer
        center={mapCenter}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {tallerLocations.map((location, index) => (
          <Marker
            key={location.id}
            position={location.coordinates}
            icon={createCustomIcon(index === 0 ? "#dc2626" : "#7c2d12")}
          >
            <Popup className="custom-popup">
              <div className="p-2 min-w-[200px]">
                <h3 className="font-bold text-base mb-2 text-gray-900">
                  {location.name}
                </h3>
                <p className="text-gray-600 mb-2 text-sm flex items-center">
                  <svg
                    className="w-3 h-3 mr-1 text-yellow-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 2C7.79 2 6 3.79 6 6c0 3.75 4 8 4 8s4-4.25 4-8c0-2.21-1.79-4-4-4zm0 5.5c-.83 0-1.5-.67-1.5-1.5S9.17 4.5 10 4.5s1.5.67 1.5 1.5S10.83 7.5 10 7.5z" />
                  </svg>
                  {location.address}
                </p>
                <p className="text-gray-600 mb-2 text-sm flex items-center">
                  <svg
                    className="w-3 h-3 mr-1 text-yellow-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 3c0-.55.45-1 1-1h2c.55 0 1 .45 1 1 0 .99.99 2 2.99 2 1.98 0 2.99-1.01 2.99-2 0-.55.45-1 1-1h2c.55 0 1 .45 1 1v4c0 .55-.45 1-1 1h-2c-.55 0-1-.45-1-1 0-.99-.99-2-2.99-2-1.98 0-2.99 1.01-2.99 2 0 .55-.45 1-1 1H3c-.55 0-1-.45-1-1V3z" />
                  </svg>
                  {location.phone}
                </p>
                <p className="text-gray-600 mb-3 text-sm flex items-center">
                  <svg
                    className="w-3 h-3 mr-1 text-yellow-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
                  </svg>
                  {location.hours}
                </p>
                <button
                  onClick={() =>
                    openInGoogleMaps(location.coordinates, location.address)
                  }
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Cómo llegar
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default InteractiveMap;
