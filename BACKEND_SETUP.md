# TatuTaller Frontend - Configuración de Backend

## ✅ IMPLEMENTADO EN EL FRONTEND

### 🔐 Autenticación y Autorización

- **Login/Register**: Conectados con Redux y API
- **Verificación de token**: Al cargar la aplicación
- **Rutas protegidas**: AdminPanel solo para admins
- **Gestión de roles**: Admin vs Usuario regular

### 📅 Sistema de Reservas

- **BookingSystem**: Conectado con la API
- **Formulario de reserva**: Multi-paso con validaciones
- **Estados de reserva**: pending, confirmed, cancelled, completed
- **Horarios disponibles**: Consulta dinámica por servicio y fecha

### 🏺 Gestión de Clases

- **Lista de clases**: Obtenida desde la API
- **CRUD completo**: Crear, leer, actualizar, eliminar
- **Integración con reservas**: Las clases se muestran en el sistema de reservas

### 🎨 Gestión de Productos

- **Lista de productos**: Para la tienda
- **CRUD completo**: Gestión desde el panel admin
- **Categorías y filtros**: Sistema de categorización

### 👥 Gestión de Usuarios (Solo Admin)

- **Lista de usuarios**: Con roles y estados
- **Cambio de roles**: admin/user
- **Gestión de estados**: active/inactive
- **Eliminación**: Con confirmación

### 📊 Panel de Administración

- **Dashboard**: Estadísticas generales
- **Tabs organizados**: Dashboard, Usuarios, Productos, Clases, Reservas
- **Estados de carga**: Spinners y manejo de errores
- **Acceso restringido**: Solo para usuarios admin

### 🔧 Redux Store Configurado

- **authSlice**: Login, register, logout, verify token
- **bookingSlice**: CRUD de reservas, horarios disponibles
- **classesSlice**: CRUD de clases
- **productsSlice**: CRUD de productos
- **usersSlice**: CRUD de usuarios (admin)
- **dashboardSlice**: Estadísticas y métricas

## 🚀 ENDPOINTS DE API REQUERIDOS

### Autenticación

```
POST /api/auth/login
POST /api/auth/register
GET  /api/auth/verify
```

### Reservas

```
GET    /api/bookings              # Todas las reservas (admin)
POST   /api/bookings              # Crear reserva
GET    /api/bookings/user/:userId # Reservas de usuario
PATCH  /api/bookings/:id          # Actualizar estado
DELETE /api/bookings/:id          # Eliminar reserva
GET    /api/bookings/available-slots?serviceId=X&date=Y # Horarios disponibles
```

### Clases

```
GET    /api/classes               # Lista de clases
POST   /api/classes               # Crear clase (admin)
PUT    /api/classes/:id           # Actualizar clase (admin)
DELETE /api/classes/:id           # Eliminar clase (admin)
GET    /api/classes/:id           # Obtener clase específica
```

### Productos

```
GET    /api/products              # Lista de productos
POST   /api/products              # Crear producto (admin)
PUT    /api/products/:id          # Actualizar producto (admin)
DELETE /api/products/:id          # Eliminar producto (admin)
GET    /api/products/:id          # Obtener producto específico
GET    /api/products/category/:category # Productos por categoría
```

### Usuarios (Solo Admin)

```
GET    /api/users                 # Lista de usuarios
POST   /api/users                 # Crear usuario
PUT    /api/users/:id             # Actualizar usuario
DELETE /api/users/:id             # Eliminar usuario
GET    /api/users/:id             # Obtener usuario específico
PATCH  /api/users/:id/role        # Cambiar rol
PATCH  /api/users/:id/toggle-status # Cambiar estado
```

### Dashboard (Solo Admin)

```
GET    /api/dashboard/stats       # Estadísticas generales
GET    /api/dashboard/recent-bookings # Reservas recientes
GET    /api/dashboard/monthly-revenue # Ingresos mensuales
GET    /api/dashboard/popular-classes # Clases más populares
```

## 📋 ESTRUCTURA DE DATOS ESPERADA

### Usuario

```json
{
  "id": "string/number",
  "name": "string",
  "email": "string",
  "role": "admin|user",
  "status": "active|inactive",
  "phone": "string",
  "createdAt": "date"
}
```

### Reserva

```json
{
  "id": "string/number",
  "serviceId": "string/number",
  "serviceName": "string",
  "instructorId": "string/number",
  "customerName": "string",
  "customerEmail": "string",
  "customerPhone": "string",
  "date": "YYYY-MM-DD",
  "time": "HH:MM",
  "status": "pending|confirmed|cancelled|completed",
  "description": "string",
  "createdAt": "date"
}
```

### Clase

```json
{
  "id": "string/number",
  "name": "string",
  "description": "string",
  "price": "number",
  "duration": "string",
  "maxStudents": "number",
  "image": "string",
  "createdAt": "date"
}
```

### Producto

```json
{
  "id": "string/number",
  "name": "string",
  "description": "string",
  "price": "number",
  "category": "string",
  "stock": "number",
  "image": "string",
  "createdAt": "date"
}
```

### Estadísticas Dashboard

```json
{
  "totalUsers": "number",
  "totalBookings": "number",
  "totalRevenue": "number",
  "totalClasses": "number"
}
```

## 🔐 CONFIGURACIÓN DE AUTENTICACIÓN

### Headers requeridos

```javascript
Authorization: Bearer <token>
```

### Respuesta de login/register

```json
{
  "token": "jwt_token_string",
  "user": {
    "id": "string/number",
    "name": "string",
    "email": "string",
    "role": "admin|user"
  }
}
```

## 🎯 CONFIGURACIÓN ACTUAL

### Base URL de API

Actualizar en: `src/redux/slices/authSlice.js`

```javascript
const API_BASE_URL = "http://localhost:3000/api"; // Cambiar por tu URL
```

### CORS

Asegúrate de que tu backend permita requests desde:

- http://localhost:5176 (desarrollo)
- Tu dominio de producción

## 🔄 PRÓXIMOS PASOS

1. **Configurar tu backend** con los endpoints listados
2. **Ajustar la URL de API** en `authSlice.js`
3. **Probar las funcionalidades**:

   - Crear usuario admin en la base de datos
   - Probar login/register
   - Crear algunas clases de muestra
   - Probar el sistema de reservas
   - Verificar el panel admin

4. **Opcional**: Configurar Google OAuth si deseas
5. **Producción**: Ajustar URLs para tu servidor de producción

## 🏺 TEMÁTICA ACTUAL: TALLER DE CERÁMICA

- ✅ Navbar adaptado a cerámica
- ✅ Servicios de cerámica (clases de torno, modelado, esmaltado)
- ✅ Colores y temática apropiada (amarillos terrosos)
- ✅ Textos actualizados
- ✅ Panel admin para gestionar clases de cerámica
- ✅ Sistema de reservas para clases

¡El frontend está completamente preparado para conectarse con tu backend! 🎉
