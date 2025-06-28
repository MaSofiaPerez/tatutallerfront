# 🔧 Solución para el problema del combo de profesores

## 📋 Problema identificado:

El combo de profesores no se actualiza porque **no hay usuarios con rol "teacher" en la base de datos** o el endpoint no existe.

## ✅ Solución temporal implementada:

- El frontend ahora usa profesores temporales como fallback
- Puedes crear clases normalmente mientras solucionas el backend

## 🛠️ Para solucionar permanentemente (Backend):

### Opción 1: Crear usuarios con rol "teacher" en la base de datos

```sql
-- Ejemplo SQL para crear usuarios teacher
INSERT INTO users (name, email, password, role) VALUES
('María González', 'maria@tatutaller.com', '$2a$10$encryptedpassword', 'teacher'),
('Carlos Rodríguez', 'carlos@tatutaller.com', '$2a$10$encryptedpassword', 'teacher'),
('Ana Martínez', 'ana@tatutaller.com', '$2a$10$encryptedpassword', 'teacher');
```

### Opción 2: Crear endpoint específico /admin/teachers

```java
// En tu AdminController.java
@GetMapping("/admin/teachers")
public ResponseEntity<?> getTeachers() {
    try {
        List<User> teachers = userService.getUsersByRole("teacher");
        return ResponseEntity.ok(Map.of("teachers", teachers));
    } catch (Exception e) {
        return ResponseEntity.badRequest()
            .body(Map.of("message", "Error al obtener profesores: " + e.getMessage()));
    }
}
```

### Opción 3: Modificar el endpoint /admin/users para incluir teachers

```java
// Asegúrate de que el endpoint devuelva usuarios con rol "teacher"
@GetMapping("/admin/users")
public ResponseEntity<?> getAllUsers() {
    try {
        List<User> users = userService.getAllUsers(); // Debe incluir teachers
        return ResponseEntity.ok(Map.of("users", users));
    } catch (Exception e) {
        return ResponseEntity.badRequest()
            .body(Map.of("message", "Error al obtener usuarios: " + e.getMessage()));
    }
}
```

## 🔍 Para verificar que funciona:

1. Abre la consola del navegador (F12)
2. Intenta crear una nueva clase
3. Observa los logs para ver si se cargan los teachers del backend
4. Si funciona, verás: `✅ Teachers filtrados: [array con profesores]`

## 📝 Notas importantes:

- Los IDs temporales tienen formato 'temp-1', 'temp-2', etc.
- Cuando tengas teachers reales en el backend, el sistema automáticamente usará esos en lugar de los temporales
- El frontend filtra usuarios por roles: 'teacher', 'instructor', 'profesor'

## 🚀 Una vez solucionado:

Puedes eliminar los `fallbackTeachers` del código frontend y el sistema funcionará completamente con datos del backend.
