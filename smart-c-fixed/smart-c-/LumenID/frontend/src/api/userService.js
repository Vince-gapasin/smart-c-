import apiClient from './apiClient';

const userService = {
  getProfile: async () => {
    try {
      const response = await apiClient.get('/users/profile');
      return response.data;
    } catch (error) {
      console.warn('User API unavailable:', error.message);
      return null;
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await apiClient.patch('/users/profile', profileData);
      return response.data;
    } catch (error) {
      console.warn('User API unavailable:', error.message);
      return { success: false };
    }
  }
};

export default userService;
