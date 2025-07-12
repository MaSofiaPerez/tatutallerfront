import axios from 'axios';

// Base URL de tu API - Spring Boot backend
const API_BASE_URL = 'http://Tatutallerapp-env.eba-txcpu5py.us-east-1.elasticbeanstalk.com';

// Configurar axios interceptor para incluir token en todas las requests
export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000, // 10 segundos de timeout
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // console.log('🔄 Request:', config.method.toUpperCase(), config.url, config.data);
  return config;
});

// Interceptor para respuestas
apiClient.interceptors.response.use(
  (response) => {
    // console.log('✅ Response:', response.status, response.data);
    return response;
  },
  (error) => {
    // console.error('❌ Error Response:', {
    //   status: error.response?.status,
    //   data: error.response?.data,
    //   message: error.message
    // });
    return Promise.reject(error);
  }
);

export default apiClient;
