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
