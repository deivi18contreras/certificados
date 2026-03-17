<<<<<<< HEAD
# Contexto del Proyecto: Frontend - Certificados SENA

Este proyecto es el frontend para un sistema de gestión y automatización de certificados y reportes para contratistas del SENA. 
El sistema tiene dos roles principales y flujos distintos según los mockups definidos:

1. **Supervisores (Flujo Superior):** Inician sesión, registran/vinculan su Google Drive con la API de Google Drive, pueden mirar todas las planillas y descargar reportes.
2. **Contratistas (Flujo Inferior):** Solamente registran su planilla PILA y su confirmación de que sí quedó registrada.

**Enlace de Mockups a replicar:** https://stitch.withgoogle.com/projects/2060183493876786157
*(Nota para la IA: De izquierda a derecha es el flujo. El camino de arriba es para supervisores y el de abajo para contratistas).*

## Stack Tecnológico Estricto
La IA DEBE utilizar ÚNICAMENTE las siguientes tecnologías y versiones definidas en el `package.json`:
- **Framework Core:** Vue 3 (v3.5+).
- **UI Framework:** Quasar Framework (v2.18+). NO usar Tailwind ni Bootstrap.
- **Manejo de Estado:** Pinia con `pinia-plugin-persistedstate`.
- **Enrutamiento:** Vue Router (v5+).
- **Peticiones HTTP:** Axios.
- **Herramienta de Construcción:** Vite.

## Estructura de Carpetas Requerida
```text
src/
├── assets/         
├── components/     
├── composables/    
├── layouts/        
├── plugins/        
├── router/         
├── services/       
├── stores/         
├── styles/         
└── views/
=======
# 🌐 Frontend - Aplicación de Certificados

Este frontend permite a los contratistas y supervisores gestionar el registro y descarga de planillas de seguridad social.

## 🚀 Arquitectura del Frontend (`src`)
La aplicación está construida sobre **Vue.js** con **Quasar Framework** para una interfaz moderna y eficiente.

- **Vistas (`views/`)**:
  - **`LoginView.vue`**: Inicio de sesión de usuarios.
  - **`RegisterPlanillaView.vue`**: Formulario dinámico para registrar pagos de planillas según el operador.
  - **`DashboardView.vue`**: Panel de control para el seguimiento de reportes.
  - **`DriveAuthView.vue`**: Configuración de acceso a Google Drive.

- **Servicios (`services/`)**:
  - **`apiReporte.js`**: Comunicación con el backend para la creación y consulta de reportes.
  - **`apiContratista.js` / `apiSupervisor.js`**: Gestión de datos de perfiles.
  - **`axios.js`**: Cliente HTTP configurado para la comunicación con el servidor backend.

- **Almacenamiento (`stores/`)**:
  - **`auth.js`**: Gestión del estado de autenticación (Pinia).
  - **`reportes.js`**: Cache y estado de los reportes en curso.

## 🛠️ Tecnologías Principales
- **Vue.js 3**: Framework reactivo para la UI.
- **Quasar Framework**: Componentes UI optimizados para escritorio y móviles.
- **Pinia**: Gestión de estados globales.
- **Vite**: Motor de construcción rápido para desarrollo.

## 🎨 Características UI
- Diseño basado en Material Design (Quasar).
- Carga dinámica de campos según el operador de pago seleccionado (por ejemplo, MiPlanilla requiere datos adicionales como el valor pagado).
- Feedback en tiempo real sobre el estado del scraping.
>>>>>>> 64a23765abc45485dc75a2b30e320819c64f389c
