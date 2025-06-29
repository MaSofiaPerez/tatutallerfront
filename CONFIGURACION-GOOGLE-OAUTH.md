# Configuración de Google OAuth

## 1. Crear un proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Ve a "APIs & Services" > "Credentials"

## 2. Configurar OAuth 2.0

1. Haz clic en "Create Credentials" > "OAuth 2.0 Client IDs"
2. Selecciona "Web application"
3. Agrega estos dominios autorizados:
   - **JavaScript origins**:
     - `http://localhost:5173` (para desarrollo)
     - `https://tu-dominio.com` (para producción)
   - **Authorized redirect URIs**:
     - `http://localhost:5173` (para desarrollo)
     - `https://tu-dominio.com` (para producción)

## 3. Obtener el Client ID

1. Copia el **Client ID** que se genera
2. Pégalo en tu archivo `.env.local`:

```bash
VITE_GOOGLE_CLIENT_ID=tu-client-id-aqui.apps.googleusercontent.com
```

## 4. Configurar el Backend

Tu backend necesita un endpoint `/auth/google` que:

1. Reciba el credential JWT de Google
2. Verifique la autenticidad del token con Google
3. Extraiga la información del usuario (email, nombre, etc.)
4. Cree o busque el usuario en tu base de datos
5. Genere un JWT token para tu aplicación
6. Devuelva el token y la información del usuario

### Ejemplo de endpoint backend (Node.js/Express):

```javascript
app.post("/auth/google", async (req, res) => {
  try {
    const { credential } = req.body;

    // Verificar el token con Google
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    // Buscar o crear usuario en tu base de datos
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        name,
        profilePicture: picture,
        provider: "google",
      });
    }

    // Generar JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(400).json({ message: "Error en autenticación Google" });
  }
});
```

## 5. Variables de Entorno Necesarias

### Frontend (.env.local):

```bash
VITE_GOOGLE_CLIENT_ID=tu-google-client-id.apps.googleusercontent.com
```

### Backend:

```bash
GOOGLE_CLIENT_ID=tu-google-client-id.apps.googleusercontent.com
JWT_SECRET=tu-jwt-secret
```

## 6. Flujo Completo

1. Usuario hace clic en "Iniciar con Google"
2. Se abre el popup de Google OAuth
3. Usuario autoriza la aplicación
4. Google envía un credential JWT al frontend
5. Frontend envía el credential al backend `/auth/google`
6. Backend verifica el token con Google
7. Backend crea/busca usuario y genera JWT propio
8. Frontend recibe el token y autentica al usuario
9. Usuario es redirigido a la página principal

## 7. Archivos Modificados

- `index.html` - Script de Google OAuth
- `src/redux/slices/authSlice.js` - Thunk y reducers para Google login
- `src/Features/Login.jsx` - Lógica del botón de Google
- `.env.example` - Variable de entorno de ejemplo

## 8. Librerías Backend Recomendadas

```bash
npm install google-auth-library
```

## ⚠️ Importante

- El `VITE_GOOGLE_CLIENT_ID` debe ser el mismo en frontend y backend
- Los dominios autorizados deben coincidir exactamente con tu URL
- Para producción, asegúrate de usar HTTPS
- Nunca expongas el Google Client Secret en el frontend
