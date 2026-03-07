<script setup>
import { ref, onMounted, computed } from 'vue'
import { getReportes } from '@/services/apiReporte'
import { useQuasar } from 'quasar'

const $q = useQuasar()
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
  { name: 'planilla', label: 'Planilla' },
  { name: 'mes', label: 'Mes' },
  { name: 'valor', label: 'Monto' },
  { name: 'fecha', label: 'Fecha Pago' },
  { name: 'acciones', label: 'Acciones' }
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

const filteredReportes = computed(() => {
  return reportes.value.filter(r => {
    const nombres = r.contratistaId?.nombres?.toLowerCase() || ''
    const apellidos = r.contratistaId?.apellidos?.toLowerCase() || ''
    const fullname = `${nombres} ${apellidos}`
    const cedula = r.contratistaId?.numeroDoc?.toString() || ''
    const operador = r.entidadPagadora?.toLowerCase() || ''
    const s = filters.value.search.toLowerCase()
    
    const matchSearch = !s || fullname.includes(s) || cedula.includes(s) || operador.includes(s)
    const matchMes = !filters.value.mes || r.mesPagado === filters.value.mes
    
    // Filtrar por año solamente (buscando el año en la fecha de pago)
    const matchAnio = !filters.value.anio || (r.fechaPago && r.fechaPago.includes(filters.value.anio))

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
  loadReportes()
})
</script>

<template>
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
              <td colspan="7" class="text-center padding-xl">
                <div class="spinner-small q-mx-auto"></div>
              </td>
            </tr>
            <tr v-for="row in filteredReportes" :key="row._id">
              <td>
                <div class="contractor-info">
                  <div class="avatar-sm">{{ getInitials(row.contratistaId?.nombres, row.contratistaId?.apellidos) }}</div>
                  <div class="text-group">
                    <span class="name">{{ row.contratistaId?.nombres }}</span>
                    <span class="id">CC {{ row.contratistaId?.numeroDoc }}</span>
                  </div>
                </div>
              </td>
              <td><span class="badge badge-secondary">{{ row.entidadPagadora }}</span></td>
              <td>#{{ row.numPlanilla }}</td>
              <td class="text-capitalize">{{ row.mesPagado }}</td>
              <td class="text-bold accent-green">{{ formatCurrency(row.valorPagado) }}</td>
              <td class="text-faded">{{ formatDate(row.fechaPago) }}</td>
              <td>
                <div class="actions-group">
                  <button class="row-btn" @click="downloadReport(row)"><i class="material-icons">visibility</i></button>
                  <button class="row-btn" @click="downloadReport(row)"><i class="material-icons">download</i></button>
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
.dashboard-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
.accent-line { width: 30px; height: 3px; background: var(--sena-green); border-radius: 2px; }
.header-actions { display: flex; gap: 0.5rem; }

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
