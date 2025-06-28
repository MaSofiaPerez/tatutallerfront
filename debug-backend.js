// Test script para verificar endpoints del backend
// Ejecutar en la consola del navegador

async function testBackendEndpoints() {
    const baseURL = 'http://localhost:8080'; // Ajusta la URL según tu backend
    const token = localStorage.getItem('token');
    
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };

    console.log('🔍 Probando endpoints del backend...');
    console.log('Token:', token ? 'Presente' : 'No encontrado');

    // Test 1: Verificar endpoint de teachers
    try {
        console.log('\n📚 Probando /admin/teachers...');
        const teachersResponse = await fetch(`${baseURL}/admin/teachers`, { headers });
        console.log('Status:', teachersResponse.status);
        if (teachersResponse.ok) {
            const teachersData = await teachersResponse.json();
            console.log('Teachers data:', teachersData);
        } else {
            console.log('Error response:', await teachersResponse.text());
        }
    } catch (error) {
        console.log('Error al llamar /admin/teachers:', error);
    }

    // Test 2: Verificar endpoint de usuarios
    try {
        console.log('\n👥 Probando /admin/users...');
        const usersResponse = await fetch(`${baseURL}/admin/users`, { headers });
        console.log('Status:', usersResponse.status);
        if (usersResponse.ok) {
            const usersData = await usersResponse.json();
            console.log('Users data:', usersData);
            // Filtrar teachers
            const allUsers = usersData.users || usersData;
            const teachers = allUsers.filter(user => 
                user.role === 'teacher' || user.role === 'instructor'
            );
            console.log('Teachers filtrados:', teachers);
        } else {
            console.log('Error response:', await usersResponse.text());
        }
    } catch (error) {
        console.log('Error al llamar /admin/users:', error);
    }
}

// Ejecutar: testBackendEndpoints()
