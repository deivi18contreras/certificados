import axios from './axios'

const loginSupervisor = async (credentials) => {
  const { data } = await axios.post('/supervisors/login', credentials)
  return data
}

const getSupervisorProfile = async () => {
  const { data } = await axios.get('/supervisors/profile')
  return data
}

const getSupervisors = async () => {
  const { data } = await axios.get('/supervisors')
  return data
}

export {
  loginSupervisor,
  getSupervisorProfile,
  getSupervisors
}

