<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getReportesBySupervisor } from '../services/apiReporte'
import { getGoogleAuthUrl } from '../services/apiSupervisor'
import { useAuthStore } from '../stores/auth'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const reportes = ref([])
const loading = ref(false)
const filter = ref('')

const columns = [
  { name: 'fecha', label: 'Fecha Registro', field: 'createdAt', align: 'left', format: val => new Date(val).toLocaleDateString() },
  { name: 'contratista', label: 'Contratista', field: row => `${row.contratista?.nombres} ${row.contratista?.apellidos}`, align: 'left' },
  { name: 'operador', label: 'Operador', field: 'operadorPago', align: 'center' },
  { name: 'periodo', label: 'Periodo', field: row => `${row.periodoPago?.mes}/${row.periodoPago?.anio}`, align: 'center' },
  { name: 'status', label: 'Estado', field: 'status', align: 'center' },
  { name: 'acciones', label: 'Acciones', align: 'center' }
]

const handleDriveLink = async () => {
  try {
    const res = await getGoogleAuthUrl(authStore.user.id)
    if (res.url) window.location.href = res.url
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Error con Drive' })
  }
}

const loadReportes = async () => {
  loading.value = true
  try {
    const data = await getReportesBySupervisor(authStore.user.id)
    reportes.value = data
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const getStatusColor = (status) => {
  if (status === 'Completado') return 'positive'
  if (status === 'Procesando') return 'warning'
  if (status === 'Error') return 'negative'
  return 'grey'
}

onMounted(() => {
  if (route.query.drive === 'success') {
    $q.notify({ type: 'positive', message: 'Drive vinculado' })
    router.replace({ name: 'dashboard' })
  }
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
        <q-btn icon="add_to_drive" label="Vincular Drive" color="primary" @click="handleDriveLink" unelevated />
        <q-btn icon="refresh" flat round color="primary" @click="loadReportes" :loading="loading" />
      </div>
    </div>
    
    <q-card flat bordered>
      <q-table :rows="reportes" :columns="columns" row-key="_id" :loading="loading" :filter="filter" flat>
        <template v-slot:top-right>
          <q-input v-model="filter" placeholder="Buscar..." outlined dense><template v-slot:append><q-icon name="search" /></template></q-input>
        </template>
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-chip dense :color="getStatusColor(props.value)" text-color="white">{{ props.value }}</q-chip>
          </q-td>
        </template>
        <template v-slot:body-cell-acciones="props">
          <q-td :props="props">
            <q-btn icon="picture_as_pdf" flat round dense color="secondary" :disable="!props.row.archivoUrl" />
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>
