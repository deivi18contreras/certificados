<template>
  <div class="container">
    <div class="hero-section">
      <h1>Sistema Automatizado de Planillas SENA</h1>
      <p class="subtitle">Gestione eficientemente los reportes de pago, contratistas y certificados desde un solo lugar.</p>
    </div>

    <div class="grid">
      <router-link to="/register-reporte" class="card action-card">
        <div class="icon-circle bg-blue">
          <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
        </div>
        <h3>Registrar Reporte</h3>
        <p>Inicie el proceso de carga y validación de una nueva planilla de aportes.</p>
      </router-link>

      <router-link to="/reportes" class="card action-card">
        <div class="icon-circle bg-green">
          <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
        </div>
        <h3>Historial de Pagos</h3>
        <p>Consulte y descargue el histórico de reportes procesados por el sistema.</p>
      </router-link>

      <router-link to="/contratistas" class="card action-card">
        <div class="icon-circle bg-orange">
          <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
        </div>
        <h3>Contratistas</h3>
        <p>Administre la información personal y de contacto de los contratistas.</p>
      </router-link>

      <router-link to="/supervisores" class="card action-card">
        <div class="icon-circle bg-purple">
          <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
        </div>
        <h3>Supervisores</h3>
        <p>Gestione el equipo de supervisión encargado de validar los reportes.</p>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.hero-section {
  text-align: center;
  margin: 3rem 0;
}
.hero-section h1 {
  font-size: 2.5rem;
  color: #202124;
}
.subtitle {
  font-size: 1.2rem;
  color: #5f6368;
  max-width: 700px;
  margin: 0 auto;
}
.action-card {
  text-align: center;
  padding: 2.5rem 1.5rem;
  transition: transform 0.3s, box-shadow 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid transparent;
}
.action-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  border-color: #e8f0fe;
}
.icon-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  color: white;
}
.bg-blue { background-color: #1a73e8; }
.bg-green { background-color: #34a853; }
.bg-orange { background-color: #fbbc04; }
.bg-purple { background-color: #a142f4; }

h3 { margin-bottom: 0.8rem; }
p { color: #5f6368; font-size: 0.95rem; }
</style>
