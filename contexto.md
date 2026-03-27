# Contexto del Proyecto CertiSENA

## Resumen del Backend
- **Framework**: Express.js (Node.js).
- **Base de Datos**: MongoDB (Mongoose).
- **Modelos Principales**:
  - `Supervisor`: Gestión de usuarios administrativos. Maneja autenticación (JWT, contraseñas hasheadas) y almacena credenciales de Google Drive (Tokens OAuth2).
  - `Contratista`: Almacena información de los trabajadores (documento, expedición, EPS).
  - `Reporte`: Historial y estados de las planillas solicitadas (Pendiente, Procesando, Completado, Error). Cuenta con intentos de reintento y almacena los enlaces web nativos de Google Drive (`webViewLink`).
- **Motores y Servicios Core**:
  - **Scrapers (Playwright)**: Lógica automatizada para extraer certificados de diversos portales Pila (SOI, Compensar, Aportes en Línea, Asopagos, Enlace-APB).
  - **Resolución de Captchas**: Integración con la API de `2Captcha`.
  - **Google Drive API**: Creación estructurada de carpetas dinámicas (`Reporte Entidades -> Año -> Mes`) y subida inteligente de los PDF interceptados.
  - **Cron Jobs (`node-cron`)**: Sistema en segundo plano encargado de barrer reportes defectuosos ("Error") o encolados y re-procesarlos.

## Resumen del Frontend
- **Ecosistema**: Vue 3 (Composition API), Vite, Pinia (con persistencia local) y Quasar Framework.
- **Sistema de Ruteo y Vistas**:
  - `HomeView`: Pantalla principal pública.
  - `LoginView`: Login de supervisores integrado con persistencia de credenciales ("Recordarme") y toggle visual de contraseña.
  - `DriveAuthView`: Pantalla interceptora que requiere al supervisor enrolar su cuenta de Google si aún no lo ha hecho.
  - `DashboardView`: Tabla central de gestión filtrada exclusivamente para los reportes del supervisor activo. Incluye filtros de búsqueda por Mes o Año de registro, y botones de redirección automática hacia el visor de Drive.
- **UI/UX**: Estilos customizados con una estética moderna en tonos púrpuras y verdes (paleta SENA), menús de perfil dinámicos y feedback visual de estados de carga (`spinner`).

---

## 📌 Tareas Pendientes para la Próxima Sesión

### 1. Mejoras de Interfaz y Navegación
- [ ] **Unificar botón de Dashboard:** Limpiar los parámetros de la URL de Drive (como `?drive=success`) al interactuar con el Dashboard o estandarizar el botón.
- [ ] **Navegación en Formularios:** Agregar un botón visible de "Inicio" o "Volver al Dashboard" en las vistas de Registrar Contratista o Crear Reporte.
- [ ] **Exportación Visual del Dashboard:** Implementar funcionalidad para descargar la tabla visible del Dashboard como archivo **PDF** y/o **Imagen (PNG/JPEG)**. Debe contemplar la manipulación de múltiples páginas si la grilla excede la vista actual.

### 2. Estabilización y Robustez (Back-End)
- [ ] **CRÍTICO - Manejo Exhaustivo de Errores en Scrapers:** Auditar los spiders (Playwright) para cada operador. Se requiere un manejo granular de errores (tiempos de espera, cambios de DOM, fallas de validación de datos Pila) en vez de catch generales.
- [ ] **Revisión y Ajuste de Cron Jobs:** Validar la frecuencia, carga en memoria e intervención correcta de los Cron Jobs sobre los reportes colgados o fallidos.

### 3. Deuda Técnica y Refactorización
- [ ] **Limpieza Profunda del Código:** 
  - Eliminar rutas y controladores "muertos" o repetidos.
  - Abstraer y simplificar funciones estructuralmente clonadas (DRY - Don't Repeat Yourself).