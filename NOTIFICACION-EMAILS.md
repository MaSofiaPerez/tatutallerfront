# Sistema de Notificación por Email al Profesor

## 📧 IMPLEMENTADO EN EL FRONTEND

### ✅ Funcionalidad Completada

1. **Nuevo Thunk de Notificación**: `notifyTeacherBooking`

   - Envía notificación por email al profesor cuando se crea una reserva
   - Maneja errores sin afectar la creación de la reserva

2. **Thunk Integrado**: `createBookingWithNotification`

   - Crea la reserva y automáticamente notifica al profesor
   - Si falla la notificación, la reserva se crea igual
   - Obtiene información del profesor desde la clase

3. **UI de Estado de Notificación**

   - Muestra estado: "enviando", "enviado", "falló"
   - Feedback visual al usuario sobre el estado del email
   - Mensaje personalizado según el resultado

4. **Estado Redux Actualizado**
   - `notificationStatus`: seguimiento del estado del email
   - `notificationError`: errores específicos de notificación

### 🎯 Flujo de Funcionamiento

1. **Usuario crea reserva** → `createBookingWithNotification`
2. **Se crea la reserva** → POST `/bookings`
3. **Se obtienen detalles de la clase** → GET `/api/public/classes/{classId}`
4. **Se envía email al profesor** → POST `/api/bookings/notify-teacher`
5. **Se muestra resultado al usuario**

## 🔧 PENDIENTE PARA EL BACKEND

### Endpoints Requeridos

#### 1. POST `/api/bookings/notify-teacher`

```json
{
  "bookingId": "123",
  "teacherEmail": "profesor@ejemplo.com",
  "teacherName": "María García",
  "studentName": "Juan Pérez",
  "studentEmail": "juan@ejemplo.com",
  "className": "Clase de Torno",
  "bookingDate": "2024-01-15",
  "bookingTime": "14:00",
  "notes": "Primera vez en cerámica"
}
```

**Respuesta esperada:**

```json
{
  "success": true,
  "message": "Email enviado exitosamente",
  "emailId": "email-123"
}
```

#### 2. Modificar GET `/api/public/classes/{classId}`

**IMPORTANTE**: Actualmente el frontend no encuentra el email del instructor porque falta esta información en la respuesta.

**Estructura actual (problemática):**

```json
{
  "id": "1",
  "name": "Clase de Torno",
  "description": "...",
  "duration": "120",
  "price": 1000,
  "status": "Activo"
  // ❌ Falta información del instructor
}
```

**Asegurar que incluya información del instructor (cualquiera de estas opciones):**

**Opción A - Campo instructor:**

```json
{
  "id": "1",
  "name": "Clase de Torno",
  "description": "...",
  "instructor": {
    "id": "teacher-1",
    "name": "María García",
    "email": "maria.garcia@taller.com"
  }
}
```

**Opción B - Campo user (creador):**

```json
{
  "id": "1",
  "name": "Clase de Torno",
  "description": "...",
  "user": {
    "id": "teacher-1",
    "name": "María García",
    "email": "maria.garcia@taller.com"
  }
}
```

**Opción C - Campo teacher:**

```json
{
  "id": "1",
  "name": "Clase de Torno",
  "description": "...",
  "teacher": {
    "id": "teacher-1",
    "name": "María García",
    "email": "maria.garcia@taller.com"
  }
}
```

**🆕 Opción D - Solo ID del instructor (AUTOMÁTICO):**

```json
{
  "id": "1",
  "name": "Clase de Torno",
  "description": "...",
  "instructorId": "teacher-1"
}
```

_El frontend automáticamente consultará `GET /api/users/teacher-1` para obtener el email_

### 🔧 Nuevo Endpoint Requerido

#### 3. GET `/api/users/{id}` (NUEVO)

Para cuando la clase solo contiene el ID del instructor:

**Respuesta esperada:**

```json
{
  "id": "teacher-1",
  "name": "María García",
  "email": "maria.garcia@taller.com",
  "role": "profesor"
}
```

**Implementación sugerida:**

```javascript
app.get("/api/users/:id", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id, {
      attributes: ["id", "name", "email", "role"],
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuario" });
  }
});
```

### 🔧 Solución Temporal para Desarrollo

Mientras implementas el backend, puedes configurar un email de fallback:

```env
# En tu archivo .env
REACT_APP_FALLBACK_TEACHER_EMAIL=admin@tatutaller.com
```

El frontend detectará automáticamente si está en modo desarrollo y usará este email.

### 📋 Configuración de Email Requerida

1. **Servicio de Email** (recomendado):

   - SendGrid
   - Mailgun
   - Amazon SES
   - Nodemailer con SMTP

2. **Variables de Entorno**:

   ```env
   EMAIL_SERVICE=sendgrid
   EMAIL_API_KEY=your_api_key
   EMAIL_FROM=noreply@tatutaller.com
   EMAIL_FROM_NAME=TatuTaller
   ```

3. **Template de Email al Profesor**:

   ```html
   <!DOCTYPE html>
   <html>
     <head>
       <title>Nueva Reserva - TatuTaller</title>
     </head>
     <body>
       <h2>🎨 Nueva Reserva Recibida</h2>

       <p>Hola {{teacherName}},</p>

       <p>Has recibido una nueva reserva para tu clase:</p>

       <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
         <h3>📚 {{className}}</h3>
         <p><strong>Estudiante:</strong> {{studentName}} ({{studentEmail}})</p>
         <p><strong>Fecha:</strong> {{bookingDate}}</p>
         <p><strong>Hora:</strong> {{bookingTime}}</p>
         <p><strong>Observaciones:</strong> {{notes}}</p>
       </div>

       <p>
         Para confirmar o gestionar esta reserva, ingresa al panel de
         administración:
       </p>
       <a
         href="{{adminPanelUrl}}"
         style="background: #f59e0b; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;"
       >
         Ver Panel de Administración
       </a>

       <p>Gracias,<br />Equipo TatuTaller</p>
     </body>
   </html>
   ```

### 🔧 Implementación Backend Sugerida (Node.js)

```javascript
// controllers/bookingController.js
const sendEmailToTeacher = async (req, res) => {
  try {
    const {
      bookingId,
      teacherEmail,
      teacherName,
      studentName,
      studentEmail,
      className,
      bookingDate,
      bookingTime,
      notes,
    } = req.body;

    // Validar datos requeridos
    if (!teacherEmail || !studentName || !className) {
      return res.status(400).json({
        error: "Datos requeridos faltantes",
        required: ["teacherEmail", "studentName", "className"],
      });
    }

    // Configurar datos para el template de email
    const emailData = {
      to: teacherEmail,
      from: process.env.EMAIL_FROM,
      subject: `Nueva Reserva - ${className}`,
      html: generateBookingEmailTemplate({
        teacherName,
        studentName,
        studentEmail,
        className,
        bookingDate,
        bookingTime,
        notes,
      }),
    };

    // Enviar email usando el servicio configurado
    const result = await emailService.send(emailData);

    // Guardar log del email enviado (opcional)
    await EmailLog.create({
      bookingId,
      recipientEmail: teacherEmail,
      recipientName: teacherName,
      status: "sent",
      emailId: result.messageId,
    });

    res.json({
      success: true,
      message: "Email enviado exitosamente",
      emailId: result.messageId,
    });
  } catch (error) {
    console.error("Error enviando email:", error);
    res.status(500).json({
      error: "Error al enviar notificación por email",
      details: error.message,
    });
  }
};

const generateBookingEmailTemplate = (data) => {
  const {
    teacherName,
    studentName,
    studentEmail,
    className,
    bookingDate,
    bookingTime,
    notes,
  } = data;

  return `
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
                <p>Hola ${teacherName || "Profesor/a"},</p>
                
                <p>Has recibido una nueva reserva para tu clase:</p>
                
                <div class="booking-details">
                    <h3>📚 ${className}</h3>
                    <p><strong>Estudiante:</strong> ${studentName} (${studentEmail})</p>
                    <p><strong>Fecha:</strong> ${bookingDate}</p>
                    <p><strong>Hora:</strong> ${bookingTime}</p>
                    ${
                      notes
                        ? `<p><strong>Observaciones:</strong> ${notes}</p>`
                        : ""
                    }
                </div>
                
                <p>Para confirmar o gestionar esta reserva, ingresa al panel de administración:</p>
                <a href="${process.env.ADMIN_PANEL_URL || "#"}" class="button">
                    Ver Panel de Administración
                </a>
                
                <p>Gracias,<br>Equipo TatuTaller</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

// Ruta del endpoint
app.post("/api/bookings/notify-teacher", authenticateToken, sendEmailToTeacher);
```

### 🧪 Testing de Emails

1. **Desarrollo**: Usar Mailtrap o herramienta similar
2. **Staging**: Usar emails de prueba
3. **Producción**: Emails reales

### 🔐 Seguridad

1. **Rate Limiting**: Limitar envío de emails por IP/usuario
2. **Validación**: Verificar que el email pertenece a un profesor real
3. **Templates**: Escapar contenido para prevenir XSS
4. **Logs**: Registrar todos los emails enviados

## 📝 Resumen

✅ **Frontend completo**: Sistema de notificaciones implementado
🔧 **Backend pendiente**: Endpoint de email y configuración SMTP
📧 **Email templates**: Diseñar template profesional
🧪 **Testing**: Configurar entorno de pruebas de email

El frontend ya está preparado para manejar la notificación por email. Solo falta implementar el backend para procesar las solicitudes de envío.
