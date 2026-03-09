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
