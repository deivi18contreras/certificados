<script setup>
<<<<<<< HEAD
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
=======
import { ref, onMounted, computed } from 'vue'
import { getSupervisorDashboard } from '@/services/apiReporte'
import { useAuthStore } from '@/stores/auth'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const authStore = useAuthStore()
const reportes = ref([])
const loading = ref(false)

// Filtros individuales
const filters = ref({
  search: '', // Combinado: Nombre, Cédula, Operador
  mes: '',
  anio: '' // Filtro de año solamente
})

const months = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio", 
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
]

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString())

const columns = [
  { name: 'contratista', label: 'Contratista' },
  { name: 'entidad', label: 'Operador' },
  { name: 'mesRegistro', label: 'Mes de Registro' },
  { name: 'acciones', label: 'Acciones' }
]
>>>>>>> 64a23765abc45485dc75a2b30e320819c64f389c

const loadReportes = async () => {
  loading.value = true
  try {
    const res = await getSupervisorDashboard(authStore.user.id)
    if (res.success) {
      reportes.value = res.data
    }
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Error al cargar los registros' })
>>>>>>> 64a23765abc45485dc75a2b30e320819c64f389c
  } finally {
    loading.value = false
  }
}

<<<<<<< HEAD
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
=======
const filteredReportes = computed(() => {
  return reportes.value.filter(r => {
    const nombres = r.contratista?.nombres?.toLowerCase() || ''
    const apellidos = r.contratista?.apellidos?.toLowerCase() || ''
    const fullname = `${nombres} ${apellidos}`
    const cedula = r.contratista?.numeroDocumento?.toString() || ''
    const operador = r.operadorPago?.toLowerCase() || ''
    const s = filters.value.search.toLowerCase()
    
    
    const matchSearch = !s || fullname.includes(s) || cedula.includes(s) || operador.includes(s)
    
    // Obtener el mes de registro
    const dateOfCreation = new Date(r.createdAt)
    const monthOfCreation = dateOfCreation.toLocaleDateString('es-ES', { month: 'long' })
    const matchMes = !filters.value.mes || monthOfCreation.toLowerCase() === filters.value.mes.toLowerCase()
    
    // Filtrar por año solamente
    const yearOfCreation = dateOfCreation.getFullYear().toString()
    const matchAnio = !filters.value.anio || yearOfCreation === filters.value.anio

    return matchSearch && matchMes && matchAnio
  })
})

const getInitials = (nombres, apellidos) => {
  if (!nombres) return '?'
  return (nombres.charAt(0) + (apellidos?.charAt(0) || '')).toUpperCase()
}

const downloadReport = (row) => {
  $q.notify({ type: 'info', message: 'Exportando ' + row.numPlanilla })
}

const formatCurrency = (val) => {
  return val ? `$ ${val.toLocaleString()}` : '$ 0'
}

const formatDate = (val) => {
  return val ? new Date(val).toLocaleDateString() : 'N/A'
}

const clearFilters = () => {
  filters.value = { search: '', mes: '', anio: '' }
}

onMounted(() => {
>>>>>>> 64a23765abc45485dc75a2b30e320819c64f389c
  loadReportes()
})
</script>

<template>
<<<<<<< HEAD
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
=======
  <div class="dashboard-view">
    <div class="dashboard-header">
      <div class="title-section">
        <h1>Gestión de Planillas</h1>
        <div class="accent-line"></div>
      </div>
      <div class="header-actions">
        <button class="btn btn-secondary" @click="loadReportes" :disabled="loading">
          <i class="material-icons" :class="{ 'spin': loading }">refresh</i>
          Actualizar
        </button>
        <button class="btn btn-outline">
          <i class="material-icons">picture_as_pdf</i>
          Exportar Lista
        </button>
      </div>
    </div>

    <!-- Filtros Moderados -->
    <div class="filter-bar">
      <div class="search-main">
        <i class="material-icons">search</i>
        <input 
          v-model="filters.search" 
          type="text" 
          placeholder="Nombre, cédula u operador..." 
          class="form-input no-border" 
        />
      </div>
      <div class="filter-options">
        <select v-model="filters.mes" class="select-minimal">
          <option value="">Cualquier Mes</option>
          <option v-for="m in months" :key="m" :value="m">{{ m }}</option>
        </select>
        <select v-model="filters.anio" class="select-minimal">
          <option value="">Año</option>
          <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
        </select>
        <button class="clear-btn" @click="clearFilters" v-if="filters.search || filters.mes || filters.anio">
          <i class="material-icons">close</i>
        </button>
      </div>
    </div>

    <div class="card table-card">
      <div class="table-container">
        <table class="custom-table">
          <thead>
            <tr>
              <th v-for="col in columns" :key="col.name">{{ col.label }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="4" class="text-center padding-xl">
                <div class="spinner-small q-mx-auto"></div>
              </td>
            </tr>
            <tr v-for="row in filteredReportes" :key="row._id">
              <td>
                <div class="contractor-info">
                  <div class="avatar-sm">{{ getInitials(row.contratista?.nombres, row.contratista?.apellidos) }}</div>
                  <div class="text-group">
                    <span class="name">{{ row.contratista?.nombres }} {{ row.contratista?.apellidos }}</span>
                    <span class="id">CC {{ row.contratista?.numeroDocumento }}</span>
                  </div>
                </div>
              </td>
              <td><span class="badge badge-secondary">{{ row.operadorPago }}</span></td>
              <td class="text-capitalize text-bold" style="color: var(--sena-green);">{{ new Date(row.createdAt).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }) }}</td>
              <td>
                <div class="actions-group" style="align-items: center;">
                  <a v-if="row.archivoUrl" :href="row.archivoUrl" target="_blank" class="row-btn" title="Ver en Drive">
                    <i class="material-icons" style="color: var(--sena-purple)">visibility</i>
                  </a>
                  <a v-if="row.archivoUrl" :href="row.archivoUrl" target="_blank" class="row-btn" title="Abrir en Drive">
                    <i class="material-icons" style="color: var(--sena-green)">open_in_new</i>
                  </a>
                  <span v-if="!row.archivoUrl && row.status === 'Procesando'" class="text-faded" style="font-size: 0.8rem; display: flex; align-items: center; gap: 4px;">
                    <i class="material-icons spin" style="font-size: 14px;">sync</i> Procesando
                  </span>
                  <span v-if="!row.archivoUrl && row.status === 'Pendiente'" class="text-faded" style="font-size: 0.8rem;">
                    Pendiente
                  </span>
                  <span v-if="!row.archivoUrl && row.status === 'Error'" style="color: #B42318; font-size: 0.8rem; font-weight: bold;">
                    Error
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
.accent-line { width: 40px; height: 4px; background: var(--sena-green); border-radius: 2px; margin-top: 4px; }
.header-actions { display: flex; gap: 0.75rem; }

.btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
}

.btn i { font-size: 20px; }

.btn-secondary {
  background: var(--sena-green);
  color: white;
  box-shadow: 0 4px 12px rgba(57, 169, 0, 0.2);
}

.btn-secondary:hover:not(:disabled) {
  background: #329600;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(57, 169, 0, 0.3);
}

.btn-outline {
  background: white;
  border: 2px solid var(--sena-purple);
  color: var(--sena-purple);
}

.btn-outline:hover {
  background: #F3E5F5;
  transform: translateY(-2px);
}

.filter-bar {
  background: white;
  border-radius: 10px;
  padding: 0.4rem 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  border: 1px solid #E6E1E5;
  margin-bottom: 1.5rem;
}

.search-main { flex: 1; display: flex; align-items: center; gap: 8px; border-right: 1px solid #EEE; padding-right: 1rem; }
.search-main i { color: var(--sena-purple); font-size: 18px; }
.no-border { border: none !important; background: transparent !important; padding: 0.4rem 0 !important; }

.filter-options { display: flex; align-items: center; gap: 0.75rem; }
.select-minimal { border: none; background: #F7F2FA; padding: 0.3rem 0.6rem; border-radius: 6px; font-size: 0.8rem; color: var(--sena-purple); font-weight: 600; cursor: pointer; }

.clear-btn { background: #FEE4E2; color: #B42318; border: none; width: 24px; height: 24px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; }

.contractor-info { display: flex; align-items: center; gap: 0.6rem; }
.avatar-sm { width: 30px; height: 30px; background: var(--sena-purple-gradient); color: white; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 700; }
.text-group { display: flex; flex-direction: column; }
.text-group .name { font-weight: 700; font-size: 0.85rem; }
.text-group .id { font-size: 0.7rem; color: var(--sena-text-light); }

.text-bold { font-weight: 700; }
.text-faded { color: var(--sena-text-light); font-size: 0.8rem; }
.actions-group { display: flex; gap: 2px; }
.row-btn { background: transparent; border: none; padding: 4px; border-radius: 4px; cursor: pointer; color: var(--sena-text-light); }
.row-btn:hover { background: #F3E5F5; color: var(--sena-purple); }

.spinner-small { width: 24px; height: 24px; border: 2px solid #F3E5F5; border-top: 2px solid var(--sena-purple); border-radius: 50%; animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
>>>>>>> 64a23765abc45485dc75a2b30e320819c64f389c
