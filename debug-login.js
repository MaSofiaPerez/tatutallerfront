// Investigación detallada del problema de login
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor detallado para capturar TODO
apiClient.interceptors.request.use((config) => {
  console.log('\n🔍 REQUEST DETAILS:');
  console.log('  URL:', config.baseURL + config.url);
  console.log('  Method:', config.method.toUpperCase());
  console.log('  Headers:', JSON.stringify(config.headers, null, 2));
  console.log('  Data:', JSON.stringify(config.data, null, 2));
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    console.log('\n✅ RESPONSE DETAILS:');
    console.log('  Status:', response.status);
    console.log('  Headers:', JSON.stringify(response.headers, null, 2));
    console.log('  Data:', JSON.stringify(response.data, null, 2));
    return response;
  },
  (error) => {
    console.log('\n❌ ERROR DETAILS:');
    console.log('  Status:', error.response?.status);
    console.log('  Headers:', JSON.stringify(error.response?.headers, null, 2));
    console.log('  Data:', JSON.stringify(error.response?.data, null, 2));
    console.log('  Message:', error.message);
    return Promise.reject(error);
  }
);

async function investigateLoginProblem() {
  console.log('🔍 INVESTIGACIÓN DETALLADA DEL PROBLEMA DE LOGIN\n');

  // Crear un usuario nuevo para la investigación
  const timestamp = Date.now();
  const testUser = {
    name: 'Debug User',
    email: `debug${timestamp}@test.com`,
    password: 'debug123',
    phone: '+9999999999'
  };

  console.log('📝 Paso 1: Crear usuario para debugging');
  console.log('Datos:', JSON.stringify(testUser, null, 2));

  try {
    // Registro
    console.log('\n🚀 Ejecutando registro...');
    const registerResponse = await apiClient.post('/auth/register', testUser);
    
    console.log('✅ Usuario creado exitosamente');
    const createdUser = registerResponse.data.user;
    
    // Intentar login inmediatamente con los mismos datos
    console.log('\n🔐 Paso 2: Intentar login inmediatamente');
    console.log('Enviando exactamente los mismos datos de login...');
    
    try {
      const loginData = {
        email: testUser.email,
        password: testUser.password
      };
      
      console.log('Datos de login:', JSON.stringify(loginData, null, 2));
      const loginResponse = await apiClient.post('/auth/login', loginData);
      
      console.log('🎉 ¡LOGIN EXITOSO! El problema está resuelto.');
      
    } catch (loginError) {
      console.log('\n🚨 LOGIN FALLÓ - ANALIZANDO PROBLEMA...');
      
      // Analizar posibles causas
      console.log('\n🔬 ANÁLISIS DE POSIBLES CAUSAS:');
      
      console.log('\n1. ¿Problema de encoding de contraseña?');
      console.log('   Contraseña original:', testUser.password);
      console.log('   Contraseña length:', testUser.password.length);
      console.log('   Contraseña bytes:', [...testUser.password].map(c => c.charCodeAt(0)));
      
      console.log('\n2. ¿Problema de email?');
      console.log('   Email original:', testUser.email);
      console.log('   Email creado en BD:', createdUser.email);
      console.log('   Emails coinciden:', testUser.email === createdUser.email);
      
      console.log('\n3. ¿Problema de estado de usuario?');
      console.log('   Estado:', createdUser.status);
      console.log('   Rol:', createdUser.role);
      
      console.log('\n4. ¿Problema de headers?');
      console.log('   Content-Type enviado:', loginError.config?.headers?.['Content-Type']);
      
      console.log('\n5. Intentar variaciones...');
      
      // Intentar con email en minúsculas
      try {
        console.log('\n   🔄 Probando email en minúsculas...');
        await apiClient.post('/auth/login', {
          email: testUser.email.toLowerCase(),
          password: testUser.password
        });
        console.log('   ✅ Funcionó con email en minúsculas');
      } catch (e) {
        console.log('   ❌ Falló con email en minúsculas');
      }
      
      // Intentar sin Content-Type
      try {
        console.log('\n   🔄 Probando sin Content-Type header...');
        const noHeaderClient = axios.create({
          baseURL: API_BASE_URL,
          timeout: 10000,
        });
        await noHeaderClient.post('/auth/login', {
          email: testUser.email,
          password: testUser.password
        });
        console.log('   ✅ Funcionó sin Content-Type');
      } catch (e) {
        console.log('   ❌ Falló sin Content-Type');
      }
      
      // Intentar como form data
      try {
        console.log('\n   🔄 Probando como form data...');
        const formData = new URLSearchParams();
        formData.append('email', testUser.email);
        formData.append('password', testUser.password);
        
        const formClient = axios.create({
          baseURL: API_BASE_URL,
          timeout: 10000,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
        await formClient.post('/auth/login', formData);
        console.log('   ✅ Funcionó como form data');
      } catch (e) {
        console.log('   ❌ Falló como form data');
      }
    }
    
  } catch (registerError) {
    console.log('❌ Error en registro:', registerError.response?.data);
  }
}

investigateLoginProblem().catch(console.error);
