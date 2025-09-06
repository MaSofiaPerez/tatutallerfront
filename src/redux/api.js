import axios from "axios";
import { API_BASE_URL } from "../utils/apiBase";

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 50000,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default apiClient;
export { apiClient }; // <-- así puedes importar por nombre o por default
