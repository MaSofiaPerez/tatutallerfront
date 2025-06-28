// Ejemplo práctico del flujo de notificación implementado

/* 
  FLUJO IMPLEMENTADO según tu especificación:
  
  1. Crear reserva
  2. Obtener detalles de clase (incluyendo profesor)  
  3. Enviar notificación al profesor
*/

// Este es el flujo que ahora está implementado en createBookingWithNotification

const ejemploFlujoCompleto = async (bookingData, token, userInfo) => {
  try {
    console.log('🚀 Iniciando flujo de reserva con notificación...');
    
    // 1. Crear reserva
    console.log('📝 Paso 1: Creando reserva...');
    const booking = await createBooking(bookingData);
    console.log('✅ Reserva creada:', booking);
    
    // 2. Obtener detalles de la clase (incluyendo profesor)
    console.log('📚 Paso 2: Obteniendo detalles de la clase...');
    const classResponse = await fetch(`/api/public/classes/${booking.classEntity.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!classResponse.ok) {
      throw new Error('No se pudo obtener detalles de la clase');
    }
    
    const classDetails = await classResponse.json();
    console.log('✅ Detalles de clase obtenidos:', classDetails);
    
    // 3. Enviar notificación al profesor
    console.log('📧 Paso 3: Enviando notificación al profesor...');
    const notification = await fetch('/api/bookings/notify-teacher', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        bookingId: booking.id,
        teacherEmail: classDetails.instructor.email,
        teacherName: classDetails.instructor.name,
        studentName: userInfo.name,
        studentEmail: userInfo.email,
        className: classDetails.name,
        bookingDate: booking.bookingDate,
        bookingTime: booking.bookingTime,
        notes: booking.notes
      })
    });
    
    if (notification.ok) {
      const notificationResult = await notification.json();
      console.log('✅ Profesor notificado exitosamente:', notificationResult);
      return {
        booking,
        notificationStatus: 'sent',
        notificationResult
      };
    } else {
      const errorData = await notification.json();
      console.log('❌ Error al notificar profesor:', errorData);
      return {
        booking,
        notificationStatus: 'failed',
        notificationError: errorData
      };
    }
    
  } catch (error) {
    console.error('💥 Error en el flujo:', error);
    throw error;
  }
};

// Ejemplo de datos que se envían al endpoint de notificación
const ejemploDatosNotificacion = {
  bookingId: "booking-123",
  teacherEmail: "maria.garcia@taller.com",
  teacherName: "María García",
  studentName: "Juan Pérez",
  studentEmail: "juan.perez@email.com",
  className: "Clase de Torno Avanzado",
  bookingDate: "2024-01-15",
  bookingTime: "14:00",
  notes: "Primera vez trabajando con torno. Muy emocionado por aprender."
};

console.log('📋 Datos que se envían al backend:', ejemploDatosNotificacion);

// Ejemplo de respuesta esperada del backend
const ejemploRespuestaExitosa = {
  success: true,
  message: "Email enviado exitosamente",
  emailId: "email-msg-123456"
};

console.log('✅ Respuesta esperada del backend:', ejemploRespuestaExitosa);

// Template de email que recibirá el profesor
const templateEmailProfesor = `
<!DOCTYPE html>
<html>
<head>
    <title>Nueva Reserva - TatuTaller</title>
    <style>
        body { font-family: Arial, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background: #f59e0b; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .booking-details { background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .button { background: #f59e0b; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>🎨 Nueva Reserva Recibida</h2>
        </div>
        
        <div class="content">
            <p>Hola María García,</p>
            
            <p>Has recibido una nueva reserva para tu clase:</p>
            
            <div class="booking-details">
                <h3>📚 Clase de Torno Avanzado</h3>
                <p><strong>Estudiante:</strong> Juan Pérez (juan.perez@email.com)</p>
                <p><strong>Fecha:</strong> 2024-01-15</p>
                <p><strong>Hora:</strong> 14:00</p>
                <p><strong>Observaciones:</strong> Primera vez trabajando con torno. Muy emocionado por aprender.</p>
            </div>
            
            <p>Para confirmar o gestionar esta reserva, ingresa al panel de administración:</p>
            <a href="#" class="button">
                Ver Panel de Administración
            </a>
            
            <p>Gracias,<br>Equipo TatuTaller</p>
        </div>
    </div>
</body>
</html>
`;

console.log('📧 Template de email para el profesor:', templateEmailProfesor);

export { 
  ejemploFlujoCompleto, 
  ejemploDatosNotificacion, 
  ejemploRespuestaExitosa,
  templateEmailProfesor 
};
