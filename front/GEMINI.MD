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