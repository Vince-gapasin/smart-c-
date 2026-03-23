import apiClient from './apiClient';
import { mockCredentials } from '../data/mockData';

const credentialService = {
  getCredentials: async () => {
    try {
      const response = await apiClient.get('/credentials');
      return response.data;
    } catch (error) {
      console.warn('Credential API unavailable, falling back to mock data');
      return mockCredentials;
    }
  },

  getCredentialById: async (id) => {
    try {
      const response = await apiClient.get(`/credentials/${id}`);
      return response.data;
    } catch (error) {
      console.warn('Credential API unavailable, falling back to mock data');
      return mockCredentials.find(c => c.id === id);
    }
  },

  requestCredential: async (requestData) => {
    try {
      const response = await apiClient.post('/credentials/request', requestData);
      return response.data;
    } catch (error) {
      console.warn('Credential API unavailable, returning simulated success');
      return { success: true, message: 'Request submitted (mock mode)' };
    }
  }
};

export default credentialService;
