// Probar diferentes rutas de autenticación
import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

async function testAuthRoutes() {
  console.log('🔍 Probando diferentes rutas de autenticación...');
  
  const routes = [
    '/api/auth/login',
    '/auth/login',
    '/login',
    '/api/login',
    '/api/user/login',
    '/api/auth/signin',
    '/signin'
  ];

  for (const route of routes) {
    try {
      console.log(`\nProbando: ${BASE_URL}${route}`);
      const response = await axios.post(`${BASE_URL}${route}`, {
        email: 'test@test.com',
        password: 'test123'
      }, { 
        timeout: 3000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('✅ Respuesta:', response.status, response.data);
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        if (status === 400 || status === 401 || status === 422) {
          console.log('✅ Endpoint encontrado! Status:', status, '(error esperado por credenciales incorrectas)');
        } else if (status === 403) {
          console.log('⚠️  403 Forbidden');
        } else if (status === 404) {
          console.log('❌ 404 Not Found');
        } else {
          console.log('❓ Status:', status);
        }
      } else if (error.code === 'ECONNREFUSED') {
        console.log('❌ Conexión rechazada');
        break;
      } else {
        console.log('❌ Error:', error.message);
      }
    }
  }

  // Probar también rutas de registro
  console.log('\n📝 Probando rutas de registro...');
  const registerRoutes = [
    '/api/auth/register',
    '/auth/register',
    '/register',
    '/api/register',
    '/api/user/register',
    '/api/auth/signup',
    '/signup'
  ];

  for (const route of registerRoutes) {
    try {
      console.log(`\nProbando: ${BASE_URL}${route}`);
      const response = await axios.post(`${BASE_URL}${route}`, {
        name: 'Test User',
        email: 'test@test.com',
        password: 'test123'
      }, { 
        timeout: 3000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('✅ Respuesta:', response.status, response.data);
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        if (status === 400 || status === 409 || status === 422) {
          console.log('✅ Endpoint encontrado! Status:', status, '(error esperado)');
        } else if (status === 403) {
          console.log('⚠️  403 Forbidden');
        } else if (status === 404) {
          console.log('❌ 404 Not Found');
        } else {
          console.log('❓ Status:', status);
        }
      } else if (error.code === 'ECONNREFUSED') {
        console.log('❌ Conexión rechazada');
        break;
      } else {
        console.log('❌ Error:', error.message);
      }
    }
  }
}

testAuthRoutes().catch(console.error);
