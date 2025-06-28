# Configuración Backend: Email del Profesor usando ID

## 🎯 Problema Resuelto

Ahora el frontend puede obtener el email del profesor aunque la clase solo contenga el ID del profesor, no los datos completos.

## 🔧 Cómo Funciona la Nueva Lógica

### 1. Búsqueda Escalonada

El sistema ahora busca información del profesor en este orden:

1. **Datos completos en la clase**: `classDetails.instructor.email`
2. **Usuario creador**: `classDetails.user.email`
3. **Campo teacher**: `classDetails.teacher.email`
4. **Datos en booking**: `booking.classEntity.user.email`
5. **🆕 ID del profesor**: Si encuentra `instructorId`, `instructor_id`, `teacherId`, `teacher_id`, `userId`, o `user_id`

### 2. Consulta Automática de Datos

Si solo tiene el ID del profesor, automáticamente consulta:

- `GET /api/users/{instructorId}` (endpoint privado)
- `GET /api/public/users/{instructorId}` (endpoint público de fallback)

## 📋 Configuraciones de Backend Compatibles

### Opción A: Clase con datos completos del instructor

```json
{
  "id": 5,
  "name": "ceramica sofia",
  "instructor": {
    "id": 1,
    "name": "Sofia Profesora",
    "email": "sofia@tatutaller.com"
  }
}
```

### Opción B: Clase con ID del instructor (NUEVA)

```json
{
  "id": 5,
  "name": "ceramica sofia",
  "instructorId": 1
  // El frontend automáticamente consultará GET /api/users/1
}
```

### Opción C: Clase con ID usando otros nombres de campo

```json
{
  "id": 5,
  "name": "ceramica sofia",
  "instructor_id": 1, // snake_case
  "teacherId": 1, // camelCase alternativo
  "teacher_id": 1, // snake_case alternativo
  "userId": 1, // si el creador es el profesor
  "user_id": 1 // snake_case para user
}
```

## 🛠️ Endpoints Requeridos en el Backend

### 1. Endpoint de Usuario (NUEVO REQUERIMIENTO)

```javascript
// GET /api/users/{id}
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

### 2. Endpoint Público de Usuario (OPCIONAL pero recomendado)

```javascript
// GET /api/public/users/{id}
app.get("/api/public/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id, {
      attributes: ["id", "name", "email"], // Solo datos básicos públicos
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

### 3. Endpoint de Clases (MODIFICADO)

```javascript
// GET /api/public/classes/{id}
app.get("/api/public/classes/:id", async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id);

    // Opción A: Incluir datos completos del instructor
    // const classWithInstructor = await Class.findById(req.params.id, {
    //   include: [{
    //     model: User,
    //     as: 'instructor',
    //     attributes: ['id', 'name', 'email']
    //   }]
    // });

    // Opción B: Solo enviar ID del instructor (MÁS SIMPLE)
    res.json({
      ...classData,
      instructorId: classData.instructor_id, // o el campo que uses
    });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener clase" });
  }
});
```

## 🧪 Para Probar

### 1. Con ID del Instructor

Asegúrate de que tu endpoint de clases devuelva algo como:

```json
{
  "id": 5,
  "name": "ceramica sofia",
  "instructorId": 1
}
```

### 2. Con Endpoint de Usuario

Asegúrate de que `GET /api/users/1` devuelva:

```json
{
  "id": 1,
  "name": "Sofia Profesora",
  "email": "sofia@tatutaller.com"
}
```

## 🚀 Ventajas de esta Implementación

- ✅ **Flexible**: Funciona con múltiples estructuras de backend
- ✅ **Eficiente**: Solo consulta usuario si es necesario
- ✅ **Fallback**: Múltiples endpoints de respaldo
- ✅ **Debugging**: Logging detallado para identificar problemas
- ✅ **Desarrollo**: Email de fallback para testing

## 📝 Logs de Debugging

Con la nueva implementación verás logs como:

```
🔍 Obteniendo datos del profesor con ID: 1
✅ Datos del profesor obtenidos: Sofia Profesora (sofia@tatutaller.com)
📧 Enviando notificación a: Sofia Profesora (sofia@tatutaller.com)
```

O si hay problemas:

```
🔍 Campos relacionados con profesor encontrados: ['instructorId', 'userId']
⚠️ No se pudo obtener datos del profesor desde /api/users/1
```

### 🔧 Solución Temporal para Desarrollo

Mientras implementas el backend, puedes configurar un email de fallback:

```env
# En tu archivo .env (para Vite)
VITE_FALLBACK_TEACHER_EMAIL=admin@tatutaller.com
```

El frontend detectará automáticamente si está en modo desarrollo y usará este email.
