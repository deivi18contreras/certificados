<script setup>
<<<<<<< HEAD
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getSupervisors } from '../services/apiSupervisor'
import { getContratistaByDoc, registerContratista } from '../services/apiContratista'
import { registerReporte } from '../services/apiReporte'
=======
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getSupervisors } from '@/services/apiSupervisor'
import { getContratistaByDoc, registerContratista } from '@/services/apiContratista'
import { registerReporte } from '@/services/apiReporte'
>>>>>>> 64a23765abc45485dc75a2b30e320819c64f389c
import { useQuasar } from 'quasar'

const $q = useQuasar()
const router = useRouter()

const loading = ref(false)
<<<<<<< HEAD
const step = ref(1)
const supervisors = ref([])
const contratistaId = ref(null) // Nuevo: Guardar el ID encontrado
const operators = ["Aportes en Línea", "Compensar MiPlanilla", "SOI", "Asopagos"]
=======
const searched = ref(false)
const exists = ref(false)
const supervisors = ref([])
const operators = ["asopagos", "SOI", "compensar", "Aportes en linea"]
const months = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio", 
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
]
const currentYear = new Date().getFullYear()
const years = Array.from({ length: 5 }, (_, i) => currentYear - i)
>>>>>>> 64a23765abc45485dc75a2b30e320819c64f389c

const form = ref({
  nombres: '',
  apellidos: '',
<<<<<<< HEAD
  tipoDocumento: 'CC',
  numeroDocumento: '',
  eps: '',
  fechaExpedicion: '',
  operadorPago: '',
  supervisor: null,
  datosOperador: {
    mes: '',
    anio: '2026',
    numeroPlanilla: '',
    valorPagado: '',
    fechaPago: ''
  }
})

const months = [
  { label: "Enero", value: "01" }, { label: "Febrero", value: "02" },
  { label: "Marzo", value: "03" }, { label: "Abril", value: "04" },
  { label: "Mayo", value: "05" }, { label: "Junio", value: "06" },
  { label: "Julio", value: "07" }, { label: "Agosto", value: "08" },
  { label: "Septiembre", value: "09" }, { label: "Octubre", value: "10" },
  { label: "Noviembre", value: "11" }, { label: "Diciembre", value: "12" }
]
const years = ["2024", "2025", "2026"]

const buscarContratista = async () => {
  if (!form.value.numeroDocumento) return
  loading.value = true
  try {
    const res = await getContratistaByDoc(form.value.numeroDocumento)
    if (res && res.data) {
      const c = res.data
      contratistaId.value = c._id // Guardar el ID
      form.value.nombres = c.nombres
      form.value.apellidos = c.apellidos
      form.value.tipoDocumento = c.tipoDocumento
      form.value.eps = c.eps
      form.value.fechaExpedicion = c.fechaExpedicion ? c.fechaExpedicion.split('T')[0] : ''
      $q.notify({ type: 'positive', message: 'Contratista encontrado.' })
    }
  } catch (error) {
    contratistaId.value = null
    $q.notify({ message: 'Contratista no registrado. Ingrese sus datos.', color: 'orange' })
=======
  tipoDoc: 'CC',
  numeroDoc: '',
  eps: '',
  expCedula: '', 
  numPlanilla: '',
  mesPagado: '',
  anio: currentYear,
  valorPagado: '',
  fechaPago: '',
  supervisorId: '',
  entidadPagadora: ''
})

const searchingContratista = ref(false)

const findContratista = async () => {
  if (!form.value.numeroDoc) {
    $q.notify({ type: 'warning', message: 'Ingrese un número de documento' })
    return
  }
  
  searchingContratista.value = true
  try {
    const res = await getContratistaByDoc(form.value.numeroDoc)
    
    if (res.success && res.data) {
      const match = res.data
      form.value.nombres = match.nombres || ''
      form.value.apellidos = match.apellidos || ''
      
      if (match.eps) {
        const epsList = ['Sanitas', 'Sura', 'Compensar', 'Salud Total', 'Nueva EPS']
        const found = epsList.find(e => e.toLowerCase() === match.eps.toLowerCase())
        form.value.eps = found || match.eps
      }
      
      if (match.fechaExpedicion) {
        form.value.expCedula = new Date(match.fechaExpedicion).toISOString().split('T')[0]
      }
      exists.value = true
      $q.notify({ type: 'positive', message: 'Contratista encontrado' })
    }
  } catch (error) {
    exists.value = false
    $q.notify({ type: 'info', message: 'Contratista nuevo' })
  } finally {
    searched.value = true
    searchingContratista.value = false
  }
}

const isCompensar = computed(() => form.value.entidadPagadora === 'compensar')
const isAportes = computed(() => form.value.entidadPagadora === 'Aportes en linea')

const handleSubmit = async () => {
  if (!form.value.supervisorId) {
    $q.notify({ type: 'warning', message: 'Seleccione un supervisor' })
    return
  }

  loading.value = true
  try {
    let contratistaId = null;

    try {
        if (!exists.value) {
            const resContratista = await registerContratista({
              nombres: form.value.nombres,
              apellidos: form.value.apellidos,
              tipoDoc: form.value.tipoDoc,
              numeroDoc: form.value.numeroDoc,
              eps: form.value.eps,
              expCedula: form.value.expCedula
            })
            contratistaId = resContratista.data._id
        } else {
            const resSearch = await getContratistaByDoc(form.value.numeroDoc)
            contratistaId = resSearch.data._id
        }
    } catch (cError) {
        if (cError.response?.status === 400 && cError.response?.data?.data?._id) {
            contratistaId = cError.response.data.data._id
        } else {
            throw cError
        }
    }

    const entidadNormalizada = form.value.entidadPagadora.toLowerCase().replace(/\s/g, '')
    
    const resReporte = await registerReporte({
      numPlanilla: isCompensar.value ? form.value.numPlanilla : "0", 
      mesPagado: form.value.mesPagado,
      anio: form.value.anio.toString(),
      valorPagado: isCompensar.value ? form.value.valorPagado.toString() : "0",
      fechaPago: isCompensar.value ? form.value.fechaPago : `${form.value.anio}-01-01`, 
      contratistaId: contratistaId,
      supervisorId: form.value.supervisorId,
      entidadPagadora: entidadNormalizada,
      eps: form.value.eps, // Enviar EPS actual
      expCedula: form.value.expCedula // Enviar Fecha Exp actual
    })

    if (resReporte.success) {
      $q.notify({ type: 'positive', message: 'Registro exitoso' })
      router.push({ name: 'confirmacion' })
    }
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message;
    $q.notify({ type: 'negative', message: `Error: ${errorMsg}` })
>>>>>>> 64a23765abc45485dc75a2b30e320819c64f389c
  } finally {
    loading.value = false
  }
}

const loadSupervisors = async () => {
  try {
    const res = await getSupervisors()
<<<<<<< HEAD
    const data = Array.isArray(res) ? res : res.data
    supervisors.value = data.map(s => ({ label: s.nombre, value: s._id }))
  } catch (error) {
    console.error(error)
  }
}

const handleSubmit = async () => {
  if (!form.value.supervisor) {
    $q.notify({ type: 'warning', message: 'Seleccione un supervisor' })
    return
  }
  loading.value = true
  try {
    let finalContratistaId = contratistaId.value

    // 1. Solo registrar si no tenemos un ID previo
    if (!finalContratistaId) {
      const resC = await registerContratista({
        nombres: form.value.nombres,
        apellidos: form.value.apellidos,
        tipoDocumento: form.value.tipoDocumento,
        numeroDocumento: form.value.numeroDocumento,
        eps: form.value.eps,
        fechaExpedicion: form.value.fechaExpedicion
      })
      finalContratistaId = resC.data ? resC.data._id : resC._id
    }

    // 2. Registrar reporte
    await registerReporte({
      contratistaId: finalContratistaId,
      supervisorId: form.value.supervisor.value,
      operadorPago: form.value.operadorPago,
      periodoPago: {
        mes: months.find(m => m.value === form.value.datosOperador.mes)?.label.toLowerCase(),
        anio: form.value.datosOperador.anio
      },
      datosOperador: {
        numeroPlanilla: form.value.datosOperador.numeroPlanilla,
        valorPagado: form.value.datosOperador.valorPagado,
        fechaPago: form.value.datosOperador.fechaPago,
        eps: form.value.eps
      }
    })

    $q.notify({ type: 'positive', message: 'Reporte registrado. El robot iniciará pronto.' })
    router.push({ name: 'home' })
  } catch (error) {
    console.error(error)
    $q.notify({ type: 'negative', message: 'Error en el registro: ' + (error.response?.data?.message || error.message) })
  } finally {
    loading.value = false
  }
}

onMounted(loadSupervisors)
</script>

<template>
  <q-page class="q-pa-md bg-grey-2 flex flex-center">
    <q-card style="width: 100%; max-width: 900px; border-radius: 20px" flat bordered>
      <q-card-section class="bg-primary text-white q-pa-lg text-center">
        <div class="text-h4 text-weight-bold">SENA - Registro de Planillas</div>
        <div class="text-subtitle1">Sistema de Automatización de Certificados</div>
      </q-card-section>

      <q-stepper v-model="step" color="primary" animated header-nav>
        <q-step :name="1" title="Contratista" icon="person" :done="step > 1">
          <div class="text-h6 q-mb-md">Información del Contratista</div>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-4">
              <q-select v-model="form.tipoDocumento" :options="['CC', 'CE', 'PEP', 'PPT']" label="Tipo de Documento" outlined dense />
            </div>
            <div class="col-12 col-sm-8">
              <q-input v-model="form.numeroDocumento" label="Número de Documento" outlined dense required>
                <template v-slot:append>
                  <q-btn round dense flat icon="search" @click="buscarContratista" :loading="loading" />
                </template>
              </q-input>
            </div>
            <div class="col-12 col-sm-6">
              <q-input v-model="form.nombres" label="Nombres" outlined dense required />
            </div>
            <div class="col-12 col-sm-6">
              <q-input v-model="form.apellidos" label="Apellidos" outlined dense required />
            </div>
            <div class="col-12 col-sm-6">
              <q-select v-model="form.eps" :options="['Sanitas', 'Nueva EPS', 'Sura', 'Salud Total', 'Compensar', 'Coosalud']" label="EPS" outlined dense />
            </div>
            <div class="col-12 col-sm-6">
              <q-input v-model="form.fechaExpedicion" type="date" label="Fecha Expedición Documento" stack-label outlined dense required />
            </div>
          </div>
          <div class="row justify-end q-mt-lg">
            <q-btn color="primary" label="Continuar a Planilla" @click="step = 2" unelevated :disabled="!form.numeroDocumento || !form.nombres" />
          </div>
        </q-step>

        <q-step :name="2" title="Planilla" icon="assignment" :done="step > 2">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-select v-model="form.operadorPago" :options="operators" label="Seleccione el Operador de Pago" outlined required />
            </div>
            <div v-if="form.operadorPago" class="col-12">
              <q-card flat bordered class="bg-grey-1 q-pa-md">
                <div class="row q-col-gutter-sm">
                  <div class="col-12 col-sm-6">
                    <q-select v-model="form.datosOperador.mes" :options="months" label="Mes" outlined dense emit-value map-options required />
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-select v-model="form.datosOperador.anio" :options="years" label="Año" outlined dense required />
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input v-model="form.datosOperador.numeroPlanilla" label="Número de Planilla" outlined dense />
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input v-model="form.datosOperador.valorPagado" type="number" label="Valor Pagado" outlined dense />
                  </div>
                </div>
              </q-card>
            </div>
            <div class="col-12">
              <q-select v-model="form.supervisor" :options="supervisors" label="Seleccione su Supervisor" outlined required />
            </div>
          </div>
          <div class="row justify-between q-mt-lg">
            <q-btn flat label="Regresar" @click="step = 1" />
            <q-btn color="primary" label="Finalizar Registro" @click="handleSubmit" :loading="loading" unelevated />
          </div>
        </q-step>
      </q-stepper>
    </q-card>
  </q-page>
</template>
=======
    if (res.success) {
      supervisors.value = res.data.map(s => ({ label: s.nombre, value: s._id }))
    }
  } catch (error) {
    console.error('Error cargando supervisores', error)
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
        <p>Inicie ingresando su identificación</p>
      </div>

      <form @submit.prevent="handleSubmit" class="register-form">
        <!-- SECCIÓN 1: IDENTIFICACIÓN -->
        <section class="form-section">
          <h3 class="section-title">1. Identificación</h3>
          <div class="grid-ident">
            <div class="form-group">
              <label>Tipo Doc</label>
              <select v-model="form.tipoDoc" class="form-input" :disabled="searched && exists" @keyup.enter="findContratista">
                <option v-for="opt in ['CC', 'CE', 'PEP']" :key="opt" :value="opt">{{ opt }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Número de Documento</label>
              <div class="input-with-btn">
                <input v-model="form.numeroDoc" type="text" class="form-input" required placeholder="Ej: 12345678" :disabled="searched && exists" @keyup.enter="findContratista" />
                <button type="button" @click="findContratista" class="btn-search" :disabled="searchingContratista" v-if="!searched">
                  <span v-if="!searchingContratista">🔍</span>
                  <span v-else>⌛</span>
                </button>
              </div>
            </div>
          </div>
          
          <div v-if="searched" class="fade-in">
            <div class="grid-2">
              <div class="form-group">
                <label>Nombres</label>
                <input v-model="form.nombres" class="form-input" required :disabled="exists" />
              </div>
              <div class="form-group">
                <label>Apellidos</label>
                <input v-model="form.apellidos" class="form-input" required :disabled="exists" />
              </div>
            </div>

            <div class="form-group">
              <label>EPS</label>
              <select v-model="form.eps" class="form-input" required :disabled="exists">
                <option value="" disabled selected>Seleccione su EPS</option>
                <option v-for="opt in ['Sanitas', 'Sura', 'Compensar', 'Salud Total', 'Nueva EPS']" :key="opt" :value="opt">{{ opt }}</option>
              </select>
            </div>
          </div>
        </section>

        <!-- SECCIÓN 2: DETALLES -->
        <div v-if="searched" class="fade-in">
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
                    <input v-model="form.valorPagado" type="text" class="form-input has-prefix" placeholder="0" />
                  </div>
                </div>
                <div class="form-group" v-if="isAportes">
                  <label>Fecha Expedición Cédula</label>
                  <input v-model="form.expCedula" type="date" class="form-input" required :disabled="exists && form.expCedula !== ''" />
                </div>
              </div>

              <div class="form-group">
                <label>Asignar Supervisor</label>
                <select v-model="form.supervisorId" class="form-input" required>
                  <option value="" disabled selected>Seleccione un supervisor</option>
                  <option v-for="opt in supervisors" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                </select>
              </div>
            </template>
          </section>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary" :disabled="loading">
              <span v-if="loading">Procesando...</span>
              <span v-else>Registrar y Procesar</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.register-view { display: flex; justify-content: center; padding: 1rem 0; }
.register-card { width: 100%; max-width: 750px; padding: 2rem; background: white; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
.register-header { border-bottom: 1px solid #eee; padding-bottom: 1rem; margin-bottom: 1.5rem; }
.register-header h2 { color: #572364; font-weight: 800; margin: 0; }
.section-title { font-size: 0.85rem; font-weight: 700; color: #39A900; margin-bottom: 1.2rem; text-transform: uppercase; letter-spacing: 0.5px; }
.separator { height: 1px; background: #f0f0f0; margin: 1.5rem 0; }
.form-group { margin-bottom: 1rem; }
.form-group label { display: block; font-size: 0.85rem; font-weight: 600; color: #666; margin-bottom: 0.4rem; }
.form-input { width: 100%; padding: 0.6rem 0.8rem; border: 1.5px solid #e0e0e0; border-radius: 8px; font-size: 0.9rem; transition: all 0.3s; }
.form-input:focus { border-color: #39A900; outline: none; box-shadow: 0 0 0 3px rgba(57,169,0,0.1); }
.form-input:disabled { background-color: #f5f5f5; color: #888; cursor: not-allowed; }

.grid-ident { display: grid; grid-template-columns: 150px 1fr; gap: 1rem; margin-bottom: 1rem; }
.input-with-btn { display: flex; gap: 0.5rem; }
.btn-search { background: #572364; border: none; border-radius: 8px; color: white; padding: 0 1.2rem; cursor: pointer; transition: all 0.3s; font-size: 1rem; }
.btn-search:hover { background: #451c50; transform: scale(1.02); }
.btn-search:disabled { background: #ccc; cursor: not-allowed; }

.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.input-wrapper { position: relative; display: flex; align-items: center; }
.prefix { position: absolute; left: 0.75rem; color: #999; font-weight: 700; }
.has-prefix { padding-left: 1.5rem !important; }
.form-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem; }
.btn { padding: 0.7rem 1.5rem; border-radius: 8px; font-weight: 700; cursor: pointer; transition: all 0.3s; text-decoration: none; border: none; }
.btn-primary { background: #39A900; color: white; width: 100%; max-width: 250px; }
.btn-primary:hover { background: #2d8500; transform: translateY(-2px); }
.btn-primary:disabled { background: #ccc; cursor: not-allowed; transform: none; }

.fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
>>>>>>> 64a23765abc45485dc75a2b30e320819c64f389c
