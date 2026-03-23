import apiClient from './apiClient';

// Fallback Mock Data
const mockUserData = {
  id: 'user-mock-123',
  fullName: 'John Doe',
  email: 'john.doe@email.com',
  role: 'customer'
};

const authService = {
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem('lumen_auth_token', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.warn('Auth API unavailable, falling back to mock login');
      // Simulated token for mock session
      localStorage.setItem('lumen_auth_token', 'mock_token_abc123');
      return { token: 'mock_token_abc123', user: { ...mockUserData, email: credentials.email, role: credentials.role } };
    }
  },

  signup: async (userData) => {
    try {
      const response = await apiClient.post('/auth/signup', userData);
      if (response.data.token) {
        localStorage.setItem('lumen_auth_token', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.warn('Auth API unavailable, falling back to mock signup');
      localStorage.setItem('lumen_auth_token', 'mock_token_abc123');
      return { token: 'mock_token_abc123', user: { ...mockUserData, ...userData } };
    }
  },

  logout: () => {
    localStorage.removeItem('lumen_auth_token');
  },

  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch (error) {
      const token = localStorage.getItem('lumen_auth_token');
      if (token === 'mock_token_abc123') {
        return mockUserData;
      }
      throw error;
    }
  }
};

export default authService;
