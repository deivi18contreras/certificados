import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api';

const apiService = {
  // --- Contratistas ---
  async getContratistas() {
    try {
      const response = await axios.get(`${API_BASE_URL}/contratistas`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener contratistas:', error);
      throw error;
    }
  },

  async createContratista(data) {
    try {
      const response = await axios.post(`${API_BASE_URL}/contratistas`, data);
      return response.data;
    } catch (error) {
      console.error('Error al crear contratista:', error);
      throw error;
    }
  },

  // --- Supervisors ---
  async getSupervisors() {
    try {
      const response = await axios.get(`${API_BASE_URL}/supervisors`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener supervisores:', error);
      throw error;
    }
  },

  async createSupervisor(data) {
    try {
      const response = await axios.post(`${API_BASE_URL}/supervisors`, data);
      return response.data;
    } catch (error) {
      console.error('Error al crear supervisor:', error);
      throw error;
    }
  },

  // --- Reportes ---
  async getReportes() {
    try {
      const response = await axios.get(`${API_BASE_URL}/reportes`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener reportes:', error);
      throw error;
    }
  },

  async createReporte(data) {
    try {
      const response = await axios.post(`${API_BASE_URL}/reportes`, data);
      return response.data;
    } catch (error) {
      console.error('Error al crear reporte:', error);
      throw error;
    }
  }
};

export default apiService;
