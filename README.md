# TatuTaller Frontend

Sistema de gestión para taller de cerámica con funcionalidades avanzadas de reservas y gestión de usuarios.

## 🚀 Características Principales

### ✅ Sistema de Autenticación

- Login/Register con Redux
- Roles: Admin, Teacher, Student
- Rutas protegidas por rol

### 📅 Sistema de Reservas

- **Reserva de clases** con sistema multi-paso
- **Notificación automática por email al profesor** 🆕
- Gestión de horarios disponibles
- Estados: pendiente, confirmada, cancelada, completada

### 👥 Gestión de Usuarios (Role-based)

- **Admins**: Ven todos los usuarios y pueden gestionar todo
- **Teachers**: Solo ven sus estudiantes y sus reservas
- **Students**: Acceso a reservas y clases

### 🎨 Gestión de Clases

- CRUD completo de clases
- Asignación de profesores
- Integración con sistema de reservas

### 📊 Dashboard Personalizado

- **Dashboard de Admin**: Estadísticas globales
- **Dashboard de Teacher**: Solo sus datos (estudiantes, reservas, ingresos)

## 🔧 Tecnologías

- React 18 + Vite
- Redux Toolkit para state management
- Tailwind CSS para estilos
- React Router para navegación
- Heroicons para iconos

## 📧 Sistema de Notificaciones

### Notificación Automática por Email

Cuando un estudiante reserva una clase:

1. Se crea la reserva en la base de datos
2. Se obtiene el email del profesor de la clase
3. Se envía automáticamente un email al profesor
4. Se muestra el estado de la notificación al usuario

Ver documentación completa en: [NOTIFICACION-EMAILS.md](./NOTIFICACION-EMAILS.md)

## 🏃‍♂️ Instalación y Uso

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build
```

## 📂 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── BookingSystem.jsx    # Sistema de reservas con notificaciones
│   ├── ClassModal.jsx       # Modal para crear/editar clases
│   ├── UserModal.jsx        # Modal para gestionar usuarios
│   └── Navbar.jsx           # Navegación con control de roles
├── features/            # Páginas principales
│   ├── AdminPanel.jsx       # Panel de administración role-based
│   ├── Clases.jsx          # Lista de clases (estática)
│   └── ClasesStatic.jsx    # Datos estáticos de clases
├── redux/
│   └── slices/          # Redux slices
│       ├── authSlice.js     # Autenticación y roles
│       ├── bookingSlice.js  # Reservas + notificaciones
│       ├── usersSlice.js    # Gestión de usuarios role-based
│       ├── classesSlice.js  # Gestión de clases
│       └── dashboardSlice.js # Estadísticas role-based
└── App.jsx              # Componente principal
```

## 🔐 Sistema de Roles

### Admin

- Acceso completo al AdminPanel
- Ve todos los usuarios, clases, reservas
- Puede crear/editar usuarios con cualquier rol
- Ve estadísticas globales

### Teacher

- Acceso limitado al AdminPanel
- Ve solo "Mis Estudiantes" en lugar de "Usuarios"
- Ve solo sus reservas y estadísticas
- Puede editar roles de sus estudiantes
- Recibe emails automáticos de nuevas reservas

### Student

- Puede reservar clases
- Ve sus propias reservas
- Acceso limitado a la aplicación

## 📋 Funcionalidades Implementadas

### ✅ Frontend Completo

- [x] Sistema de roles y autenticación
- [x] Filtrado role-based en AdminPanel
- [x] Notificaciones por email (frontend)
- [x] Gestión de usuarios role-based
- [x] Dashboard personalizado por rol
- [x] Sistema de reservas multi-paso
- [x] Gestión de clases con asignación de profesores

### 🔧 Pendiente Backend

- [ ] Endpoint de envío de emails (`/bookings/notify-teacher`)
- [ ] Configuración SMTP/Email service
- [ ] Templates de email
- [ ] Endpoints específicos para teachers (`/teacher/*`)

## 📚 Documentación Adicional

- [BACKEND_SETUP.md](./BACKEND_SETUP.md) - Configuración de backend
- [NOTIFICACION-EMAILS.md](./NOTIFICACION-EMAILS.md) - Sistema de emails
- [SOLUCION-PROFESORES.md](./SOLUCION-PROFESORES.md) - Implementación de roles
- [EDICION-USUARIOS.md](./EDICION-USUARIOS.md) - Gestión de usuarios

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request
