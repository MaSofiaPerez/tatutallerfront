// Script para probar el registro frontend con observación de resultados
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

async function testFrontendRegistration() {
  console.log('📝 Probando registro para verificar toasts...\n');

  // Generar datos únicos para el test
  const timestamp = Date.now();
  const testUser = {
    name: 'Usuario Toast Test',
    email: `toasttest${timestamp}@test.com`,
    password: 'password123',
    phone: '+1234567890'
  };

  console.log(`🧪 Datos de prueba:
  Nombre: ${testUser.name}
  Email: ${testUser.email}
  Contraseña: ${testUser.password}
  Teléfono: ${testUser.phone}`);

  console.log('\n🚀 Simulando el mismo flujo que el frontend...');

  try {
    // Simulamos exactamente lo que hace el frontend
    console.log('1. Enviando petición de registro...');
    const response = await apiClient.post('/auth/register', testUser);
    
    console.log('✅ Respuesta exitosa del backend:');
    console.log('   Status:', response.status);
    console.log('   Data:', JSON.stringify(response.data, null, 2));
    
    // Verificar qué tipo de respuesta es para entender cómo el frontend la procesa
    if (response.data.token) {
      console.log('\n🔐 Token encontrado en respuesta - Usuario debería ser autenticado automáticamente');
    } else if (response.data.message && response.data.user) {
      console.log('\n📧 Solo mensaje y datos de usuario - Usuario debe hacer login manual');
    } else {
      console.log('\n❓ Formato de respuesta inesperado');
    }

    // Ahora probemos el login si no hay token automático
    if (!response.data.token) {
      console.log('\n2. Probando login con el usuario recién creado...');
      try {
        const loginResponse = await apiClient.post('/auth/login', {
          email: testUser.email,
          password: testUser.password
        });
        console.log('✅ Login exitoso:');
        console.log('   Data:', JSON.stringify(loginResponse.data, null, 2));
      } catch (loginError) {
        console.log('❌ Error en login:');
        console.log('   Status:', loginError.response?.status);
        console.log('   Message:', loginError.response?.data?.message);
        console.log('   Full error:', loginError.response?.data);
      }
    }

  } catch (error) {
    console.log('❌ Error en registro:');
    console.log('   Status:', error.response?.status);
    console.log('   Message:', error.response?.data?.message);
    console.log('   Full error:', error.response?.data);
  }

  console.log('\n📋 INSTRUCCIONES PARA PROBAR EN EL NAVEGADOR:');
  console.log(`
  1. Ve a: http://localhost:5175/register
  2. Llena el formulario con:
     - Nombre: ${testUser.name}
     - Email: ${testUser.email}
     - Contraseña: ${testUser.password}
     - Confirmar contraseña: ${testUser.password}
     - Teléfono: ${testUser.phone}
  3. Envía el formulario
  4. Observa el toast que aparece
  5. Si te redirige a login, usa las mismas credenciales
  `);
}

testFrontendRegistration().catch(console.error);
