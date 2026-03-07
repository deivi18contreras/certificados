<script setup>
import { ref, onMounted, computed } from 'vue'
import { getReportes } from '@/services/apiReporte'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const reportes = ref([])
const loading = ref(false)
const filter = ref('')

const columns = [
  { name: 'planilla', label: 'Planilla #', field: 'numPlanilla', sortable: true, align: 'left' },
  { name: 'contratista', label: 'Contratista', field: row => `${row.contratistaId?.nombres} ${row.contratistaId?.apellidos}`, sortable: true, align: 'left' },
  { name: 'mes', label: 'Mes', field: 'mesPagado', sortable: true, align: 'center' },
  { name: 'valor', label: 'Valor', field: 'valorPagado', sortable: true, align: 'right', format: val => val ? `$ ${val.toLocaleString()}` : 'N/A' },
  { name: 'entidad', label: 'Operador', field: 'entidadPagadora', sortable: true, align: 'center' },
  { name: 'fecha', label: 'Fecha Pago', field: 'fechaPago', sortable: true, align: 'center', format: val => val ? new Date(val).toLocaleDateString() : 'N/A' },
  { name: 'acciones', label: 'Acciones', field: 'acciones', align: 'center' }
]

const loadReportes = async () => {
  loading.value = true
  try {
    const res = await getReportes()
    if (res.success) {
      reportes.value = res.data
    }
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Error al cargar los registros' })
  } finally {
    loading.value = false
  }
}

const downloadReport = (row) => {
  $q.notify({ type: 'info', message: 'Iniciando descarga de reporte de ' + row.numPlanilla })
  // Lógica de descarga...
}

onMounted(() => {
  loadReportes()
})
</script>

<template>
  <q-page class="q-pa-md bg-grey-1">
    <div class="row q-col-gutter-md q-mb-lg items-center">
      <div class="col-12 col-md-6">
        <div class="text-h4 text-weight-bold text-primary">Panel de Control</div>
        <div class="text-subtitle1 text-grey-7">Gestión y supervisión de planillas registradas</div>
      </div>
      <div class="col-12 col-md-6 flex justify-end q-gutter-sm">
        <q-btn icon="refresh" flat round color="primary" @click="loadReportes" :loading="loading" />
        <q-btn icon="download" label="Exportar Excel" color="secondary" unelevated outline />
      </div>
    </div>

    <q-card flat bordered class="rounded-borders">
      <q-table
        :rows="reportes"
        :columns="columns"
        row-key="_id"
        :loading="loading"
        :filter="filter"
        flat
        bordered
        class="no-shadow"
      >
        <template v-slot:top-right>
          <q-input 
            v-model="filter" 
            placeholder="Buscar contratista o planilla..." 
            outlined 
            dense 
            bg-color="white"
            style="width: 300px"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <template v-slot:body-cell-entidad="props">
          <q-td :props="props">
            <q-chip 
              dense 
              outline 
              color="primary" 
              text-color="white" 
              class="text-weight-bold"
              style="text-transform: uppercase"
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
              @click="downloadReport(props.row)"
            >
              <q-tooltip>Ver Detalles</q-tooltip>
            </q-btn>
            <q-btn 
              icon="cloud_download" 
              flat 
              round 
              dense 
              color="secondary" 
              @click="downloadReport(props.row)"
            >
              <q-tooltip>Descargar PDF</q-tooltip>
            </q-btn>
          </q-td>
        </template>

        <template v-slot:no-data>
          <div class="full-width row flex-center text-accent q-pa-lg text-h6">
            <q-icon size="2em" name="sentiment_dissatisfied" />
            <span>&nbsp; No se encontraron registros...</span>
          </div>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>
