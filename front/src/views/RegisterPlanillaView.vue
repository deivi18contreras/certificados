<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getSupervisors } from '@/services/apiSupervisor'
import { getContratistas, registerContratista } from '@/services/apiContratista'
import { registerReporte } from '@/services/apiReporte'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const router = useRouter()

const loading = ref(false)
const supervisors = ref([])
const operators = ["asopagos", "SOI", "compensar", "Aportes en linea"]
const months = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio", 
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
]
const currentYear = new Date().getFullYear()
const years = Array.from({ length: 5 }, (_, i) => currentYear - i)

const form = ref({
  // Datos Contratista
  nombres: '',
  apellidos: '',
  tipoDoc: 'CC',
  numeroDoc: '',
  eps: '',
  expCedula: '', 
  
  // Datos Reporte
  numPlanilla: '',
  mesPagado: '',
  anio: currentYear,
  valorPagado: '',
  fechaPago: '',
  supervisorId: null,
  entidadPagadora: ''
})

const isCompensar = computed(() => form.value.entidadPagadora === 'compensar')
const isAportes = computed(() => form.value.entidadPagadora === 'Aportes en linea')

const loadSupervisors = async () => {
  try {
    const res = await getSupervisors()
    if (res.success) {
      supervisors.value = res.data.map(s => ({ label: s.nombre, value: s._id }))
    }
  } catch (error) {
    console.error('Error cargando supervisores', error)
  }
}

const handleSubmit = async () => {
  loading.value = true
  try {
    const resContratista = await registerContratista({
      nombres: form.value.nombres,
      apellidos: form.value.apellidos,
      tipoDoc: form.value.tipoDoc,
      numeroDoc: form.value.numeroDoc,
      eps: form.value.eps,
      expCedula: form.value.expCedula
    }).catch(err => {
        return err.response?.data?.data || null 
    })

    const contratistaId = resContratista?.data?._id || resContratista?._id

    if (!contratistaId) {
       const allC = await getContratistas()
       const match = allC.data.find(c => c.numeroDoc === form.value.numeroDoc)
       if (match) form.value.contratistaId = match._id
       else throw new Error('No se pudo determinar el ID del contratista')
    } else {
        form.value.contratistaId = contratistaId
    }

    const resReporte = await registerReporte({
      numPlanilla: isCompensar.value ? form.value.numPlanilla : 0, 
      mesPagado: form.value.mesPagado,
      anio: form.value.anio, // Añadido campo faltante
      valorPagado: isCompensar.value ? form.value.valorPagado : 0,
      fechaPago: isCompensar.value ? form.value.fechaPago : `${form.value.anio}-01-01`, 
      contratistaId: form.value.contratistaId,
      supervisorId: form.value.supervisorId.value,
      entidadPagadora: form.value.entidadPagadora.toLowerCase() === 'aportes en linea' ? 'aportesenlinea' : form.value.entidadPagadora.toLowerCase()
    })

    if (resReporte.success) {
      $q.notify({ type: 'positive', message: 'Planilla registrada correctamente' })
      router.push({ name: 'confirmacion' })
    }
  } catch (error) {
    $q.notify({ type: 'negative', message: error.message || 'Error al registrar la planilla' })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadSupervisors()
})
</script>

<template>
  <div class="register-view">
    <div class="card register-card">
      <div class="register-header">
        <h2>Registro de Planilla PILA</h2>
        <p>Complete la información para procesar su certificado automáticamente</p>
      </div>

      <form @submit.prevent="handleSubmit" class="register-form">
        <section class="form-section">
          <h3 class="section-title">1. Datos Personales</h3>
          <div class="grid-2">
            <div class="form-group">
              <label>Nombres</label>
              <input v-model="form.nombres" class="form-input" required />
            </div>
            <div class="form-group">
              <label>Apellidos</label>
              <input v-model="form.apellidos" class="form-input" required />
            </div>
          </div>
          
          <div class="grid-2">
            <div class="form-group">
              <label>Tipo Doc</label>
              <select v-model="form.tipoDoc" class="form-input">
                <option v-for="opt in ['CC', 'CE', 'PEP']" :key="opt" :value="opt">{{ opt }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Número de Documento</label>
              <!-- Cambiado a type="text" para evitar spinners y formateo numérico -->
              <input v-model="form.numeroDoc" type="text" class="form-input" required placeholder="Ej: 12345678" />
            </div>
          </div>

          <div class="form-group">
            <label>EPS</label>
            <select v-model="form.eps" class="form-input" required>
              <option value="" disabled selected>Seleccione su EPS</option>
              <option v-for="opt in ['Sanitas', 'Sura', 'Compensar', 'Salud Total', 'Nueva EPS']" :key="opt" :value="opt">{{ opt }}</option>
            </select>
          </div>
        </section>

        <div class="separator"></div>

        <section class="form-section">
          <h3 class="section-title">2. Detalles de la Planilla</h3>
          <div class="form-group">
            <label>Operador de Pago</label>
            <select v-model="form.entidadPagadora" class="form-input" required>
              <option value="" disabled selected>Seleccione un operador</option>
              <option v-for="opt in operators" :key="opt" :value="opt">{{ opt }}</option>
            </select>
          </div>

          <template v-if="form.entidadPagadora">
            <div class="grid-2" v-if="isCompensar">
              <div class="form-group">
                <label>Número de Planilla</label>
                <!-- Cambiado a type="text" -->
                <input v-model="form.numPlanilla" type="text" class="form-input" required />
              </div>
              <div class="form-group">
                <label>Fecha de Pago</label>
                <input v-model="form.fechaPago" type="date" class="form-input" required />
              </div>
            </div>

            <div class="grid-2">
              <div class="form-group">
                <label>Mes a Reportar</label>
                <select v-model="form.mesPagado" class="form-input" required>
                  <option v-for="opt in months" :key="opt" :value="opt">{{ opt }}</option>
                </select>
              </div>
              <div class="form-group">
                <label>Año a Reportar</label>
                <select v-model="form.anio" class="form-input" required>
                  <option v-for="opt in years" :key="opt" :value="opt">{{ opt }}</option>
                </select>
              </div>
            </div>

            <div class="grid-2">
              <div class="form-group" v-if="isCompensar">
                <label>Valor Pagado</label>
                <div class="input-wrapper">
                  <span class="prefix">$</span>
                  <!-- Cambiado a type="text" -->
                  <input v-model="form.valorPagado" type="text" class="form-input has-prefix" placeholder="0" />
                </div>
              </div>
              <div class="form-group" v-if="isAportes">
                <label>Fecha Expedición Cédula</label>
                <input v-model="form.expCedula" type="date" class="form-input" required />
              </div>
            </div>

            <div class="form-group">
              <label>Asignar Supervisor</label>
              <select v-model="form.supervisorId" class="form-input" required>
                <option :value="null" disabled selected>Seleccione un supervisor</option>
                <option v-for="opt in supervisors" :key="opt.value" :value="opt">{{ opt.label }}</option>
              </select>
            </div>
          </template>
        </section>

        <div class="form-actions">
          <router-link :to="{ name: 'home' }" class="btn btn-outline">Cancelar</router-link>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            <span v-if="loading">Procesando...</span>
            <span v-else>Registrar y Procesar</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.register-view { display: flex; justify-content: center; padding: 1rem 0; }
.register-card { width: 100%; max-width: 750px; padding: 2rem; }
.register-header { border-bottom: 1px solid var(--sena-gray-medium); padding-bottom: 1rem; margin-bottom: 1.5rem; }
.register-header h2 { color: var(--sena-purple); font-weight: 800; }
.section-title { font-size: 0.9rem; font-weight: 700; color: var(--sena-green); margin-bottom: 1rem; text-transform: uppercase; }
.separator { height: 1px; background: #EEE; margin: 1.5rem 0; }
.input-wrapper { position: relative; display: flex; align-items: center; }
.prefix { position: absolute; left: 0.75rem; color: var(--sena-text-light); font-weight: 700; }
.has-prefix { padding-left: 1.5rem !important; }
.form-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem; }
</style>
