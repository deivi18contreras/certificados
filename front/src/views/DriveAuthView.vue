<script setup>
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
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
}
</script>

<template>
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
