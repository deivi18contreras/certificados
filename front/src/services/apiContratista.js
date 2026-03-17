<<<<<<< HEAD
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
=======
import axios from './axios'

const getContratistas = async () => {
  const { data } = await axios.get('/contratistas')
  return data
}

const getContratistaByDoc = async (numeroDoc) => {
  const { data } = await axios.get(`/contratistas/documento/${numeroDoc}`)
  return data
}

const registerContratista = async (contratistaData) => {
  const { data } = await axios.post('/contratistas', contratistaData)
  return data
}

const updateContratista = async (id, contratistaData) => {
  const { data } = await axios.put(`/contratistas/${id}`, contratistaData)
  return data
}

export {
  getContratistas,
  getContratistaByDoc,
  registerContratista,
  updateContratista
}
>>>>>>> 64a23765abc45485dc75a2b30e320819c64f389c
