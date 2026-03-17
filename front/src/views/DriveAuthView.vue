<script setup>
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
<<<<<<< HEAD
import { getGoogleAuthUrl } from '@/services/apiSupervisor'
import { useAuthStore } from '@/stores/auth'

const $q = useQuasar()
const router = useRouter()
const authStore = useAuthStore()

const handleGrantPermissions = async () => {
  if (!authStore.user?.id) {
    $q.notify({ type: 'negative', message: 'Error: No se encontró la sesión del supervisor.' })
    return
  }

  $q.loading.show({ message: 'Conectando con Google API...' })
  
  try {
    const res = await getGoogleAuthUrl(authStore.user.id)
    if (res.url) {
      window.location.href = res.url // Redirección externa a Google
    } else {
      throw new Error('No se pudo obtener la URL de autenticación')
    }
  } catch (error) {
    $q.loading.hide()
    $q.notify({ type: 'negative', message: 'Error al conectar con Google: ' + error.message })
  }
=======

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
>>>>>>> 64a23765abc45485dc75a2b30e320819c64f389c
}
</script>

<template>
<<<<<<< HEAD
  <q-page class="flex flex-center bg-grey-1">
    <q-card style="max-width: 500px; border-radius: 12px" flat bordered>
      <q-card-section class="text-center q-pt-xl">
        <q-img src="https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg" style="width: 80px" />
        <div class="text-h5 text-weight-bold q-mt-md">Permisos de Google Drive</div>
        <p class="text-grey-7 q-mt-sm">Para que el sistema pueda organizar las planillas descargadas, necesitamos acceso a su cuenta de Google Drive.</p>
      </q-card-section>

      <q-card-section class="q-px-xl q-pb-xl">
        <q-banner dense class="bg-blue-1 text-blue-9 rounded-borders q-mb-lg">
          <template v-slot:avatar>
            <q-icon name="info" color="blue-9" />
          </template>
          Se creará una carpeta llamada <b>"reporte entidades"</b> en su unidad.
        </q-banner>

        <q-btn 
          label="Conceder Permisos" 
          color="primary" 
          class="full-width q-py-md" 
          unelevated 
          icon="add_moderator"
          @click="handleGrantPermissions"
        />
        <q-btn 
          label="Omitir por ahora" 
          flat 
          color="grey-7" 
          class="full-width q-mt-sm" 
          @click="router.push({ name: 'dashboard' })" 
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>
=======
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
>>>>>>> 64a23765abc45485dc75a2b30e320819c64f389c
