<script setup>
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const router = useRouter()

const handleGrantPermissions = () => {
  $q.loading.show({ message: 'Conectando con Google API...' })
  
  // Simulación de autenticación con Google
  setTimeout(() => {
    $q.loading.hide()
    $q.notify({ type: 'positive', message: 'Permisos concedidos exitosamente' })
    router.push({ name: 'dashboard' })
  }, 2000)
}
</script>

<template>
  <div class="auth-view">
    <div class="card auth-card">
      <div class="text-center q-pb-lg">
        <img src="https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg" class="drive-logo" />
        <h2 class="text-h5 text-weight-bold q-mt-md">Permisos de Google Drive</h2>
        <p class="text-grey-7">Para que el sistema pueda organizar las planillas descargadas, necesitamos acceso a su cuenta de Google Drive.</p>
      </div>

      <div class="info-banner q-mb-lg">
        <i class="material-icons">info</i>
        <span>Se creará una carpeta llamada <b>"reporte entidades"</b> en su unidad.</span>
      </div>

      <div class="actions-stack">
        <button 
          class="btn btn-primary full-width" 
          @click="handleGrantPermissions"
        >
          <i class="material-icons">add_moderator</i>
          Conceder Permisos
        </button>
        <button 
          class="btn btn-outline full-width q-mt-sm" 
          @click="router.push({ name: 'dashboard' })" 
        >
          Omitir por ahora
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-view {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 4rem;
}

.auth-card {
  width: 100%;
  max-width: 500px;
  padding: 3rem;
}

.drive-logo {
  width: 80px;
  margin: 0 auto;
}

.info-banner {
  background-color: #F3E5F5;
  color: #6750A4;
  padding: 1rem;
  border-radius: var(--border-radius-md);
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.95rem;
  line-height: 1.4;
  margin-bottom: 2rem;
}

.info-banner i {
  font-size: 24px;
}

.actions-stack {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.text-center { text-align: center; }
.full-width { width: 100%; }
.q-mt-md { margin-top: 1.5rem; }
.q-mt-sm { margin-top: 0.5rem; }
.q-pb-lg { padding-bottom: 2rem; }
.q-mb-lg { margin-bottom: 1.5rem; }

.text-grey-7 {
  color: #666;
  margin-top: 0.5rem;
}
</style>
