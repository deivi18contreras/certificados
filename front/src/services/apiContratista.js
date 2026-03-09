import api from './axios';

export const getContratistas = async () => {
  const { data } = await api.get('/contratistas');
  return data;
};

export const getContratistaByDoc = async (doc) => {
  const { data } = await api.get(`/contratistas/documento/${doc}`);
  return data;
};

export const registerContratista = async (contratistaData) => {
  const { data } = await api.post('/contratistas', contratistaData);
  return data;
};
