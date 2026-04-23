# Backend - CertiSENA (Sistema Automatizado de Planillas SENA)

## Descripción General

API REST construida con **Node.js + Express 5 + MongoDB (Mongoose 9)**. Gestiona el flujo completo de descarga automatizada de certificados de pago de seguridad social (planillas PILA) para contratistas del SENA.

El backend se encarga de:
1. **Registrar** supervisores (autenticación JWT) y contratistas
2. **Recibir reportes** de planilla de los contratistas (formulario del frontend)
3. **Ejecutar scrapers** automáticos (Playwright + Stealth) que descargan los PDFs de los operadores de pago
4. **Subir los PDFs** a Google Drive organizados por carpetas (año > operador > mes)
5. **Cron Job** que reintenta descargas pendientes o fallidas cada 5 minutos

---

## Estructura del Proyecto

```
backend/
├── app.js                        # Entry point: Express, middlewares, rutas, cron
├── .env                          # Variables de entorno (no commitear)
├── .env.example                  # Plantilla de variables de entorno
├── package.json                  # Dependencias y scripts
│
├── seed-data.js                  # Script para poblar la BD con datos de prueba
├── seed-supervisors.js           # Script para crear supervisores iniciales
├── verificar-agente.js           # Script de prueba para verificar Playwright
├── verify-data.js                # Script para verificar datos en MongoDB
│
└── src/
    ├── config/
    │   └── dataBase.js           # Conexión a MongoDB con Mongoose
    │
    ├── models/
    │   ├── Contratista.js        # Modelo: datos personales, EPS, tipo/num doc
    │   ├── Reporte.js            # Modelo: vincula contratista+supervisor+operador+periodo
    │   └── Supervisor.js         # Modelo: auth (email/password), tokens de Google
    │
    ├── controllers/
    │   ├── contratistaController.js  # CRUD contratistas + búsqueda por documento
    │   ├── reporteController.js      # Crear reporte + dispara scraping inmediato
    │   └── supervisorController.js   # Registro/Login JWT + Google OAuth2
    │
    ├── routes/
    │   ├── contratistaRoutes.js   # GET /, GET /documento/:num, POST /, PUT /:id
    │   ├── reporteRoutes.js       # GET /, GET /dashboard/:id, POST /
    │   └── supervisorRoutes.js    # GET /, POST /, POST /login, GET /profile, Google OAuth
    │
    ├── middlewares/
    │   ├── authMiddleware.js      # Protección JWT (Bearer token)
    │   └── errorMiddleware.js     # Handler centralizado de errores
    │
    ├── agente/                    # 🤖 Scrapers de Playwright
    │   ├── scrapingUtils.js       # Utilidades compartidas: rutas de descarga, handleDownload, monthToNumber
    │   ├── soiScraper.js          # Scraper SOI ✅ (descarga PDF vía formulario + reCAPTCHA)
    │   └── miplanillaScraper.js   # Scraper Compensar/MiPlanilla ✅ (captura PNG)
    │
    ├── descargas/                 # 📁 Archivos descargados organizados por operador
    │   ├── soi/                   # PDFs de SOI
    │   ├── miplanilla/            # Capturas de Compensar
    │   ├── aportes/               # (Futuro) PDFs de Aportes en Línea
    │   └── asopagos/              # (Futuro) PDFs de Asopagos
    │
    └── utils/
        ├── scrapingService.js     # Orquestador: lanza browser, decide qué scraper usar
        ├── reportProcessor.js     # Pipeline completo: scraping → guardar local → subir Drive
        ├── captchaService.js      # Servicio 2Captcha (reCAPTCHA v2 + imagen)
        ├── driveService.js        # Subida a Google Drive con carpetas organizadas
        └── ScraperCron.js         # Cron cada 5 min: busca reportes Pendiente/Error
```

---

## Modelos de Datos

### Contratista
| Campo | Tipo | Requerido | Notas |
|---|---|---|---|
| `nombres` | String | ✅ | |
| `apellidos` | String | ✅ | |
| `tipoDocumento` | String (enum) | ✅ | CC, CE, PEP, PPT, NIT |
| `numeroDocumento` | String | ✅ | Único |
| `fechaExpedicion` | Date | ❌ | Necesario para Aportes en Línea |
| `eps` | String | ✅ | |
| `tipoCotizante` | String | ❌ | Default: "Independiente" |
| `tipoCertificado` | String | ❌ | Default: "Aportes" |

### Reporte
| Campo | Tipo | Requerido | Notas |
|---|---|---|---|
| `contratista` | ObjectId (ref) | ✅ | Ref → Contratista |
| `supervisor` | ObjectId (ref) | ✅ | Ref → Supervisor |
| `operadorPago` | String (enum) | ✅ | SOI, Compensar MiPlanilla, Aportes en Línea, Asopagos, Enlace-APB |
| `periodoPago` | { mes, anio } | ✅ | |
| `datosOperador` | Map<String> | ❌ | Datos dinámicos: numeroPlanilla, valorPagado, fechaPago |
| `status` | String (enum) | — | Pendiente → Procesando → Completado/Error |
| `intentos` | Number | — | Max 3 reintentos vía cron |
| `archivoUrl` | String | — | ID de archivo en Google Drive |
| `errorLog` | String | — | Mensaje del último error |

### Supervisor
| Campo | Tipo | Requerido | Notas |
|---|---|---|---|
| `nombre` | String | ✅ | |
| `email` | String | ✅ | Único, lowercase |
| `password` | String | ✅ | Hasheado con bcrypt |
| `documento` | String | ✅ | Único |
| `googleTokens` | Object | ❌ | OAuth2 tokens de Google Drive |

---

## Endpoints API

### Supervisores (`/api/supervisors`)
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `GET` | `/` | ❌ | Lista todos los supervisores (sin password) |
| `POST` | `/` | ❌ | Registrar nuevo supervisor |
| `POST` | `/login` | ❌ | Login → devuelve JWT |
| `GET` | `/profile` | ✅ JWT | Perfil del supervisor autenticado |
| `GET` | `/google/auth/:id` | ❌ | Obtener URL de autorización Google OAuth2 |
| `GET` | `/google/callback` | ❌ | Callback de Google: guarda tokens en supervisor |

### Contratistas (`/api/contratistas`)
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `GET` | `/` | ❌ | Lista todos los contratistas |
| `GET` | `/documento/:num` | ❌ | Buscar contratista por número de documento |
| `POST` | `/` | ❌ | Registrar nuevo contratista |
| `PUT` | `/:id` | ✅ JWT | Actualizar contratista (solo supervisor) |

### Reportes (`/api/reportes`)
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `GET` | `/` | ❌ | Lista todos los reportes (con populate) |
| `GET` | `/dashboard/:supervisorId` | ❌ | Reportes de un supervisor específico |
| `POST` | `/` | ❌ | Crear reporte → dispara scraping inmediato |

---

## Flujo de Scraping

```
1. Contratista envía formulario (POST /api/reportes)
2. reporteController crea Reporte con status "Pendiente"
3. Se llama processSingleReport() de forma asíncrona (no bloquea respuesta)
4. reportProcessor cambia status a "Procesando"
5. scrapingService lanza Playwright con Stealth
6. Según operadorPago, llama al scraper correspondiente:
   - SOI → soiScraper.js → descarga PDF
   - Compensar → miplanillaScraper.js → captura PNG
   - Aportes en Línea → (TODO: por implementar)
   - Asopagos → (TODO: por implementar)
7. El archivo se guarda en backend/src/descargas/{operador}/
8. Si el supervisor tiene googleTokens → sube a Google Drive
9. Status cambia a "Completado" o "Error"
```

El **Cron Job** (`ScraperCron.js`) cada 5 minutos busca reportes con status "Pendiente" o "Error" (con menos de 3 intentos) y los reprocesa.

---

## Variables de Entorno Requeridas

| Variable | Descripción | Ejemplo |
|---|---|---|
| `PORT` | Puerto del servidor | `4000` |
| `MONGODB_URI` | URI de MongoDB | `mongodb://localhost:27017/certificados_sena` |
| `JWT_SECRET` | Clave secreta para JWT | `mi_clave_super_secreta` |
| `GOOGLE_CLIENT_ID` | Client ID de Google OAuth2 | `xxxx.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Client Secret de Google | `GOCSPX-xxxxx` |
| `GOOGLE_REDIRECT_URI` | Callback URI para OAuth | `http://localhost:4000/api/supervisors/google/callback` |
| `TWO_CAPTCHA_API_KEY` | API Key de 2Captcha | `d4f4e5c4e4eb...` |
| `FRONTEND_URL` | URL del frontend (para redirects) | `http://localhost:5173` |
| `HEADLESS` | Playwright headless mode | `true` o `false` |

---

## Dependencias Principales

| Paquete | Uso |
|---|---|
| `express` v5 | Framework HTTP |
| `mongoose` v9 | ODM para MongoDB |
| `jsonwebtoken` | Auth JWT |
| `bcryptjs` | Hash de passwords |
| `playwright` + `playwright-extra` + `stealth` | Web scraping con anti-detección |
| `2captcha` + `axios` | Resolución de CAPTCHAs |
| `googleapis` | Google Drive API |
| `node-cron` | Tareas programadas |
| `cors`, `morgan`, `dotenv` | Utilidades de servidor |
| `adm-zip` | Extracción de PDFs desde ZIPs descargados |

---

## Comandos

```bash
npm run dev    # Inicia con nodemon (desarrollo)
npm start      # Inicia con node (producción)
```

---

## Estado de los Scrapers

| Operador | Archivo | Estado | Tipo de resultado |
|---|---|---|---|
| SOI | `agente/soiScraper.js` | ✅ Operativo | PDF descargado |
| Compensar/MiPlanilla | `agente/miplanillaScraper.js` | ✅ Operativo | Captura PNG |
| Aportes en Línea | — | 🔜 Por implementar | — |
| Asopagos/Enlace-APB | — | 🔜 Por implementar | — |
