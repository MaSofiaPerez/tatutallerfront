// Devuelve la URL base del backend según el entorno

const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

export const API_BASE_URL = isLocal
  ? "http://localhost:8080" 
  : "https://tatuback.us-east-2.elasticbeanstalk.com";