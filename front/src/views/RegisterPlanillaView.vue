<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getSupervisors } from '../services/apiSupervisor'
import { getContratistaByDoc, registerContratista } from '../services/apiContratista'
import { registerReporte } from '../services/apiReporte'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const router = useRouter()

const loading = ref(false)
const step = ref(1)
const supervisors = ref([])
const contratistaId = ref(null) // Nuevo: Guardar el ID encontrado
const operators = ["Aportes en Línea", "Compensar MiPlanilla", "SOI", "Asopagos"]

const form = ref({
  nombres: '',
  apellidos: '',
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
  } finally {
    loading.value = false
  }
}

const loadSupervisors = async () => {
  try {
    const res = await getSupervisors()
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
