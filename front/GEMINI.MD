# Frontend - CertiSENA (Sistema Automatizado de Planillas SENA)

## Descripción General

Aplicación SPA construida con **Vue 3 (Composition API) + Quasar Framework + Vite**. Permite dos flujos de usuario:

1. **Contratistas** → Registran su planilla mensual (formulario público, sin login)
2. **Supervisores** → Se autentican, vinculan Google Drive, y auditan los reportes en un dashboard

---

## Estructura del Proyecto

```
front/
├── index.html                    # HTML base (entry point de Vite)
├── vite.config.js                # Configuración Vite + plugins Vue/Quasar
├── package.json                  # Dependencias y scripts
│
└── src/
    ├── main.js                   # Bootstrap: Vue + Pinia + Router + Quasar
    ├── App.vue                   # Layout principal: navbar + router-view + footer
    ├── quasar-variables.sass     # Variables de tema Quasar (colores brand)
    │
    ├── assets/
    │   └── main.css              # 🎨 Design System: variables CSS, cards, botones, tablas, badges
    │
    ├── router/
    │   └── index.js              # Vue Router con navigation guards (auth)
    │
    ├── stores/                   # Pinia Stores (estado global)
    │   ├── auth.js               # Token JWT, datos de usuario, login/logout
    │   └── reportes.js           # Lista de reportes y contratistas (cache)
    │
    ├── services/                 # Capa de comunicación con el backend
    │   ├── axios.js              # Instancia Axios con baseURL e interceptor de token
    │   ├── apiSupervisor.js      # login, getSupervisors, getProfile
    │   ├── apiContratista.js     # getContratistas, getByDoc, register, update
    │   └── apiReporte.js         # getReportes, registerReporte
    │
    ├── components/               # Componentes reutilizables (vacío actualmente)
    │
    └── views/                    # Páginas/vistas del router
        ├── HomeView.vue          # Pantalla de inicio: 2 caminos (Supervisor / Contratista)
        ├── LoginView.vue         # Login de supervisor (email + password)
        ├── DriveAuthView.vue     # Vinculación de Google Drive (OAuth2 real)
        ├── DashboardView.vue     # Tabla de reportes con filtros (solo supervisores)
        ├── RegisterPlanillaView.vue  # 📋 Formulario principal de registro de planilla
        └── ConfirmationView.vue  # Pantalla de éxito post-registro
```

---

## Rutas y Navegación

| Ruta | Nombre | Vista | Auth | Descripción |
|---|---|---|---|---|
| `/` | `home` | `HomeView` | ❌ | Inicio: elige Supervisor o Contratista |
| `/login` | `login` | `LoginView` | ❌ | Login de supervisor |
| `/permisos` | `permisos` | `DriveAuthView` | ✅ | Vinculación Google Drive |
| `/dashboard` | `dashboard` | `DashboardView` | ✅ | Tabla de reportes del supervisor |
| `/registrar-planilla` | `registrar-planilla` | `RegisterPlanillaView` | ❌ | Formulario de contratista |
| `/confirmacion` | `confirmacion` | `ConfirmationView` | ❌ | Éxito post-registro |

**Navigation Guard:** Las rutas con `meta.requiresAuth: true` redirigen a `/login` si no hay token.

---

## Vistas en Detalle

### HomeView.vue
Pantalla de bienvenida con 2 cards interactivas:
- **Supervisores** → Navega a `/login`
- **Contratistas** → Navega a `/registrar-planilla`

### LoginView.vue
Formulario de login para supervisores:
- Campos: email + password
- Al autenticar: guarda token y datos en Pinia → redirige a `/permisos`
- Usa `apiSupervisor.loginSupervisor()`

### DriveAuthView.vue
Pantalla para vincular Google Drive:
- Llama al endpoint `GET /api/supervisors/google/auth/:id` para obtener URL OAuth
- Redirige al usuario a Google para autorizar
- Botón "Omitir" → va directo al Dashboard
- **Nota:** Requiere credenciales de Google configuradas en el backend

### RegisterPlanillaView.vue ⭐ (Vista principal)
Formulario multi-sección con flujo progresivo:

**Sección 1 - Identificación:**
- Tipo de documento + Número de documento
- Botón 🔍 busca si el contratista ya existe (`GET /api/contratistas/documento/:num`)
- Si existe → autocompleta nombres, apellidos, EPS (campos deshabilitados)
- Si no existe → muestra campos vacíos para registrar

**Sección 2 - Detalles de Planilla** (aparece después de buscar):
- Operador de pago: asopagos, SOI, compensar, Aportes en linea
- Campos condicionales según operador:
  - **Compensar:** Número planilla, Valor pagado, Fecha de pago
  - **Aportes en Línea:** Fecha expedición cédula
- Mes y Año a reportar
- Selector de supervisor (cargados desde API)

**Submit:**
1. Si contratista nuevo → `POST /api/contratistas`
2. Crea reporte → `POST /api/reportes` (dispara scraping automático en backend)
3. Redirige a `/confirmacion`

### DashboardView.vue
Tabla de reportes con:
- **Filtros:** búsqueda por texto (nombre/cédula/operador), filtro por mes y año
- **Columnas:** Contratista (avatar + nombre + cédula), Operador, Planilla, Mes, Monto, Fecha Pago, Acciones
- **Acciones:** Botones de ver y descargar (funcionalidad pendiente de implementar)
- Botón "Actualizar" y "Exportar Lista" en header

### ConfirmationView.vue
Pantalla simple de éxito con:
- Icono check verde
- Mensaje de confirmación
- Botones: "Volver al Inicio" y "Registrar otra planilla"

---

## Stores (Pinia)

### auth.js
```
State: token, user, rol
Computed: isAuthenticated
Actions: login(userData, token), logout()
Persistencia: Activa (localStorage)
```

### reportes.js
```
State: reportes[], contratistas[], loading
Actions: setReportes(data), setContratistas(data)
```

---

## Servicios API

Todos los servicios usan la instancia centralizada de `axios.js`:
- **Base URL:** `http://localhost:4000/api` (configurable via `VITE_API_URL`)
- **Timeout:** 10 segundos
- **Interceptor:** Agrega `Authorization: Bearer {token}` automáticamente

| Servicio | Funciones |
|---|---|
| `apiSupervisor.js` | `loginSupervisor`, `getSupervisors`, `getSupervisorProfile` |
| `apiContratista.js` | `getContratistas`, `getContratistaByDoc`, `registerContratista`, `updateContratista` |
| `apiReporte.js` | `getReportes`, `registerReporte` |

---

## Design System (main.css)

### Variables CSS
| Variable | Valor | Uso |
|---|---|---|
| `--sena-green` | `#39A900` | Color primario SENA, botones de acción |
| `--sena-purple` | `#6750A4` | Color secundario, navbar, acentos |
| `--sena-purple-gradient` | `linear-gradient(...)` | Navbar, avatares |
| `--sena-text-dark` | `#1C1B1F` | Texto principal |
| `--sena-text-light` | `#49454F` | Texto secundario |

### Componentes CSS globales
- `.card` — Contenedor con sombra y borde sutil
- `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-outline` — Sistema de botones
- `.form-group`, `.form-input` — Inputs estilizados
- `.custom-table` — Tabla con header morado
- `.badge`, `.badge-secondary` — Etiquetas de estado

---

## Variables de Entorno del Frontend

| Variable | Descripción | Default |
|---|---|---|
| `VITE_API_URL` | URL base del backend | `http://localhost:4000/api` |

Se configura en `.env` o `.env.example` del frontend.

---

## Dependencias Principales

| Paquete | Versión | Uso |
|---|---|---|
| `vue` | ^3.5 | Framework reactivo |
| `vue-router` | ^4.6 | Enrutamiento SPA |
| `pinia` | ^3.0 | Estado global |
| `pinia-plugin-persistedstate` | ^4.7 | Persistencia en localStorage |
| `quasar` | ^2.18 | UI Framework (Notify, Loading, Material Icons) |
| `axios` | ^1.13 | Cliente HTTP |
| `vite` | ^7.3 | Bundler de desarrollo |
| `@quasar/vite-plugin` | ^1.10 | Plugin Quasar para Vite |
| `sass-embedded` | ^1.97 | Compilador SASS para Quasar |

---

## Comandos

```bash
npm run dev      # Servidor de desarrollo (Vite, hot reload)
npm run build    # Build de producción → dist/
npm run preview  # Preview del build de producción
```

---

## Pendientes / TODOs

- [ ] Implementar funcionalidad real de descarga y visualización en Dashboard
- [ ] Implementar botón "Exportar Lista" (exportar a PDF/Excel)
- [ ] Mostrar columna de status del reporte (Pendiente/Procesando/Completado/Error)
- [ ] Agregar componentes reutilizables según crezca la UI
- [ ] Agregar responsive/mobile para el formulario de registro
