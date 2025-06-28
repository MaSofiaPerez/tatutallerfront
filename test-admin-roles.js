// Test para verificar roles de usuario en el backend
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

async function testUserRoles() {
  console.log('🔍 INVESTIGANDO ROLES DE USUARIO EN EL BACKEND\n');

  // Crear un usuario normal para ver su estructura
  console.log('1️⃣ Creando usuario normal...');
  const normalUser = {
    name: 'Usuario Normal',
    email: `normal${Date.now()}@test.com`,
    password: 'test123',
    phone: '+1111111111'
  };

  try {
    const response = await apiClient.post('/auth/register', normalUser);
    console.log('✅ Usuario normal creado:');
    console.log('   Role:', response.data.user.role);
    console.log('   User data:', JSON.stringify(response.data.user, null, 2));
  } catch (error) {
    console.log('❌ Error creando usuario normal:', error.response?.data);
  }

  // Intentar crear o encontrar un usuario admin
  console.log('\n2️⃣ Probando con posibles usuarios admin existentes...');
  
  const possibleAdmins = [
    { email: 'admin@admin.com', password: 'admin' },
    { email: 'admin@test.com', password: 'admin123' },
    { email: 'admin@tatutal.com', password: 'admin' },
    { email: 'sofia@admin.com', password: 'admin' },
    { email: 'test@admin.com', password: 'admin123' },
  ];

  for (const admin of possibleAdmins) {
    try {
      console.log(`   Probando: ${admin.email} / ${admin.password}`);
      const response = await apiClient.post('/auth/login', admin);
      console.log('✅ USUARIO ADMIN ENCONTRADO!');
      console.log('   Email:', admin.email);
      console.log('   Password:', admin.password);
      console.log('   Response:', JSON.stringify(response.data, null, 2));
      
      if (response.data.user) {
        console.log('   Role en respuesta:', response.data.user.role);
        console.log('   Es admin?:', response.data.user.role === 'ADMIN');
        console.log('   Es admin (minúscula)?:', response.data.user.role === 'admin');
      }
      break;
    } catch (error) {
      console.log(`   ❌ ${error.response?.data?.message || 'Error'}`);
    }
  }

  console.log('\n3️⃣ Información para debuggear el frontend:');
  console.log(`
  📋 PARA PROBAR EN EL FRONTEND:
  
  1. Abre la consola del navegador en http://localhost:5173/login
  2. Ejecuta esto para ver el estado de Redux:
     
     // En la consola del navegador:
     window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ && console.log(store.getState().auth);
  
  3. Intenta hacer login con algún usuario y mira:
     - El valor de isAuthenticated
     - El valor de isAdmin
     - Los datos del user.role
     
  4. Si tienes acceso al backend, verifica:
     - ¿Hay usuarios con role 'ADMIN' en la base de datos?
     - ¿El endpoint de login devuelve correctamente el role?
  `);
}

testUserRoles().catch(console.error);
