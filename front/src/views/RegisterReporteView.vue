<script setup>
// Lógica eliminada
</script>

<template>
  <div class="container">
    <div class="card">
      <div class="header">
        <h1>Registrar Reporte de Pago</h1>
        <div class="badge">Robot Activo</div>
      </div>
      <p style="color: #5f6368; margin-bottom: 2rem;">
        Complete la información de su pago. El sistema descargará automáticamente el certificado y lo guardará en el Drive de su supervisor.
      </p>
      
      <form>
        <!-- Selección de Operador -->
        <div class="form-group">
          <label>Operador de Pago:</label>
          <select class="select-operador">
            <option value="" disabled>Seleccione entidad operador</option>
            <option value="Aportes en Línea">Aportes en Línea</option>
            <option value="Compensar MiPlanilla">Compensar MiPlanilla</option>
            <option value="SOI">SOI</option>
            <option value="Asopagos">Asopagos (Enlace APB)</option>
          </select>
        </div>

        <div class="grid">
          <div class="form-group">
            <label>Contratista:</label>
            <select>
              <option value="" disabled>Seleccione contratista</option>
            </select>
          </div>

          <div class="form-group">
            <label>Supervisor:</label>
            <select>
              <option value="" disabled>Asignar supervisor</option>
            </select>
          </div>
        </div>

        <!-- Campos Dinámicos -->
        <div class="dynamic-fields-section">
          <h3 class="section-title">Datos específicos</h3>
          
          <div class="grid">
            <div class="form-group">
              <label>Entidad EPS:</label>
              <input type="text" placeholder="Ej: Sanitas, Sura..." />
            </div>

            <div class="form-group">
              <label>Número de Planilla:</label>
              <input type="text" placeholder="Obligatorio" />
            </div>
          </div>

          <div class="grid">
            <div class="form-group">
              <label>Valor Pagado:</label>
              <input type="number" placeholder="0" />
            </div>

            <div class="form-group">
              <label>Periodo Pagado:</label>
              <div class="periodo-inputs">
                <select>
                  <option value="" disabled>Mes</option>
                </select>
                <input type="number" placeholder="Año" />
              </div>
            </div>
          </div>
        </div>

        <div style="margin-top: 2rem;">
          <button type="submit" class="btn btn-primary">
            Confirmar y Enviar al Robot
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
}
.card {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  border-top: 5px solid #38a900;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.badge {
  background: #e8f5e9;
  color: #2e7d32;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: bold;
}
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}
.form-group {
  margin-bottom: 1.25rem;
}
label {
  display: block;
  margin-bottom: 0.6rem;
  font-weight: 600;
  color: #3c4043;
}
input, select {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #dadce0;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;
}
input:focus, select:focus {
  outline: none;
  border-color: #38a900;
}
.section-title {
  font-size: 1.1rem;
  color: #1a73e8;
  border-bottom: 1px solid #e8eaed;
  padding-bottom: 0.5rem;
  margin: 1.5rem 0 1rem 0;
}
.periodo-inputs {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 0.5rem;
}
.info-text {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 6px;
  color: #5f6368;
  font-size: 0.9rem;
}
.btn {
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1.1rem;
  transition: background 0.2s;
}
.btn-primary {
  background: #38a900;
  color: white;
}
.btn-primary:hover {
  background: #2e8a00;
}
.btn:disabled {
  background: #e0e0e0;
  cursor: not-allowed;
}
</style>
