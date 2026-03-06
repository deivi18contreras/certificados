<script setup>
import { ref, onMounted } from 'vue';
import apiService from '../api/apiService';

const contratistas = ref([]);
const isLoading = ref(true);
const isSubmitting = ref(false);

const newContratista = ref({
  nombres: '',
  apellidos: '',
  numeroDoc: '',
  tipoDoc: 'CC',
  email: '',
  telefono: '',
  eps: '',
  expCedula: ''
});

const loadContratistas = async () => {
  try {
    const res = await apiService.getContratistas();
    contratistas.value = res.data || res;
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const handleRegister = async () => {
  isSubmitting.value = true;
  try {
    await apiService.createContratista(newContratista.value);
    alert('Contratista registrado exitosamente en la base de datos');
    newContratista.value = {
      nombres: '',
      apellidos: '',
      numeroDoc: '',
      tipoDoc: 'CC',
      email: '',
      telefono: '',
      eps: '',
      expCedula: ''
    };
    loadContratistas();
  } catch (error) {
    const errorMsg = error.response?.data?.message || 'Error al registrar contratista';
    alert(errorMsg);
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  loadContratistas();
});
</script>

<template>
  <div class="container">
    <div class="grid" style="grid-template-columns: 1fr 2fr; align-items: start;">
      
      <!-- Formulario -->
      <div class="card">
        <h2>Nuevo Contratista</h2>
        <p style="color: #5f6368; margin-bottom: 1.5rem; font-size: 0.9rem;">Ingrese los datos personales para el registro real.</p>
        
        <form @submit.prevent="handleRegister">
          <div class="form-group">
            <label>Nombres</label>
            <input v-model="newContratista.nombres" placeholder="Ej: Juan" required />
          </div>
          <div class="form-group">
            <label>Apellidos</label>
            <input v-model="newContratista.apellidos" placeholder="Ej: Pérez" required />
          </div>
          
          <div class="grid" style="grid-template-columns: 1fr 1.5fr; gap: 10px;">
            <div class="form-group">
              <label>Tipo Doc</label>
              <select v-model="newContratista.tipoDoc">
                <option value="CC">CC</option>
                <option value="CE">CE</option>
                <option value="PEP">PEP</option>
              </select>
            </div>
            <div class="form-group">
              <label>Número Documento</label>
              <input v-model.number="newContratista.numeroDoc" type="number" required />
            </div>
          </div>

          <div class="form-group">
            <label>Fecha Expedición Cédula</label>
            <input v-model="newContratista.expCedula" type="date" required />
          </div>

          <div class="form-group">
            <label>EPS</label>
            <input v-model="newContratista.eps" placeholder="Ej: Sanitas, Sura..." required />
          </div>

          <div class="form-group">
            <label>Email Corporativo</label>
            <input v-model="newContratista.email" type="email" placeholder="usuario@sena.edu.co" />
          </div>
          
          <button type="submit" class="btn btn-primary" :disabled="isSubmitting" style="width: 100%; margin-top: 1rem;">
            {{ isSubmitting ? 'Guardando en BD...' : 'Registrar Contratista' }}
          </button>
        </form>
      </div>

      <!-- Lista -->
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <h2>Base de Datos de Contratistas</h2>
          <span style="font-size: 0.85rem; color: #5f6368;">{{ contratistas.length }} registrados</span>
        </div>
        
        <div v-if="isLoading" style="padding: 2rem; text-align: center;">Consultando base de datos...</div>
        
        <div v-else class="table-container" style="overflow-x: auto;">
          <table>
            <thead>
              <tr>
                <th>Identificación</th>
                <th>Nombre Completo</th>
                <th>EPS / Detalles</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="c in contratistas" :key="c._id">
                <td>
                  <span style="font-size: 0.75rem; color: #70757a; display: block;">{{ c.tipoDoc }}</span>
                  <span style="font-weight: 500;">{{ c.numeroDoc }}</span>
                </td>
                <td>{{ c.nombres }} {{ c.apellidos }}</td>
                <td>
                  <span style="display: block; font-size: 0.9rem;">{{ c.eps }}</span>
                  <span style="font-size: 0.85rem; color: #5f6368;">{{ c.email || 'Sin correo' }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>
</template>
