<<<<<<< HEAD
import api from './axios';

export const getReportes = async () => {
  const { data } = await api.get('/reportes');
  return data;
};

export const getReportesBySupervisor = async (supervisorId) => {
    const { data } = await api.get(`/reportes/supervisor/${supervisorId}`);
    return data;
};

export const registerReporte = async (reporteData) => {
  const { data } = await api.post('/reportes', reporteData);
  return data;
};
=======
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
>>>>>>> 64a23765abc45485dc75a2b30e320819c64f389c
