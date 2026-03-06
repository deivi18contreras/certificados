<script setup>
import { ref, onMounted } from 'vue';
import apiService from '../api/apiService';

const supervisores = ref([]);
const isLoading = ref(true);
const isSubmitting = ref(false);

const newSupervisor = ref({
  nombre: '',
  email: '',
  password: 'defaultPassword123'
});

const loadSupervisores = async () => {
  try {
    const res = await apiService.getSupervisors();
    supervisores.value = res.data || res;
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const handleRegister = async () => {
  isSubmitting.value = true;
  try {
    await apiService.createSupervisor(newSupervisor.value);
    alert('Supervisor registrado exitosamente');
    newSupervisor.value = { nombre: '', email: '', password: 'defaultPassword123' };
    loadSupervisores();
  } catch (error) {
    alert('Error al registrar supervisor');
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  loadSupervisores();
});
</script>

<template>
  <div class="container">
    <div class="grid" style="grid-template-columns: 1fr 2fr; align-items: start;">
      
      <!-- Formulario -->
      <div class="card">
        <h2>Nuevo Supervisor</h2>
        <p style="color: #5f6368; margin-bottom: 1.5rem; font-size: 0.9rem;">Registre al personal encargado de la validación técnica.</p>
        
        <form @submit.prevent="handleRegister">
          <div class="form-group">
            <label>Nombre Completo</label>
            <input v-model="newSupervisor.nombre" placeholder="Ej: Ing. Carlos Ruiz" required />
          </div>
          <div class="form-group">
            <label>Email Institucional</label>
            <input v-model="newSupervisor.email" type="email" placeholder="cruiz@sena.edu.co" required />
          </div>
          <div class="form-group">
            <label>Contraseña Temporal</label>
            <input v-model="newSupervisor.password" type="password" disabled />
            <small style="color: #9aa0a6;">Se asigna una contraseña por defecto.</small>
          </div>
          <button type="submit" class="btn btn-primary" :disabled="isSubmitting" style="width: 100%; margin-top: 1rem;">
            {{ isSubmitting ? 'Registrando...' : 'Registrar Supervisor' }}
          </button>
        </form>
      </div>

      <!-- Lista -->
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <h2>Equipo de Supervisión</h2>
          <span style="font-size: 0.85rem; color: #5f6368;">{{ supervisores.length }} activos</span>
        </div>
        
        <div v-if="isLoading" style="padding: 2rem; text-align: center;">Cargando...</div>
        
        <div v-else class="table-container" style="overflow-x: auto;">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo Electrónico</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="s in supervisores" :key="s._id">
                <td style="font-weight: 500;">{{ s.nombre }}</td>
                <td>{{ s.email }}</td>
                <td>
                  <span class="status-pill status-success">Activo</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
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
