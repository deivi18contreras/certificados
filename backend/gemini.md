# ⚙️ Backend - Gestión de Certificados y Scraping Automático

Este sistema backend es el motor central encargado de automatizar la gestión, validación y almacenamiento de planillas de seguridad social para contratistas.

## 🎯 Propósito Principal
Automatizar el ciclo de vida de los certificados de seguridad social: desde la solicitud del contratista, pasando por el scraping automático en los operadores de pago, hasta el almacenamiento final en Google Drive para la revisión del supervisor.

## 🏗️ Arquitectura del Sistema

### 1. 🤖 Agente de Scraping (`src/agente/`)
El corazón del sistema, modularizado para una escalabilidad limpia:
- **`scrapingService.js` (Orquestador)**: Recibe las solicitudes de descarga y delega la tarea al scraper específico según el operador de pago.
- **`soiScraper.js`**: Automatiza la descarga de PDFs desde el portal SOI (NuevoSOI).
- **`miplanillaScraper.js`**: Realiza consultas y toma capturas de pantalla de validación en MiPlanilla (Compensar).
- **`scrapingUtils.js`**: Gestor central de rutas de descarga, conversión de formatos de fecha y descompresión de archivos ZIP/PDF.

### 2. 📁 Gestión de Archivos (`src/descargas/`)
Los archivos se organizan dinámicamente en subcarpetas según el operador:
- `descargas/soi/` -> PDFs finales.
- `descargas/miplanilla/` -> Capturas de validación.
- `descargas/aportes/` -> Preparado para Aportes en Línea.
- `descargas/asopagos/` -> Preparado para Asopagos.

### 3. 📊 Modelos de Datos (`src/models/`)
- **Contratista**: Información personal, EPS, tipo/número de documento.
- **Supervisor**: Perfil del encargado de validar los reportes.
- **Reporte**: Estado del trámite, operador de pago, periodo (mes/año) y rutas a los archivos generados.

### 4. 🛰️ Integraciones Externas (`src/utils/`)
- **2Captcha**: Resolución automatizada de reCAPTCHA v2 y captchas de imagen (4-6 caracteres).
- **Google Drive API (`driveService.js`)**: Sincronización automática de los archivos descargados a carpetas compartidas en la nube.
- **ScraperCron (`ScraperCron.js`)**: Programación de tareas automáticas para procesar reportes pendientes.

## 🛠️ Stack Tecnológico
- **Entorno**: Node.js (ES Modules)
- **Framework**: Express.js
- **Base de Datos**: MongoDB con Mongoose.
- **Automatización**: Playwright Extra con Stealth Plugin.
- **Seguridad**: Autenticación vía JWT y encriptación de claves con BcryptJS.

## 📡 Endpoints Principales
- `/api/contratistas`: CRUD y gestión de perfiles de contratistas.
- `/api/reportes`: Registro de nuevas planillas y consulta de estados de descarga.
- `/api/supervisores`: Lógica para la revisión y aprobación de certificados.

## 🔧 Configuración y Ejecución
- **Entorno**: Requiere un archivo `.env` con las claves de MongoDB, 2Captcha, Google Drive y JWT.
- **Modo Desarrollo**: `npm run dev` (vía nodemon).
- **Pruebas del Agente**: `node verificar-agente.js [soi|compensar]` para validar los scrapers de forma aislada.
