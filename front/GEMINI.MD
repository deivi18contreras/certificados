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
