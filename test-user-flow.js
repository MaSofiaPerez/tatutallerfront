// Test directo con nuestro API client
import axios from 'axios';

// Replicar la configuración exacta del frontend
const API_BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  console.log('🔄 Request:', config.method.toUpperCase(), config.url, config.data);
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('❌ Error Response:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

async function testUserFlow() {
  console.log('🧪 Probando flujo completo de usuario...\n');

  // Test 1: Registro
  console.log('1️⃣ Probando registro...');
  try {
    const registerResponse = await apiClient.post('/auth/register', {
      name: 'Usuario Test',
      email: 'test@test.com',
      password: 'password123',
      phone: '+1234567890'
    });
    console.log('✅ Registro exitoso:', registerResponse.data);
  } catch (error) {
    console.log('❌ Error en registro. Continuando con login...');
  }

  // Test 2: Login
  console.log('\n2️⃣ Probando login...');
  try {
    const loginResponse = await apiClient.post('/auth/login', {
      email: 'test@test.com',
      password: 'password123'
    });
    console.log('✅ Login exitoso:', loginResponse.data);
    
    // Simular guardar token
    const token = loginResponse.data.token || loginResponse.data.access_token || loginResponse.data.jwt;
    if (token) {
      console.log('🔐 Token obtenido:', token.substring(0, 20) + '...');
      
      // Test 3: Probar endpoint protegido
      console.log('\n3️⃣ Probando endpoint protegido con token...');
      try {
        const protectedResponse = await apiClient.get('/products', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('✅ Endpoint protegido funcionando:', protectedResponse.data?.length || 'Sin datos');
      } catch (error) {
        console.log('❌ Error en endpoint protegido');
      }
    }
  } catch (error) {
    console.log('❌ Error en login');
  }

  console.log('\n✨ Test completado');
}

testUserFlow().catch(console.error);
