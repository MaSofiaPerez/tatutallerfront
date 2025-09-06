// Devuelve la URL base del backend según el entorno

const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

export const API_BASE_URL = isLocal
  ? "http://localhost:8081" 
  : "https://app.tatutaller.com.uy";

// Utility function to get the full image URL
export function getImageUrl(imageUrl) {
  if (!imageUrl) return "/placeholder.jpg";
  if (imageUrl.startsWith("http")) return imageUrl;
  // Si ya empieza con /api, no agregues nada extra
  if (imageUrl.startsWith("/api/")) {
    return `${API_BASE_URL}${imageUrl}`;
  }
  // Si empieza con /imagenes, agrega /api delante
  if (imageUrl.startsWith("/imagenes")) {
    return `${API_BASE_URL}/api${imageUrl}`;
  }
  // Fallback
  return `${API_BASE_URL}/api/${imageUrl.startsWith("/") ? imageUrl.slice(1) : imageUrl}`;
}