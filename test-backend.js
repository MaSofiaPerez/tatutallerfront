// Script temporal para probar la conectividad con el backend
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

async function testBackend() {
  console.log('🔍 Probando conectividad con el backend...');
  
  try {
    // Test 1: Verificar que el servidor responda
    console.log('\n1. Verificando servidor...');
    const response = await axios.get(`${BASE_URL}/products`, { timeout: 5000 });
    console.log('✅ Servidor respondiendo:', response.status);
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Backend no está ejecutándose en localhost:8080');
      console.log('   Asegúrate de que tu aplicación Spring Boot esté corriendo');
      return;
    } else if (error.response) {
      console.log('✅ Servidor respondiendo con status:', error.response.status);
    } else {
      console.log('❌ Error de conexión:', error.message);
      return;
    }
  }

  // Test 2: Probar endpoint de productos
  try {
    console.log('\n2. Probando endpoint /api/products...');
    const response = await axios.get(`${BASE_URL}/products`);
    console.log('✅ Productos obtenidos:', response.data?.length || 'Sin datos');
  } catch (error) {
    console.log('❌ Error en /api/products:', error.response?.status || error.message);
  }

  // Test 3: Probar endpoint de clases
  try {
    console.log('\n3. Probando endpoint /api/classes...');
    const response = await axios.get(`${BASE_URL}/classes`);
    console.log('✅ Clases obtenidas:', response.data?.length || 'Sin datos');
  } catch (error) {
    console.log('❌ Error en /api/classes:', error.response?.status || error.message);
  }

  // Test 4: Probar endpoint de login (debe estar público)
  try {
    console.log('\n4. Probando endpoint /api/auth/login (debe dar error 400 o 401)...');
    const response = await axios.post(`${BASE_URL}/auth/login`, {});
    console.log('❓ Respuesta inesperada:', response.status);
  } catch (error) {
    if (error.response?.status === 400 || error.response?.status === 401) {
      console.log('✅ Endpoint de login funcionando (error esperado por credenciales vacías)');
    } else {
      console.log('❌ Error en /api/auth/login:', error.response?.status || error.message);
    }
  }

  // Test 5: Probar endpoint de registro (debe estar público)
  try {
    console.log('\n5. Probando endpoint /api/auth/register (debe dar error 400)...');
    const response = await axios.post(`${BASE_URL}/auth/register`, {});
    console.log('❓ Respuesta inesperada:', response.status);
  } catch (error) {
    if (error.response?.status === 400) {
      console.log('✅ Endpoint de registro funcionando (error esperado por datos vacíos)');
    } else {
      console.log('❌ Error en /api/auth/register:', error.response?.status || error.message);
    }
  }

  console.log('\n✨ Test completado');
}

testBackend().catch(console.error);
