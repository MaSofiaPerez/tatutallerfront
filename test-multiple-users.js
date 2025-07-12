// Test con diferentes usuarios y credenciales
import axios from 'axios';

const API_BASE_URL = 'https://Tatutallerapp-env.eba-txcpu5py.us-east-1.elasticbeanstalk.com/api';
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  console.log('🔄', config.method.toUpperCase(), config.url);
  return config;
});

async function testMultipleUsers() {
  console.log('🧪 Probando con múltiples usuarios...\n');

  // Usuarios comunes para probar
  const testUsers = [
    { email: 'admin@test.com', password: 'admin123' },
    { email: 'admin@admin.com', password: 'admin' },
    { email: 'test@test.com', password: 'test123' },
    { email: 'user@test.com', password: 'password' },
    { email: 'test@example.com', password: '123456' },
  ];

  for (const user of testUsers) {
    console.log(`Probando: ${user.email} / ${user.password}`);
    try {
      const response = await apiClient.post('/auth/login', user);
      console.log('✅ LOGIN EXITOSO!', {
        email: user.email,
        token: response.data.token ? '✓' : '✗',
        user: response.data.user ? '✓' : '✗',
        data: response.data
      });
      break; // Si encontramos uno que funciona, paramos
    } catch (error) {
      console.log('❌', error.response?.data?.message || 'Error');
    }
  }

  // Probar crear un usuario nuevo
  console.log('\n📝 Probando crear usuario nuevo...');
  const newUser = {
    name: 'Usuario Nuevo',
    email: `test${Date.now()}@test.com`, // Email único con timestamp
    password: 'password123',
    phone: '+1234567890'
  };

  try {
    console.log(`Creando: ${newUser.email}`);
    const response = await apiClient.post('/auth/register', newUser);
    console.log('✅ REGISTRO EXITOSO!', response.data);
    
    // Si el registro fue exitoso, probar login inmediatamente
    console.log('\n🔐 Probando login con el usuario recién creado...');
    try {
      const loginResponse = await apiClient.post('/auth/login', {
        email: newUser.email,
        password: newUser.password
      });
      console.log('✅ LOGIN EXITOSO!', loginResponse.data);
      
      // Probar endpoint protegido
      const token = loginResponse.data.token || loginResponse.data.access_token || loginResponse.data.jwt;
      if (token) {
        console.log('\n🛡️ Probando endpoint protegido...');
        try {
          const protectedResponse = await apiClient.get('/products', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          console.log('✅ Productos obtenidos:', protectedResponse.data?.length || 'Sin datos');
        } catch (error) {
          console.log('❌ Error en productos:', error.response?.status);
        }
      }
    } catch (error) {
      console.log('❌ Error en login:', error.response?.data?.message);
    }
  } catch (error) {
    console.log('❌ Error en registro:', error.response?.data?.message);
  }
}

testMultipleUsers().catch(console.error);
