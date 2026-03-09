<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getReportesBySupervisor } from '@/services/apiReporte'
import { getGoogleAuthUrl } from '@/services/apiSupervisor'
import { useAuthStore } from '@/stores/auth'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const reportes = ref([])
const loading = ref(false)
const filter = ref('')

// ... (El resto de las columnas se mantiene igual)

const handleDriveLink = async () => {
  try {
    const res = await getGoogleAuthUrl(authStore.user.id)
    if (res.url) {
      window.location.href = res.url // Redirigir a Google
    }
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Error al iniciar vinculación con Drive' })
  }
}

const checkDriveStatus = () => {
  const status = route.query.drive
  if (status === 'success') {
    $q.notify({ 
      type: 'positive', 
      message: '¡Google Drive vinculado exitosamente!', 
      icon: 'check_circle',
      timeout: 3000
    })
    // Limpiar la URL
    router.replace({ name: 'dashboard' })
  } else if (status === 'error') {
    $q.notify({ 
      type: 'negative', 
      message: 'Error al vincular Google Drive', 
      icon: 'error' 
    })
    router.replace({ name: 'dashboard' })
  }
}

const loadReportes = async () => {
  // ... (código existente)
}

// ... (resto de funciones existentes)

onMounted(() => {
  checkDriveStatus()
  loadReportes()
})
</script>

<template>
  <q-page class="q-pa-md bg-grey-1">
    <div class="row q-col-gutter-md q-mb-lg items-center">
      <div class="col-12 col-md-6">
        <div class="text-h4 text-weight-bold text-primary">Panel de Control</div>
        <div class="text-subtitle1 text-grey-7">Supervisión de Planillas - {{ authStore.user?.nombre }}</div>
      </div>
      <div class="col-12 col-md-6 flex justify-end q-gutter-sm">
        <q-btn 
          icon="add_to_drive" 
          label="Vincular Drive" 
          color="white" 
          text-color="primary" 
          @click="handleDriveLink"
        />
        <q-btn icon="refresh" flat round color="primary" @click="loadReportes" :loading="loading" />
        <q-btn icon="download" label="Exportar Excel" color="secondary" unelevated outline />
      </div>
    </div>
    
    <!-- ... (resto del template igual) -->


    <q-card flat bordered class="rounded-borders no-shadow">
      <q-table
        :rows="reportes"
        :columns="columns"
        row-key="_id"
        :loading="loading"
        :filter="filter"
        flat
        bordered
        :rows-per-page-options="[10, 20, 50]"
      >
        <template v-slot:top-right>
          <q-input 
            v-model="filter" 
            placeholder="Buscar contratista..." 
            outlined 
            dense 
            bg-color="white"
            style="min-width: 250px"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-chip 
              dense 
              :color="getStatusColor(props.value)" 
              text-color="white" 
              class="text-weight-bold"
            >
              {{ props.value }}
            </q-chip>
          </q-td>
        </template>

        <template v-slot:body-cell-acciones="props">
          <q-td :props="props">
            <q-btn 
              icon="visibility" 
              flat 
              round 
              dense 
              color="primary" 
              @click="$q.notify({ message: 'Detalles en desarrollo', color: 'info' })"
            >
              <q-tooltip>Ver Detalles</q-tooltip>
            </q-btn>
            <q-btn 
              icon="picture_as_pdf" 
              flat 
              round 
              dense 
              color="secondary" 
              @click="openPdf(props.row.archivoUrl)"
              :disable="!props.row.archivoUrl"
            >
              <q-tooltip>Ver Certificado en Drive</q-tooltip>
            </q-btn>
          </q-td>
        </template>

        <template v-slot:no-data>
          <div class="full-width row flex-center text-accent q-pa-lg text-h6">
            <q-icon size="2em" name="sentiment_dissatisfied" />
            <span>&nbsp; No tienes planillas registradas todavía.</span>
          </div>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>
