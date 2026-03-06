<script setup>
import { ref, onMounted } from 'vue';
import apiService from '../api/apiService';

const reportes = ref([]);
const isLoading = ref(true);

const fetchReportes = async () => {
  try {
    const res = await apiService.getReportes();
    reportes.value = res.data || res;
  } catch (error) {
    console.error('Error al cargar reportes:', error);
  } finally {
    isLoading.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString();
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value);
};

onMounted(() => {
  fetchReportes();
});
</script>

<template>
  <div class="container">
    <div class="card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
        <div>
          <h1>Historial de Reportes</h1>
          <p style="color: #5f6368;">Listado de planillas registradas en el sistema.</p>
        </div>
        <router-link to="/register-reporte" class="btn btn-primary">Nuevo Reporte</router-link>
      </div>

      <div v-if="isLoading" style="text-align: center; padding: 2rem;">
        Cargando reportes...
      </div>

      <div v-else-if="reportes.length === 0" style="text-align: center; padding: 2rem; color: #5f6368;">
        No hay reportes registrados aún.
      </div>

      <div v-else class="table-container" style="overflow-x: auto;">
        <table>
          <thead>
            <tr>
              <th>Planilla</th>
              <th>Contratista</th>
              <th>Mes</th>
              <th>Fecha Pago</th>
              <th>Valor</th>
              <th>Entidad</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in reportes" :key="r._id">
              <td style="font-weight: 500;">{{ r.numPlanilla }}</td>
              <td>
                <div v-if="r.contratistaId">
                  {{ r.contratistaId.nombres }} {{ r.contratistaId.apellidos }}
                </div>
                <div v-else style="color: #9aa0a6;">N/A</div>
              </td>
              <td style="text-transform: capitalize;">{{ r.mesPagado }}</td>
              <td>{{ formatDate(r.fechaPago) }}</td>
              <td>{{ formatCurrency(r.valorPagado) }}</td>
              <td>
                <span class="badge">{{ r.entidadPagadora }}</span>
              </td>
              <td>
                <span class="status-pill status-success">Registrado</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.badge {
  background: #e8f0fe;
  color: #1a73e8;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
}
.status-pill {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}
.status-success {
  background: #e6f4ea;
  color: #1e8e3e;
}
</style>
