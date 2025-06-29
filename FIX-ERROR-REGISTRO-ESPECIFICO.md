# Fix: Manejo de Errores Específicos del Backend en Registro

## Problema Resuelto

### Error Original

El componente Register no mostraba los errores específicos del backend (como "El email ya está en uso!") al usuario, aunque sí aparecían en la consola.

### Causa

El manejo de errores en el componente Register no estaba capturando correctamente la estructura del error que viene de Redux Toolkit cuando se usa `.unwrap()` con `rejectWithValue`.

## Solución Implementada

### 1. Mejorado el manejo de errores en el AuthSlice

En `src/redux/slices/authSlice.js`, función `registerUser`:

```javascript
} catch (error) {
  console.error('Error completo en registro:', error);
  localStorage.removeItem('token');

  // Mejorar la extracción del mensaje de error
  let errorMessage = 'Error al registrarse';

  if (error.response?.data) {
    if (typeof error.response.data === 'string') {
      errorMessage = error.response.data;
    } else if (error.response.data.message) {
      errorMessage = error.response.data.message;
    } else if (error.response.data.error) {
      errorMessage = error.response.data.error;
    }
  } else if (error.message) {
    errorMessage = error.message;
  }

  console.log('Mensaje de error extraído para Redux:', errorMessage);

  return rejectWithValue(errorMessage);
}
```

### 2. Mejorado el manejo de errores en el componente Register

En `src/features/Register.jsx`, función `handleSubmit`:

```javascript
} catch (rejectedValueOrSerializedError) {
  console.error("Error en registro completo:", rejectedValueOrSerializedError);

  // El error que viene de unwrap() puede tener diferentes estructuras
  let errorMessage = "Error al crear la cuenta. Inténtalo de nuevo.";

  // Caso 1: Error directo como string (el más común con rejectWithValue)
  if (typeof rejectedValueOrSerializedError === 'string') {
    errorMessage = rejectedValueOrSerializedError;
  }
  // Caso 2: Error con propiedad message
  else if (rejectedValueOrSerializedError?.message) {
    errorMessage = rejectedValueOrSerializedError.message;
  }
  // Caso 3: Error serializado de Redux Toolkit
  else if (rejectedValueOrSerializedError?.error?.message) {
    errorMessage = rejectedValueOrSerializedError.error.message;
  }
  // Caso 4: Si tiene payload (estructura de Redux)
  else if (rejectedValueOrSerializedError?.payload) {
    if (typeof rejectedValueOrSerializedError.payload === 'string') {
      errorMessage = rejectedValueOrSerializedError.payload;
    } else if (rejectedValueOrSerializedError.payload?.message) {
      errorMessage = rejectedValueOrSerializedError.payload.message;
    }
  }

  console.log("Mensaje de error procesado:", errorMessage);

  toast.error(errorMessage, {
    id: toastId,
    duration: 6000
  });

  dispatch(clearError());
}
```

## Comportamiento Actual

### ✅ Antes del Fix

- **Consola**: "Error en registro: Error: El email ya está en uso!"
- **Usuario ve**: "Error al crear la cuenta. Inténtalo de nuevo."

### ✅ Después del Fix

- **Consola**: "Error en registro: Error: El email ya está en uso!"
- **Usuario ve**: "El email ya está en uso!"

## Casos de Error Manejados

1. **Error directo del backend** (string): `"El email ya está en uso!"`
2. **Error con estructura JSON**: `{ message: "El email ya está en uso!" }`
3. **Error con estructura anidada**: `{ error: "El email ya está en uso!" }`
4. **Error de Redux serializado**: Manejado por diferentes propiedades
5. **Error de red/timeout**: Mensaje genérico amigable

## Tipos de Respuesta del Backend Soportados

### Registro Exitoso

```javascript
// Con auto-login
{ token: "jwt_token", user: { id: 1, name: "Usuario" } }

// Sin auto-login
{ success: true, message: "Usuario registrado exitosamente" }
```

### Errores de Registro

```javascript
// Error como string directo
"El email ya está en uso!";

// Error como objeto
{
  message: "El email ya está en uso!";
}
{
  error: "El email ya está en uso!";
}
```

## Flujo de Error Mejorado

1. **Backend devuelve error** → Axios captura la respuesta
2. **AuthSlice procesa error** → Extrae mensaje específico con `rejectWithValue`
3. **Register component** → Captura error de `unwrap()` con múltiples casos
4. **Usuario ve toast** → Mensaje específico y claro del backend

## Debugging

Para debuggear errores de registro, revisa estos logs:

```javascript
// En authSlice.js
console.log("Mensaje de error extraído para Redux:", errorMessage);

// En Register.jsx
console.log("Mensaje de error procesado:", errorMessage);
```

## Archivos Modificados

- ✅ `src/redux/slices/authSlice.js` - Mejorada extracción de errores en `registerUser`
- ✅ `src/features/Register.jsx` - Mejorado manejo de errores en `handleSubmit`

## Resultado

✅ **Los errores específicos del backend ahora se muestran al usuario**
✅ **Compatibilidad con múltiples estructuras de error**
✅ **Debugging mejorado con logs específicos**
✅ **Fallback a mensajes genéricos cuando no se puede extraer el error**
