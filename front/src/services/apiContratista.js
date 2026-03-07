import axios from './axios'

const getContratistas = async () => {
  const { data } = await axios.get('/contratistas')
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
  registerContratista,
  updateContratista
}
