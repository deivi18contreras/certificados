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
  expCedula: '', // Ahora se mostrará condicionalmente en detalles
  
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
    // 1. Registrar/Verificar contratista (Lógica simplificada: siempre intenta registrar o buscar)
    // En un flujo real, buscaríamos primero por numeroDoc.
    const resContratista = await registerContratista({
      nombres: form.value.nombres,
      apellidos: form.value.apellidos,
      tipoDoc: form.value.tipoDoc,
      numeroDoc: form.value.numeroDoc,
      eps: form.value.eps,
      expCedula: form.value.expCedula
    }).catch(err => {
        // Si ya existe, asumimos que podemos continuar con ese ID (necesitaría ajuste en backend para devolver el existente en el error o un endpoint de búsqueda)
        // Por ahora, si falla el registro por duplicado, intentaremos manejarlo.
        return err.response?.data?.data || null 
    })

    const contratistaId = resContratista?.data?._id || resContratista?._id

    if (!contratistaId) {
       // Si no tenemos ID, buscamos en la lista existente (fallback temporal)
       const allC = await getContratistas()
       const match = allC.data.find(c => c.numeroDoc === form.value.numeroDoc)
       if (match) form.value.contratistaId = match._id
       else throw new Error('No se pudo determinar el ID del contratista')
    } else {
        form.value.contratistaId = contratistaId
    }

    // 2. Registrar Reporte
    const resReporte = await registerReporte({
      numPlanilla: isCompensar.value ? form.value.numPlanilla : 0, // Enviar 0 si no aplica para pasar validación
      mesPagado: form.value.mesPagado,
      valorPagado: isCompensar.value ? form.value.valorPagado : 0,
      fechaPago: isCompensar.value ? form.value.fechaPago : `${form.value.anio}-01-01`, // Fecha construida para el año
      contratistaId: form.value.contratistaId,
      supervisorId: form.value.supervisorId.value,
      entidadPagadora: form.value.entidadPagadora.toLowerCase() === 'aportes en linea' ? 'aportesEnLinea' : form.value.entidadPagadora.toLowerCase()
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
  <q-page class="q-pa-xl bg-grey-1 flex flex-center">
    <q-card style="max-width: 800px; width: 100%; border-radius: 16px" flat bordered>
      <q-card-section class="bg-primary text-white q-pa-lg">
        <div class="text-h5 text-weight-bold">Registro de Planilla PILA</div>
        <div class="text-subtitle2">Complete la información para procesar su certificado automáticamente</div>
      </q-card-section>

      <q-form @submit="handleSubmit" class="q-pa-lg">
        <div class="text-h6 q-mb-md text-primary">1. Datos Personales</div>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-6">
            <q-input v-model="form.nombres" label="Nombres" outlined dense required />
          </div>
          <div class="col-12 col-sm-6">
            <q-input v-model="form.apellidos" label="Apellidos" outlined dense required />
          </div>
          <div class="col-12 col-sm-4">
            <q-select v-model="form.tipoDoc" :options="['CC', 'CE', 'PEP']" label="Tipo Doc" outlined dense />
          </div>
          <div class="col-12 col-sm-8">
            <q-input v-model.number="form.numeroDoc" type="number" label="Número de Documento" outlined dense required class="q-no-input-spinner" />
          </div>
          <div class="col-12 col-sm-6">
            <q-select v-model="form.eps" :options="['Sanitas', 'Sura', 'Compensar', 'Salud Total', 'Nueva EPS']" label="EPS" outlined dense required />
          </div>
        </div>

        <q-separator class="q-my-lg" />

        <div class="text-h6 q-mb-md text-primary">2. Detalles de la Planilla</div>
        <div class="row q-col-gutter-md">
          <!-- Operador de Pago (Siempre visible) -->
          <div class="col-12">
            <q-select v-model="form.entidadPagadora" :options="operators" label="Operador de Pago" outlined dense required />
          </div>

          <!-- Campos condicionales -->
          <template v-if="form.entidadPagadora">
            <div class="col-12 col-sm-6" v-if="isCompensar">
              <q-input v-model.number="form.numPlanilla" type="number" label="Número de Planilla" outlined dense required class="q-no-input-spinner" />
            </div>
            
            <div class="col-12 col-sm-6" v-if="isCompensar">
              <q-input v-model="form.fechaPago" type="date" label="Fecha de Pago" stack-label outlined dense required />
            </div>

            <div class="col-12 col-sm-6">
              <q-select v-model="form.mesPagado" :options="months" label="Mes a Reportar" outlined dense required />
            </div>
            <div class="col-12 col-sm-6">
              <q-select v-model="form.anio" :options="years" label="Año a Reportar" outlined dense required />
            </div>

            <div class="col-12 col-sm-6" v-if="isCompensar">
              <q-input v-model.number="form.valorPagado" type="number" label="Valor Pagado" outlined dense prefix="$" class="q-no-input-spinner" />
            </div>

            <div class="col-12 col-sm-6" v-if="isAportes">
              <q-input v-model="form.expCedula" type="date" label="Fecha Expedición Cédula" stack-label outlined dense required />
            </div>

            <div class="col-12 col-sm-6">
              <q-select v-model="form.supervisorId" :options="supervisors" label="Asignar Supervisor" outlined dense required />
            </div>
          </template>
        </div>

        <div class="row justify-end q-mt-xl">
          <q-btn label="Cancelar" flat color="grey-7" class="q-mr-sm" :to="{ name: 'home' }" />
          <q-btn label="Registrar y Procesar" color="primary" unelevated :loading="loading" type="submit" />
        </div>
      </q-form>
    </q-card>
  </q-page>
</template>
