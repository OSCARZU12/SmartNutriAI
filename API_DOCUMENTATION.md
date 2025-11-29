# 📚 Documentación API - NutrIA

**Base URL:** `http://127.0.0.1:5000`

---

## 📋 Índice de Endpoints

### Autenticación (`/api/auth`)
1. [POST /api/auth/signup](#1-post-apiauthsignup) - Registrar usuario
2. [POST /api/auth/login](#2-post-apiauthlogin) - Iniciar sesión
3. [POST /api/auth/logout](#3-post-apiauthlogout) - Cerrar sesión
4. [POST /api/auth/reset-password](#4-post-apiauthresetpassword) - Resetear contraseña

### Perfil (`/api/profile`)
5. [GET /api/profile](#5-get-apiprofile) - Obtener perfil
6. [POST /api/profile](#6-post-apiprofile) - Crear perfil
7. [PUT /api/profile](#7-put-apiprofile) - Actualizar perfil

### Planes Nutricionales (`/api/plan`)
8. [POST /api/plan/generar](#8-post-apiplangenerar) - Generar plan
9. [GET /api/plan/activo](#9-get-apiplanactivo) - Obtener plan activo
10. [GET /api/plan/historial](#10-get-apiplanhistorial) - Historial de planes
11. [GET /api/plan/:plan_id](#11-get-apiplanplan_id) - Obtener plan por ID
12. [PUT /api/plan/:plan_id/activar](#12-put-apiplanplan_idactivar) - Activar plan

### Utilidades
13. [GET /health](#13-get-health) - Health check

---

## 🔐 Autenticación

### 1. POST /api/auth/signup
Registra un nuevo usuario en el sistema.

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Body (Request):**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Respuesta Exitosa (201):**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "string"
  },
  "session": {
    "access_token": "string",
    "refresh_token": "string"
  }
}
```

**Errores:**
- `400` - Email y contraseña son requeridos
- `400` - Usuario ya existe o error de validación

**Ejemplo Completo:**
```javascript
// Request
fetch('http://127.0.0.1:5000/api/auth/signup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'usuario@ejemplo.com',
    password: 'MiPassword123!'
  })
})

// Response (201)
{
  "success": true,
  "user": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "email": "usuario@ejemplo.com"
  },
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 2. POST /api/auth/login
Inicia sesión con credenciales existentes.

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Body (Request):**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "string",
    "has_profile": boolean
  },
  "session": {
    "access_token": "string",
    "refresh_token": "string"
  }
}
```

**Errores:**
- `400` - Email y contraseña son requeridos
- `401` - Credenciales inválidas

**Ejemplo Completo:**
```javascript
// Request
fetch('http://127.0.0.1:5000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'usuario@ejemplo.com',
    password: 'MiPassword123!'
  })
})

// Response (200)
{
  "success": true,
  "user": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "email": "usuario@ejemplo.com",
    "has_profile": true
  },
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 3. POST /api/auth/logout
Cierra la sesión del usuario actual.

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Body:** No requiere

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Sesión cerrada"
}
```

**Errores:**
- `400` - Error al cerrar sesión

---

### 4. POST /api/auth/reset-password
Envía un email para resetear la contraseña.

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Body (Request):**
```json
{
  "email": "string (required)"
}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Email de recuperación enviado"
}
```

**Errores:**
- `400` - Email es requerido
- `400` - Error al enviar email

---

## 👤 Perfil de Usuario

### 5. GET /api/profile
Obtiene el perfil del usuario autenticado.

**Headers:**
```json
{
  "Authorization": "Bearer {access_token}",
  "Content-Type": "application/json"
}
```

**Body:** No requiere

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "profile": {
    "id": "uuid",
    "user_id": "uuid",
    "edad": number,
    "genero": "string",
    "peso": number,
    "altura": number,
    "actividad": "string",
    "objetivo": "string",
    "tipo_dieta": "string",
    "alergias": ["string"],
    "restricciones": "string",
    "fecha_creacion": "timestamp",
    "fecha_actualizacion": "timestamp"
  }
}
```

**Errores:**
- `401` - No autorizado (token inválido o ausente)
- `404` - Perfil no encontrado
- `500` - Error del servidor

**Ejemplo Completo:**
```javascript
// Request
fetch('http://127.0.0.1:5000/api/profile', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    'Content-Type': 'application/json'
  }
})

// Response (200)
{
  "success": true,
  "profile": {
    "id": "profile-uuid-123",
    "user_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "edad": 28,
    "genero": "masculino",
    "peso": 75.5,
    "altura": 175,
    "actividad": "moderada",
    "objetivo": "perder_peso",
    "tipo_dieta": "omnivora",
    "alergias": ["lactosa", "nueces"],
    "restricciones": "Sin gluten",
    "fecha_creacion": "2025-11-28T10:30:00Z",
    "fecha_actualizacion": "2025-11-28T10:30:00Z"
  }
}
```

---

### 6. POST /api/profile
Crea el perfil del usuario (primera vez).

**Headers:**
```json
{
  "Authorization": "Bearer {access_token}",
  "Content-Type": "application/json"
}
```

**Body (Request):**
```json
{
  "edad": number (required),
  "genero": "string (required)",
  "peso": number (required),
  "altura": number (required),
  "actividad": "string (required)",
  "objetivo": "string (required)",
  "tipo_dieta": "string (required)",
  "alergias": ["string"] (optional),
  "restricciones": "string (optional)"
}
```

**Valores válidos:**
- `genero`: "masculino", "femenino", "otro"
- `actividad`: "sedentaria", "ligera", "moderada", "intensa", "muy_intensa"
- `objetivo`: "perder_peso", "mantener_peso", "ganar_masa_muscular", "mejorar_salud"
- `tipo_dieta`: "omnivora", "vegetariana", "vegana", "keto", "paleo", "mediterranea"

**Respuesta Exitosa (201):**
```json
{
  "success": true,
  "message": "Perfil guardado exitosamente",
  "profile": {
    "id": "uuid",
    "user_id": "uuid",
    "edad": number,
    "genero": "string",
    "peso": number,
    "altura": number,
    "actividad": "string",
    "objetivo": "string",
    "tipo_dieta": "string",
    "alergias": ["string"],
    "restricciones": "string",
    "fecha_creacion": "timestamp"
  }
}
```

**Errores:**
- `400` - Campos requeridos faltantes
- `401` - No autorizado
- `500` - Error del servidor

**Ejemplo Completo:**
```javascript
// Request
fetch('http://127.0.0.1:5000/api/profile', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    edad: 28,
    genero: "masculino",
    peso: 75.5,
    altura: 175,
    actividad: "moderada",
    objetivo: "perder_peso",
    tipo_dieta: "omnivora",
    alergias: ["lactosa", "nueces"],
    restricciones: "Sin gluten"
  })
})

// Response (201)
{
  "success": true,
  "message": "Perfil guardado exitosamente",
  "profile": {
    "id": "profile-uuid-123",
    "user_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "edad": 28,
    "genero": "masculino",
    "peso": 75.5,
    "altura": 175,
    "actividad": "moderada",
    "objetivo": "perder_peso",
    "tipo_dieta": "omnivora",
    "alergias": ["lactosa", "nueces"],
    "restricciones": "Sin gluten",
    "fecha_creacion": "2025-11-28T10:30:00Z"
  }
}
```

---

### 7. PUT /api/profile
Actualiza el perfil existente del usuario.

**Headers:**
```json
{
  "Authorization": "Bearer {access_token}",
  "Content-Type": "application/json"
}
```

**Body (Request):**
```json
{
  "edad": number (optional),
  "genero": "string (optional)",
  "peso": number (optional),
  "altura": number (optional)",
  "actividad": "string (optional)",
  "objetivo": "string (optional)",
  "tipo_dieta": "string (optional)",
  "alergias": ["string"] (optional),
  "restricciones": "string (optional)"
}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Perfil actualizado exitosamente",
  "profile": {
    "id": "uuid",
    "user_id": "uuid",
    "edad": number,
    "genero": "string",
    "peso": number,
    "altura": number,
    "actividad": "string",
    "objetivo": "string",
    "tipo_dieta": "string",
    "alergias": ["string"],
    "restricciones": "string",
    "fecha_actualizacion": "timestamp"
  }
}
```

**Errores:**
- `400` - No se pudo actualizar el perfil
- `401` - No autorizado
- `500` - Error del servidor

---

## 🍽️ Planes Nutricionales

### 8. POST /api/plan/generar
Genera un nuevo plan nutricional personalizado usando IA.

**Headers:**
```json
{
  "Authorization": "Bearer {access_token}",
  "Content-Type": "application/json"
}
```

**Body (Request):**
```json
{
  "duracion": "string (optional, default: '1 semana')",
  "prompt_adicional": "string (optional)"
}
```

**Valores válidos para `duracion`:**
- "1 semana"
- "2 semanas"
- "1 mes"

**Respuesta Exitosa (201):**
```json
{
  "success": true,
  "plan": {
    "id": "uuid",
    "contenido": "string (plan generado por IA)",
    "duracion": "string",
    "fecha_generacion": "timestamp"
  }
}
```

**Errores:**
- `400` - Debes completar tu perfil antes de generar un plan
- `401` - No autorizado
- `500` - Error al generar el plan

**Ejemplo Completo:**
```javascript
// Request
fetch('http://127.0.0.1:5000/api/plan/generar', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    duracion: "1 semana",
    prompt_adicional: "Prefiero comidas rápidas de preparar"
  })
})

// Response (201)
{
  "success": true,
  "plan": {
    "id": "plan-uuid-456",
    "contenido": "# Plan Nutricional Personalizado\n\n## Lunes\n### Desayuno\n- Avena con frutas...",
    "duracion": "1 semana",
    "fecha_generacion": "2025-11-28T11:00:00Z"
  }
}
```

---

### 9. GET /api/plan/activo
Obtiene el plan nutricional activo del usuario.

**Headers:**
```json
{
  "Authorization": "Bearer {access_token}",
  "Content-Type": "application/json"
}
```

**Body:** No requiere

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "plan": {
    "id": "uuid",
    "user_id": "uuid",
    "duracion": "string",
    "contenido": "string",
    "activo": true,
    "fecha_generacion": "timestamp",
    "datos_usuario": {
      "edad": number,
      "peso": number,
      "altura": number,
      "objetivo": "string"
    }
  }
}
```

**Errores:**
- `401` - No autorizado
- `404` - No tienes un plan activo
- `500` - Error del servidor

---

### 10. GET /api/plan/historial
Obtiene el historial de planes del usuario.

**Headers:**
```json
{
  "Authorization": "Bearer {access_token}",
  "Content-Type": "application/json"
}
```

**Query Parameters:**
- `limit` (optional): Número de planes a retornar (default: 10)

**Ejemplo URL:** `/api/plan/historial?limit=5`

**Body:** No requiere

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "planes": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "duracion": "string",
      "contenido": "string",
      "activo": boolean,
      "fecha_generacion": "timestamp"
    }
  ]
}
```

**Errores:**
- `401` - No autorizado
- `500` - Error del servidor

---

### 11. GET /api/plan/:plan_id
Obtiene un plan específico por su ID.

**Headers:**
```json
{
  "Authorization": "Bearer {access_token}",
  "Content-Type": "application/json"
}
```

**URL Parameters:**
- `plan_id` (required): UUID del plan

**Body:** No requiere

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "plan": {
    "id": "uuid",
    "user_id": "uuid",
    "duracion": "string",
    "contenido": "string",
    "activo": boolean,
    "fecha_generacion": "timestamp",
    "datos_usuario": {}
  }
}
```

**Errores:**
- `401` - No autorizado
- `404` - Plan no encontrado
- `500` - Error del servidor

---

### 12. PUT /api/plan/:plan_id/activar
Marca un plan como activo (desactiva otros planes).

**Headers:**
```json
{
  "Authorization": "Bearer {access_token}",
  "Content-Type": "application/json"
}
```

**URL Parameters:**
- `plan_id` (required): UUID del plan a activar

**Body:** No requiere

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Plan activado exitosamente",
  "plan": {
    "id": "uuid",
    "user_id": "uuid",
    "duracion": "string",
    "contenido": "string",
    "activo": true,
    "fecha_generacion": "timestamp"
  }
}
```

**Errores:**
- `400` - No se pudo activar el plan
- `401` - No autorizado
- `500` - Error del servidor

---

## 🏥 Utilidades

### 13. GET /health
Verifica que la API esté funcionando.

**Headers:** No requiere

**Body:** No requiere

**Respuesta Exitosa (200):**
```json
{
  "status": "ok",
  "message": "NutrIA API funcionando"
}
```

---

## 🔑 Manejo de Autenticación en Frontend

### Guardar Token después del Login/Signup
```javascript
const response = await fetch('http://127.0.0.1:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

const data = await response.json();

if (data.success) {
  // Guardar tokens en localStorage
  localStorage.setItem('access_token', data.session.access_token);
  localStorage.setItem('refresh_token', data.session.refresh_token);
  localStorage.setItem('user_id', data.user.id);
}
```

### Usar Token en Requests Protegidos
```javascript
const token = localStorage.getItem('access_token');

const response = await fetch('http://127.0.0.1:5000/api/profile', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### Logout
```javascript
await fetch('http://127.0.0.1:5000/api/auth/logout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
});

// Limpiar localStorage
localStorage.removeItem('access_token');
localStorage.removeItem('refresh_token');
localStorage.removeItem('user_id');
```

---

## ⚠️ Códigos de Error Comunes

| Código | Significado | Solución |
|--------|-------------|----------|
| 400 | Bad Request | Verifica que todos los campos requeridos estén presentes |
| 401 | Unauthorized | Token inválido o ausente, vuelve a hacer login |
| 404 | Not Found | El recurso solicitado no existe |
| 500 | Server Error | Error interno del servidor, contacta soporte |

---

## 📝 Notas Importantes

1. **Todos los endpoints protegidos requieren el header `Authorization: Bearer {token}`**
2. **Los tokens se obtienen en `/api/auth/login` o `/api/auth/signup`**
3. **Debes crear un perfil antes de generar planes nutricionales**
4. **Las respuestas siempre incluyen `success: true/false`**
5. **Los errores siempre tienen formato `{ "error": "mensaje" }`**
6. **En producción, cambia la URL base a tu dominio real**
7. **Configura CORS apropiadamente para tu frontend en producción**

---

## 🚀 Flujo Típico de Usuario

1. **Registro:** `POST /api/auth/signup`
2. **Login:** `POST /api/auth/login` → Guardar token
3. **Crear Perfil:** `POST /api/profile` → Con datos del usuario
4. **Generar Plan:** `POST /api/plan/generar` → Recibir plan personalizado
5. **Ver Plan Activo:** `GET /api/plan/activo`
6. **Ver Historial:** `GET /api/plan/historial`
