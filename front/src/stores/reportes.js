import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useReportesStore = defineStore('reportes', () => {
  const reportes = ref([])
  const contratistas = ref([])
  const loading = ref(false)

  const setReportes = (data) => {
    reportes.value = data
  }

  const setContratistas = (data) => {
    contratistas.value = data
  }

  return {
    reportes,
    contratistas,
    loading,
    setReportes,
    setContratistas
  }
})
