<<<<<<< HEAD
import api from './axios';

export const getSupervisors = async () => {
  const { data } = await api.get('/supervisors');
  return data;
};

export const loginSupervisor = async (credentials) => {
  const { data } = await api.post('/supervisors/login', credentials);
  return data;
};

export const getGoogleAuthUrl = async (id) => {
  const { data } = await api.get(`/supervisors/auth/google/${id}`);
  return data;
};
=======
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

const createTestSupervisor = async () => {
  const { data } = await axios.get('/supervisors/test-create')
  return data
}

export {
  loginSupervisor,
  getSupervisorProfile,
  getSupervisors,
  createTestSupervisor
}
>>>>>>> 64a23765abc45485dc75a2b30e320819c64f389c
