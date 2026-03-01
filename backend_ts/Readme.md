# Ecorediduos backend

POST /register Público Crea un nuevo usuario y devuelve una cookie authToken.
POST /login Público Valida credenciales y crea Sesión (Admin) o Cookie JWT (User).
POST /logout Público Destruye la sesión en servidor y limpia las cookies del navegador.
GET /session Autenticado Devuelve los datos del usuario actual si la sesión es válida.
GET / Admin Retorna la lista completa de usuarios registrados.
GET /:id Autenticado Retorna los datos de un usuario específico por su ID numérico.

## Registro de Usuario (POST /register)

```
{
  "nombre": "Esteban",
  "email": "esteban@mail.com",
  "password": "password123",
  "rol": "usuario"
}
```

(El campo rol es opcional, por defecto es "usuario").

Salida (201 Created):

```
{
  "ok": true,
  "role": "usuario",
  "mensaje": "Usuario registrado exitosamente"
}
```

## Inicio de Sesión (POST /login)

Entrada (Body):

```
{
  "email": "admin@ecoresiduos.com",
  "password": "mi_password_seguro"
}

```

Salida (200 OK):

```
{
  "ok": true,
  "role": "administrador",
  "mensaje": "Inicio de sesión exitoso"
}
```

## Verificación de Sesión (GET /session)

Entrada: No requiere body, pero debe enviar las cookies (authToken o connect.sid) automáticamente.

Salida (200 OK):

```
{
  "ok": true,
  "mensaje": "Usuario autenticado.",
  "user": {
    "id": 5,
    "email": "usuario@mail.com",
    "role": "usuario"
  }
}
```

## Manejo de Seguridad y Persistencia

El backend utiliza un flujo de datos seguro basado en tres capas:

Capa de Validación: express-validator comprueba que el email sea real y el password tenga la longitud mínima antes de tocar la lógica del controlador.

Capa de Encriptación: Las contraseñas se transforman mediante bcrypt con un factor de costo de 10. Nunca se guarda el texto plano.

Capa de Autenticación Híbrida:

Administradores/Operadores: Los datos viajan en la sesión del servidor (express-session).

Usuarios: Los datos viajan cifrados en un token JWT dentro de una cookie httpOnly.

## Respuestas de Error Comunes

400 Bad Request: Datos faltantes o ID no válido.

401 Unauthorized: Credenciales incorrectas o sesión expirada.

404 Not Found: El ID de usuario no existe en la base de datos.

409 Conflict: El email ya existe (Error de base de datos 23505).

500 Internal Server Error: Errores inesperados de código o conexión.
