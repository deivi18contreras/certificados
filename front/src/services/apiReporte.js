import axios from './axios'

const getReportes = async () => {
  const { data } = await axios.get('/reportes')
  return data
}

const registerReporte = async (reporteData) => {
  const { data } = await axios.post('/reportes', reporteData)
  return data
}

export {
  getReportes,
  registerReporte
}
