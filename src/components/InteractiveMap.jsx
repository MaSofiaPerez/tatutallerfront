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

// Icono personalizado para el taller con logo
const createCustomIcon = (color = "#dc2626") => {
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        background-color: white;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: 4px solid ${color};
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      ">
        <img 
          src="/img/imageslogotatu.png" 
          alt="TatuTaller Logo" 
          style="
            width: 35px;
            height: 35px;
            object-fit: contain;
          "
        />
      </div>
    `,
    iconSize: [50, 50],
    iconAnchor: [25, 25],
    popupAnchor: [0, -25],
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
  const mapCenter = [-34.90843625, -56.19448896];

  const openInGoogleMaps = (coordinates, address) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${coordinates[0]},${coordinates[1]}`;
    window.open(url, "_blank");
  };

  return (
    <div className="w-full h-full">
      <MapContainer
        center={mapCenter}
        zoom={17}
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
