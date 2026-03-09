<script setup>
import { ref } from 'vue';
import { registerContratista } from '../services/apiContratista';
import { useRouter } from 'vue-router';

const router = useRouter();
const isSubmitting = ref(false);

const contratista = ref({
  nombres: '',
  apellidos: '',
  tipoDocumento: 'CC',
  numeroDocumento: '',
  fechaExpedicion: '',
  eps: ''
});

const handleSubmit = async () => {
  isSubmitting.value = true;
  try {
    await registerContratista(contratista.value);
    alert('Contratista registrado exitosamente');
    router.push('/register-reporte'); // Redirigir al registro de reportes
  } catch (error) {
    console.error(error);
    alert('Error al registrar contratista: ' + (error.response?.data?.message || error.message));
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="container">
    <div class="card">
      <h1>Registrar Nuevo Contratista</h1>
      <p style="color: #5f6368; margin-bottom: 2rem;">
        Ingrese los datos básicos del contratista para poder asociarle reportes de pago.
      </p>

      <form @submit.prevent="handleSubmit">
        <div class="grid">
          <div class="form-group">
            <label>Nombres:</label>
            <input v-model="contratista.nombres" type="text" required placeholder="Ej: Juan" />
          </div>
          <div class="form-group">
            <label>Apellidos:</label>
            <input v-model="contratista.apellidos" type="text" required placeholder="Ej: Perez" />
          </div>
        </div>

        <div class="grid">
          <div class="form-group">
            <label>Tipo de Documento:</label>
            <select v-model="contratista.tipoDocumento" required>
              <option value="CC">Cédula de Ciudadanía</option>
              <option value="CE">Cédula de Extranjería</option>
              <option value="PEP">PEP</option>
              <option value="PPT">PPT</option>
            </select>
          </div>
          <div class="form-group">
            <label>Número de Documento:</label>
            <input v-model="contratista.numeroDocumento" type="text" required placeholder="Ej: 12345678" />
          </div>
        </div>

        <div class="grid">
          <div class="form-group">
            <label>Fecha de Expedición:</label>
            <input v-model="contratista.fechaExpedicion" type="date" required />
          </div>
          <div class="form-group">
            <label>EPS:</label>
            <input v-model="contratista.eps" type="text" required placeholder="Ej: Sanitas, Nueva EPS..." />
          </div>
        </div>

        <div style="margin-top: 1.5rem;">
          <button type="submit" class="btn btn-primary" :disabled="isSubmitting" style="width: 100%;">
            {{ isSubmitting ? 'Registrando...' : 'Registrar Contratista' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 700px;
  margin: 3rem auto;
  padding: 0 1rem;
}
.card {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}
h1 {
  margin-top: 0;
  color: #202124;
  font-size: 1.75rem;
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
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #3c4043;
}
input, select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #dadce0;
  border-radius: 4px;
  font-size: 1rem;
}
input:focus, select:focus {
  outline: none;
  border-color: #1a73e8;
  box-shadow: 0 0 0 2px rgba(26,115,232,0.2);
}
.btn {
  padding: 0.85rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: background 0.2s;
}
.btn-primary {
  background: #1a73e8;
  color: white;
}
.btn-primary:hover {
  background: #1765cc;
}
.btn:disabled {
  background: #dadce0;
  cursor: not-allowed;
}
</style>
