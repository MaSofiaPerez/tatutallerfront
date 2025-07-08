# 🚀 ENDPOINTS PARA EL BACKEND - UserPanel

## 📋 Resumen Ejecutivo

Necesito 4 endpoints para conectar el UserPanel del frontend. Aquí tienes los requests y responses exactos:

---

## 🔐 Autenticación Global

**Todos los endpoints requieren:**

```
Headers:
  Authorization: Bearer {jwt_token}
  Content-Type: application/json
```

---

## 1️⃣ **GET /users/profile** - Obtener Perfil del Usuario

### Request:

```http
GET /users/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Response Exitosa (200):

```json
{
  "id": 1,
  "name": "María González",
  "email": "maria.gonzalez@email.com",
  "phone": "+598 99 123 456",
  "address": "Av. 18 de Julio 1234, Apto 5B, Montevideo, Uruguay",
  "role": "user",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-12-01T14:22:00Z"
}
```

### Errores:

- `401` - Token inválido/expirado
- `404` - Usuario no encontrado

---

## 2️⃣ **PUT /users/profile** - Actualizar Perfil

### Request:

```http
PUT /users/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "María González Pérez",
  "email": "maria.nueva@email.com",
  "phone": "+598 99 987 654",
  "address": "Nueva Calle 456, Apt 2, Montevideo, Uruguay"
}
```

### Response Exitosa (200):

```json
{
  "success": true,
  "message": "Perfil actualizado exitosamente",
  "user": {
    "id": 1,
    "name": "María González Pérez",
    "email": "maria.nueva@email.com",
    "phone": "+598 99 987 654",
    "address": "Nueva Calle 456, Apt 2, Montevideo, Uruguay",
    "role": "user",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-12-07T16:45:00Z"
  }
}
```

### Errores:

- `400` - Email ya existe
- `422` - Datos inválidos
- `401` - Token inválido

---

## 3️⃣ **PUT /users/change-password** - Cambiar Contraseña

### Request:

```http
PUT /users/change-password
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "currentPassword": "miPasswordActual123",
  "newPassword": "miNuevoPassword456"
}
```

### Response Exitosa (200):

```json
{
  "success": true,
  "message": "Contraseña actualizada exitosamente"
}
```

### Errores:

- `400` - Contraseña actual incorrecta
- `422` - Nueva contraseña muy corta (mínimo 6 caracteres)
- `401` - Token inválido

---

## 4️⃣ **GET /users/classes** - Obtener Clases del Usuario

### Request:

```http
GET /users/classes
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Query Parameters (opcionales):

```
?status=confirmada          # Filtrar por estado
&limit=10                   # Paginación
&offset=0                   # Paginación
```

### Response Exitosa (200):

```json
[
  {
    "id": 1,
    "classId": 101,
    "className": "Introducción a la Cerámica",
    "description": "Clase básica para principiantes en el mundo de la cerámica",
    "teacherName": "Ana Rodríguez",
    "date": "2024-12-15T10:00:00Z",
    "endDate": "2024-12-15T12:00:00Z",
    "duration": 120,
    "participants": 1,
    "maxParticipants": 8,
    "price": 1200,
    "status": "confirmada",
    "location": "Taller Principal",
    "materials": "Incluye arcilla y herramientas básicas",
    "notes": "Traer ropa que se pueda ensuciar",
    "bookingDate": "2024-11-20T09:15:00Z",
    "paymentStatus": "pagado",
    "special": false,
    "prerequisites": null,
    "cancellationReason": null,
    "cancellationDate": null
  },
  {
    "id": 2,
    "classId": 102,
    "className": "Técnicas de Esmaltado",
    "description": "Aprende diferentes técnicas de esmaltado para tus piezas",
    "teacherName": "Carlos Méndez",
    "date": "2024-12-22T14:00:00Z",
    "endDate": "2024-12-22T17:00:00Z",
    "duration": 180,
    "participants": 1,
    "maxParticipants": 6,
    "price": 1800,
    "status": "pendiente",
    "location": "Sala de Esmaltado",
    "materials": "Esmaltes y pinceles incluidos",
    "notes": "Trae tu pieza biscocheada o usa una del taller",
    "bookingDate": "2024-12-01T16:30:00Z",
    "paymentStatus": "pendiente",
    "special": false,
    "prerequisites": null,
    "cancellationReason": null,
    "cancellationDate": null
  }
]
```

---

## 🗄️ CAMBIOS EN BASE DE DATOS

### 1. Tabla `users` - Agregar campo address:

```sql
ALTER TABLE users ADD COLUMN address TEXT;
```

### 2. Campos mínimos requeridos en `users`:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  address TEXT,                    -- ⬅️ NUEVO CAMPO
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Campos sugeridos para tabla `bookings` o `user_classes`:

```sql
CREATE TABLE user_classes (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  class_id INT,
  class_name VARCHAR(255),
  description TEXT,
  teacher_name VARCHAR(255),
  date TIMESTAMP,
  end_date TIMESTAMP,
  duration INTEGER,              -- minutos
  participants INTEGER,
  max_participants INTEGER,
  price DECIMAL(10,2),
  status VARCHAR(50),           -- 'confirmada', 'pendiente', 'cancelada'
  location VARCHAR(255),
  materials TEXT,
  notes TEXT,
  booking_date TIMESTAMP,
  payment_status VARCHAR(50),   -- 'pagado', 'pendiente', 'reembolsado'
  special BOOLEAN DEFAULT false,
  prerequisites TEXT,
  cancellation_reason TEXT,
  cancellation_date TIMESTAMP
);
```

---

## ✅ VALIDACIONES REQUERIDAS

### Para Perfil (PUT /users/profile):

- `name`: Requerido, mínimo 2 caracteres
- `email`: Formato válido, único en BD
- `phone`: Opcional, formato válido
- `address`: Opcional, máximo 500 caracteres

### Para Contraseña (PUT /users/change-password):

- `currentPassword`: Verificar contra hash en BD
- `newPassword`: Mínimo 6 caracteres, diferente a la actual

### Para Clases (GET /users/classes):

- Solo devolver clases del usuario autenticado
- Ordenar por fecha descendente
- Incluir todos los campos del ejemplo

---

## 📝 NOTAS IMPORTANTES

1. **Fechas**: Usar formato ISO 8601 en UTC
2. **Errores**: Devolver status HTTP correcto + mensaje descriptivo
3. **Seguridad**: Validar que el usuario solo acceda a sus propios datos
4. **Performance**: Considerar índices en `user_id` para tabla de clases

---

## 🧪 DATOS DE PRUEBA

```sql
-- Usuario de prueba
INSERT INTO users (name, email, phone, address, password_hash, role)
VALUES ('María González', 'maria@test.com', '+598 99 123 456',
        'Av. 18 de Julio 1234, Montevideo', '$hashedPassword', 'user');

-- Clases de prueba
INSERT INTO user_classes (user_id, class_name, teacher_name, date, duration,
                         price, status, location, payment_status)
VALUES (1, 'Introducción a la Cerámica', 'Ana Rodríguez', '2024-12-15 10:00:00',
        120, 1200, 'confirmada', 'Taller Principal', 'pagado');
```

---

## 🚀 TESTING

Para probar los endpoints usa:

- **Postman** o **Thunder Client**
- **Token**: El que generes en tu sistema de auth
- **Base URL**: `http://localhost:8080` (o tu puerto)

¿Necesitas alguna aclaración sobre algún endpoint específico?
