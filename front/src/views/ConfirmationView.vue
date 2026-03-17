<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
<<<<<<< HEAD
  <q-page class="flex flex-center bg-grey-1">
    <q-card style="max-width: 500px; width: 100%; border-radius: 12px" flat bordered class="text-center q-pa-xl">
      <q-card-section>
        <q-icon name="check_circle" size="100px" color="positive" />
        <div class="text-h4 text-weight-bold q-mt-lg">¡Registro Exitoso!</div>
        <p class="text-subtitle1 text-grey-7 q-mt-md">
          Su planilla ha sido recibida correctamente. El sistema iniciará la descarga y vinculación con Google Drive en unos momentos.
        </p>
      </q-card-section>

      <q-card-section>
        <q-btn 
          label="Volver al Inicio" 
          color="primary" 
          unelevated 
          class="q-px-xl q-py-md" 
          @click="router.push({ name: 'home' })" 
        />
        <div class="q-mt-md">
          <q-btn label="Registrar otra planilla" flat color="secondary" @click="router.push({ name: 'registrar-planilla' })" />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>
=======
  <div class="confirmation-view">
    <div class="card confirmation-card">
      <div class="text-center">
        <div class="success-icon">
          <i class="material-icons">check_circle</i>
        </div>
        <h2 class="text-h4 text-weight-bold q-mt-lg">¡Registro Exitoso!</h2>
        <p class="text-subtitle1 text-grey-7 q-mt-md">
          Su planilla ha sido recibida correctamente. El sistema iniciará la descarga y vinculación con Google Drive en unos momentos.
        </p>
      </div>

      <div class="actions text-center q-mt-xl">
        <button 
          class="btn btn-primary full-width q-py-md" 
          @click="router.push({ name: 'home' })" 
        >
          Volver al Inicio
        </button>
        <div class="q-mt-md">
          <button class="btn btn-outline full-width" @click="router.push({ name: 'registrar-planilla' })">
            Registrar otra planilla
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.confirmation-view {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 4rem;
}

.confirmation-card {
  width: 100%;
  max-width: 550px;
  padding: 4rem;
}

.success-icon {
  margin-bottom: 2rem;
}

.success-icon i {
  font-size: 100px;
  color: var(--sena-green);
}

.text-center { text-align: center; }
.full-width { width: 100%; }
.q-mt-lg { margin-top: 1.5rem; }
.q-mt-md { margin-top: 1rem; }
.q-mt-xl { margin-top: 2.5rem; }
.q-py-md { padding-top: 1rem; padding-bottom: 1rem; }

.text-grey-7 {
  color: #666;
  font-size: 1.1rem;
  line-height: 1.6;
}
</style>
>>>>>>> 64a23765abc45485dc75a2b30e320819c64f389c
