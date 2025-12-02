# 🍽️ SmartNutriAI - Interfaz Gráfica

Bienvenido al proyecto SmartNutriAI. Esta es la parte visual de la aplicación donde los usuarios pueden ver su plan nutricional personalizado.

---

## 📋 ¿Qué necesitas tener instalado?

Antes de empezar, asegúrate de tener instalado en tu computadora:

1. **Node.js** (versión 18 o superior)
   - Ve a: https://nodejs.org/
   - Descarga la versión "LTS" (recomendada)
   - Instálala siguiendo las instrucciones

2. **Un editor de código** (opcional pero recomendado)
   - Visual Studio Code: https://code.visualstudio.com/

---

## 🚀 Cómo empezar (Primera vez)

### Paso 1: Descargar las librerías del proyecto

Abre tu terminal (o símbolo del sistema) en la carpeta del proyecto y escribe:

```bash
npm install
```

**¿Qué hace esto?**
Descarga todas las herramientas y librerías que necesita el proyecto para funcionar. Esto puede tardar unos minutos la primera vez.

---

## ▶️ Cómo correr el proyecto

### Paso 2: Iniciar la interfaz gráfica

En la terminal, escribe:

```bash
npm run dev
```

**¿Qué hace esto?**
Arranca el servidor de desarrollo y abre la aplicación en tu navegador.

### Paso 3: Abrir en el navegador

Después de ejecutar el comando anterior, verás algo como:

```
Local: http://localhost:3000
```

Abre tu navegador y ve a esa dirección (normalmente se abre automáticamente).

---

## 🔗 Conectar con el Backend (Importante)

Esta interfaz necesita comunicarse con el backend que tiene la inteligencia artificial (Gemini).

### ¿Qué debes hacer?

1. **Asegúrate de que el backend esté corriendo**
   - El backend debe estar en: `http://127.0.0.1:5000`
   - Si tu compañero tiene el backend en otra dirección, avísale para actualizar la configuración

2. **Si el backend está en otra dirección:**
   - Abre el archivo: `client/src/hooks/useGenerarPlan.ts`
   - Busca la línea que dice: `http://127.0.0.1:5000/api/generar_plan`
   - Cámbiala por la dirección correcta

---

## 🛑 Cómo detener el proyecto

Para detener el servidor, en la terminal presiona:

```
Ctrl + C
```

(En Mac también es `Ctrl + C`, no `Cmd + C`)

---

## 📁 Estructura del proyecto (para que entiendas qué es cada cosa)

```
proyecto/
├── client/                    # Todo lo visual (lo que ves en el navegador)
│   ├── src/
│   │   ├── components/        # Piezas reutilizables (botones, tarjetas, etc.)
│   │   ├── pages/             # Páginas completas (inicio, dashboard, etc.)
│   │   └── hooks/             # Funciones que conectan con el backend
│   └── index.html             # Página principal
│
├── server/                    # Servidor que sirve la aplicación
├── package.json               # Lista de librerías que usa el proyecto
└── README.md                  # Este archivo que estás leyendo
```

---

## 🔧 Comandos útiles

| Comando | ¿Qué hace? |
|---------|------------|
| `npm install` | Descarga todas las librerías necesarias |
| `npm run dev` | Inicia el proyecto en modo desarrollo |
| `npm run build` | Prepara el proyecto para producción |
| `npm run start` | Corre la versión de producción |

---

## ❓ Problemas comunes

### "No se puede encontrar el módulo..."

**Solución:** Ejecuta de nuevo:
```bash
npm install
```

### "El puerto 3000 ya está en uso"

**Solución:** Cierra otras aplicaciones que puedan estar usando ese puerto, o el proyecto te preguntará si quieres usar otro puerto (di que sí).

### "Error de CORS" o "Failed to fetch"

**Solución:** Asegúrate de que:
1. El backend esté corriendo en `http://127.0.0.1:5000`
2. El backend tenga CORS habilitado (tu compañero debe verificar esto)

### La página se ve rara o sin estilos

**Solución:** 
1. Refresca la página con `Ctrl + Shift + R` (o `Cmd + Shift + R` en Mac)
2. Limpia la caché del navegador

---

## 🎯 Flujo de uso de la aplicación

1. **Página de inicio** (`/`)
   - Presentación de la aplicación
   - Botón para comenzar

2. **Onboarding** (`/onboarding`)
   - Formulario de 5 pasos
   - Recopila: edad, peso, altura, objetivos, preferencias

3. **Dashboard** (`/dashboard`)
   - Muestra tu perfil
   - Muestra el plan nutricional generado por IA
   - Opciones para descargar o copiar el plan

---

## 👥 Trabajo en equipo

### Si trabajas con otras personas:

1. **Antes de empezar a trabajar:**
   ```bash
   git pull
   npm install
   ```

2. **Después de hacer cambios:**
   ```bash
   git add .
   git commit -m "Descripción de lo que hiciste"
   git push
   ```

---

## 📞 ¿Necesitas ayuda?

Si algo no funciona:
1. Lee los mensajes de error en la terminal
2. Busca en Google el mensaje de error
3. Pregunta a tu equipo
4. Revisa que todos los pasos anteriores estén correctos

---

## 🎨 Tecnologías usadas (por si tienes curiosidad)

- **React** - Para crear la interfaz
- **TypeScript** - Para escribir código más seguro
- **Tailwind CSS** - Para los estilos y diseño
- **Vite** - Para que todo cargue rápido
- **Wouter** - Para navegar entre páginas

---

**¡Listo! Ya puedes empezar a trabajar en el proyecto.** 🚀
