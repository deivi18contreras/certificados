<script setup>
import { ref, onMounted, computed } from 'vue';
import apiService from '../api/apiService';

const contratistas = ref([]);
const supervisores = ref([]);
const isSubmitting = ref(false);

const newReporte = ref({
  numPlanilla: '',
  fechaPago: '',
  valorPagado: '',
  mesPagado: '',
  contratistaId: '',
  supervisorId: '',
  entidadPagadora: ''
});

// Lógica para determinar qué campos son obligatorios según la entidad
const needsPlanilla = computed(() => {
  return ['asopagos', 'compensar'].includes(newReporte.value.entidadPagadora);
});

const needsValor = computed(() => {
  return ['asopagos'].includes(newReporte.value.entidadPagadora);
});

const loadData = async () => {
  try {
    const resC = await apiService.getContratistas();
    contratistas.value = resC.data || resC;
    const resS = await apiService.getSupervisors();
    supervisores.value = resS.data || resS;
  } catch (error) {
    console.error(error);
  }
};

const handleRegister = async () => {
  isSubmitting.value = true;
  try {
    // Limpiar campos que no aplican según la entidad antes de enviar
    const dataToSend = { ...newReporte.value };
    if (!needsPlanilla.value) dataToSend.numPlanilla = null;
    if (!needsValor.value) dataToSend.valorPagado = null;

    await apiService.createReporte(dataToSend);
    alert('Reporte registrado exitosamente');
    
    // Reset form
    newReporte.value = {
      numPlanilla: '',
      fechaPago: '',
      valorPagado: '',
      mesPagado: '',
      contratistaId: '',
      supervisorId: '',
      entidadPagadora: ''
    };
  } catch (error) {
    alert('Error al registrar reporte. Verifique los campos.');
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="container">
    <div class="card">
      <h1>Registrar Nuevo Reporte de Pago</h1>
      <p style="color: #5f6368; margin-bottom: 2rem;">
        Los campos se ajustarán automáticamente según la entidad pagadora seleccionada.
      </p>
      
      <form @submit.prevent="handleRegister">
        <!-- Selección de Entidad (Primero para activar lógica dinámica) -->
        <div class="form-group">
          <label>Entidad Pagadora:</label>
          <select v-model="newReporte.entidadPagadora" required>
            <option value="" disabled>Seleccione entidad</option>
            <option value="asopagos">Asopagos (Requiere Planilla y Valor)</option>
            <option value="soi">SOI (Solo requiere Mes)</option>
            <option value="compensar">Compensar / MiPlanilla (Requiere Planilla)</option>
            <option value="aportesEnLinea">Aportes en Línea (Solo requiere Mes)</option>
          </select>
        </div>

        <div class="grid">
          <div class="form-group">
            <label>Contratista:</label>
            <select v-model="newReporte.contratistaId" required>
              <option value="" disabled>Seleccione un contratista</option>
              <option v-for="c in contratistas" :key="c._id" :value="c._id">
                {{ c.nombres }} {{ c.apellidos }} ({{ c.numeroDoc }})
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Supervisor:</label>
            <select v-model="newReporte.supervisorId" required>
              <option value="" disabled>Seleccione un supervisor</option>
              <option v-for="s in supervisores" :key="s._id" :value="s._id">
                {{ s.nombre }}
              </option>
            </select>
          </div>
        </div>

        <div class="grid">
          <!-- Campo Dinámico: Número de Planilla -->
          <div class="form-group" v-if="newReporte.entidadPagadora">
            <label>Número de Planilla: <span v-if="!needsPlanilla" style="font-weight: normal; color: #9aa0a6;">(Opcional para {{ newReporte.entidadPagadora }})</span></label>
            <input 
              v-model.number="newReporte.numPlanilla" 
              type="number" 
              :placeholder="needsPlanilla ? 'Requerido para esta entidad' : 'No es indispensable'"
              :required="needsPlanilla" 
            />
          </div>

          <div class="form-group">
            <label>Mes de la Planilla:</label>
            <select v-model="newReporte.mesPagado" required>
              <option value="" disabled>Seleccione un mes</option>
              <option v-for="m in ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']" :key="m" :value="m">
                {{ m.charAt(0).toUpperCase() + m.slice(1) }}
              </option>
            </select>
          </div>
        </div>

        <div class="grid" v-if="newReporte.entidadPagadora">
          <!-- Campo Dinámico: Valor Pagado -->
          <div class="form-group">
            <label>Valor Pagado: <span v-if="!needsValor" style="font-weight: normal; color: #9aa0a6;">(Opcional)</span></label>
            <input 
              v-model.number="newReporte.valorPagado" 
              type="number" 
              placeholder="$ 0.00" 
              :required="needsValor" 
            />
          </div>

          <div class="form-group">
            <label>Fecha Efectiva de Pago:</label>
            <input v-model="newReporte.fechaPago" type="date" />
          </div>
        </div>

        <div style="margin-top: 1rem;">
          <button type="submit" class="btn btn-primary" :disabled="isSubmitting" style="width: 100%;">
            {{ isSubmitting ? 'Registrando...' : 'Registrar Reporte' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
