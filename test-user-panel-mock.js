// Test completo para UserPanel con datos mock
// Ejecutar: node test-user-panel-mock.js

import { mockAPI, mockUserData, mockUserClasses, backendRequirements } from './src/utils/mockData.js';

console.log("🧪 TESTING USERPANEL CON DATOS MOCK");
console.log("=====================================");

const testMockData = async () => {
  console.log("\n1. 👤 Datos del Usuario Mock:");
  console.log(JSON.stringify(mockUserData, null, 2));
  
  console.log("\n2. 📚 Clases del Usuario Mock:");
  console.log(`Total de clases: ${mockUserClasses.length}`);
  
  // Estadísticas de las clases
  const stats = mockUserClasses.reduce((acc, clase) => {
    acc[clase.status] = (acc[clase.status] || 0) + 1;
    acc.totalPrice += clase.price;
    return acc;
  }, { totalPrice: 0 });
  
  console.log("📊 Estadísticas:");
  console.log(`  - Confirmadas: ${stats.confirmada || 0}`);
  console.log(`  - Pendientes: ${stats.pendiente || 0}`);
  console.log(`  - Canceladas: ${stats.cancelada || 0}`);
  console.log(`  - Precio total: $${stats.totalPrice}`);
  
  console.log("\n3. 🔗 Probando Mock API:");
  
  try {
    console.log("  Testing getUserProfile...");
    const profile = await mockAPI.getUserProfile();
    console.log("  ✅ getUserProfile - OK");
    
    console.log("  Testing updateUserProfile...");
    const updatedProfile = await mockAPI.updateUserProfile({
      name: "María González Actualizada",
      email: "maria.nueva@email.com",
      phone: "+598 99 999 999",
      address: "Nueva dirección de prueba"
    });
    console.log("  ✅ updateUserProfile - OK");
    
    console.log("  Testing changePassword...");
    await mockAPI.changePassword({
      currentPassword: "password123",
      newPassword: "nuevaPassword456"
    });
    console.log("  ✅ changePassword - OK");
    
    console.log("  Testing getUserClasses...");
    const classes = await mockAPI.getUserClasses(1);
    console.log("  ✅ getUserClasses - OK");
    
  } catch (error) {
    console.log("  ❌ Error:", error.message);
  }
  
  console.log("\n4. 📋 Especificaciones para Backend:");
  console.log("  Ver archivo: BACKEND_SPECS.md");
  console.log("  Endpoints requeridos:", Object.keys(backendRequirements.endpoints).length);
  
  console.log("\n✨ TESTING COMPLETO");
  console.log("=====================================");
  console.log("🌐 Servidor frontend: http://localhost:5174");
  console.log("📱 Ruta del panel: http://localhost:5174/mi-cuenta");
  console.log("📚 Para probar:");
  console.log("  1. Hacer login como usuario regular");
  console.log("  2. Navegar a 'Mi Cuenta'");
  console.log("  3. Probar edición de perfil (incluye dirección)");
  console.log("  4. Ver listado detallado de clases");
  console.log("  5. Probar cambio de contraseña");
  console.log("\n💡 Los datos mock se cargan automáticamente");
  console.log("💡 Para conectar con backend real, descomentar");
  console.log("   las líneas marcadas en UserPanel.jsx");
};

testMockData();
