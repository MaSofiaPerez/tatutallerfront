📧 **MENSAJE PARA EL BACKEND DEVELOPER**

---

**Asunto:** UserPanel Frontend - 4 Endpoints específicos necesarios

Hola [Nombre],

Terminé el UserPanel del frontend y necesito que implementes exactamente estos 4 endpoints:

## 🎯 **LO QUE NECESITO:**

### 1. **Campo nuevo en BD (URGENTE):**

```sql
ALTER TABLE users ADD COLUMN address TEXT;
```

### 2. **4 Endpoints exactos:**

#### A) **GET /users/profile**

```json
// Response:
{
  "id": 1,
  "name": "María González",
  "email": "maria@email.com",
  "phone": "+598 99 123 456",
  "address": "Av. 18 de Julio 1234, Montevideo", // ⬅️ NUEVO
  "role": "user"
}
```

#### B) **PUT /users/profile**

```json
// Request Body:
{
  "name": "Nuevo Nombre",
  "email": "nuevo@email.com",
  "phone": "+598 99 999 999",
  "address": "Nueva dirección completa"
}

// Response:
{
  "success": true,
  "message": "Perfil actualizado exitosamente",
  "user": { ...datosActualizados }
}
```

#### C) **PUT /users/change-password**

```json
// Request Body:
{
  "currentPassword": "passwordActual",
  "newPassword": "passwordNuevo"
}

// Response:
{
  "success": true,
  "message": "Contraseña actualizada exitosamente"
}
```

#### D) **GET /users/classes**

```json
// Response: Array con las clases del usuario
[
  {
    "id": 1,
    "className": "Introducción a la Cerámica",
    "teacherName": "Ana Rodríguez",
    "date": "2024-12-15T10:00:00Z",
    "status": "confirmada", // confirmada|pendiente|cancelada
    "price": 1200,
    "location": "Taller Principal",
    "paymentStatus": "pagado" // pagado|pendiente|reembolsado
    // ...más campos (ver documentación completa)
  }
]
```

## 📁 **Archivos de referencia:**

- **ENDPOINTS_PARA_BACKEND.md** - Especificaciones técnicas completas
- **postman-collection.json** - Colección de Postman para testing

## 🔐 **Autenticación:**

Todos los endpoints requieren: `Authorization: Bearer {jwt_token}`

## ✅ **Validaciones importantes:**

- Email único al actualizar perfil
- Verificar contraseña actual antes de cambiarla
- Solo devolver clases del usuario autenticado
- Fechas en formato ISO 8601 UTC

## 🎮 **Estado actual:**

- ✅ Frontend 100% funcional con datos mock
- ✅ Panel accesible en `/mi-cuenta`
- ⏳ Solo falta tu API para conectar

**¿Cuándo podrías tener listos estos endpoints?** El campo `address` es lo más urgente.

Cualquier duda me avisas!

---

💡 **TL;DR:** Agregar campo `address` a tabla users + 4 endpoints con la data exacta que te especifiqué arriba.
