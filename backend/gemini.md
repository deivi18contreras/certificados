
<project_overview>
El Sistema de Registro de Planillas de Pago es una solución diseñada para automatizar el control de prestaciones sociales de los contratistas del SENA (Centro Agroturístico San Gil). El flujo principal consiste en:

El contratista registra los datos de su planilla y selecciona un supervisor.

El sistema realiza web scraping automatizado (resolviendo captchas) para descargar la planilla de la entidad pagadora.

El archivo se guarda automáticamente en el Google Drive del supervisor con la estructura: reporte entidades / [Año] / [Mes de registro] / [Nombre Contratista].pdf.
</project_overview>

<tech_stack>

Runtime: Node.js (LTS).

Lenguaje: JavaScript (ES6+) - No TypeScript.

Framework: Express.js.

ORM: Mongoose (MongoDB Atlas).

Arquitectura: API REST con módulos ESM (import/export).
</tech_stack>


<coding_standards>

Funciones: Preferir Arrow Functions (const miFuncion = () => {}) para middlewares y utilidades.

Asincronía: Usar estrictamente async/await.

Variables: Usar const por defecto; camelCase para nombres.

Errores: Bloques try/catch en controladores pasando el error a next(error).

Modelos: Nombres en Singular y PascalCase; incluir timestamps: true.
</coding_standards>

<folder_structure>

/src/config: Configuración de DB y variables de entorno.

/src/models: Esquemas de Mongoose.

/src/controllers: Lógica de negocio.

/src/routes: Endpoints de Express.

/src/middlewares: Funciones de validación y auth.

/src/utils: Funciones de ayuda (Scraping, Drive API).
</folder_structure>

<database_models>

Contratista (Contratista.js)

Campos: nombres, apellidos, tipoDoc, numeroDoc, eps, expCedula.

Supervisor (Supervisor.js)

Campos: nombre, email (único), password, documento (único).

Reporte (Reporte.js)

Campos: numPlanilla, fechaPago, mesPagado (enum), entidadPagadora (enum).

Relaciones: - contratistaId: Referencia al modelo Contratista.

supervisorId: Referencia al modelo Supervisor.
</database_models>

<functional_requirements>

Gestión de Usuarios: Registro/Auth de supervisores con correo válido y registro de datos de contratistas.

Integración Drive: Vinculación mediante Google Drive API para almacenamiento.

Automatización: Navegación interna para descarga de soportes y resolución de captchas.

Dashboard: Visualización de datos procesados para el supervisor según los mockups.
</functional_requirements>