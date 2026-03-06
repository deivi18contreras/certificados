<script setup>
import { ref } from 'vue'

const certificates = ref([
  { id: 1, name: 'Certificado de Aportes - Enero 2024', date: '2024-01-15', provider: 'Asopagos', status: 'Verificado' },
  { id: 2, name: 'Certificado de Aportes - Febrero 2024', date: '2024-02-12', provider: 'SOI', status: 'Verificado' },
  { id: 3, name: 'Certificado de Aportes - Marzo 2024', date: '2024-03-10', provider: 'Compensar', status: 'Pendiente' }
])
</script>

<template>
  <div class="container">
    <div class="card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
        <div>
          <h1>Mis Certificados</h1>
          <p style="color: #5f6368;">Gestione y descargue sus certificados de aportes procesados.</p>
        </div>
        <button class="btn btn-primary">Descargar Todo</button>
      </div>

      <div class="grid">
        <div v-for="cert in certificates" :key="cert.id" class="cert-card">
          <div class="cert-icon">
            <svg viewBox="0 0 24 24" width="32" height="32"><path fill="#1a73e8" d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
          </div>
          <div class="cert-info">
            <h3>{{ cert.name }}</h3>
            <p>Proveedor: {{ cert.provider }}</p>
            <p>Fecha: {{ cert.date }}</p>
            <div style="margin-top: 10px;">
              <span :class="['status-pill', cert.status === 'Verificado' ? 'status-success' : 'status-pending']">
                {{ cert.status }}
              </span>
            </div>
          </div>
          <div class="cert-actions">
            <button class="btn-icon">
              <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cert-card {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  border: 1px solid #dadce0;
  border-radius: 8px;
  gap: 1.5rem;
  transition: all 0.2s;
}
.cert-card:hover {
  background-color: #f8f9fa;
  border-color: #1a73e8;
}
.cert-icon {
  background: #e8f0fe;
  padding: 12px;
  border-radius: 8px;
}
.cert-info {
  flex-grow: 1;
}
.cert-info h3 {
  font-size: 1.1rem;
  margin-bottom: 4px;
}
.cert-info p {
  font-size: 0.85rem;
  color: #5f6368;
  margin: 0;
}
.status-pill {
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 500;
}
.status-success { background: #e6f4ea; color: #1e8e3e; }
.status-pending { background: #fef7e0; color: #ea8600; }

.btn-icon {
  background: none;
  border: none;
  color: #5f6368;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background 0.2s;
}
.btn-icon:hover {
  background: #f1f3f4;
  color: #1a73e8;
}
</style>
