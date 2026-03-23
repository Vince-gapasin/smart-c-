import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Add Auth Token
apiClient.interceptors.request.use(
  (config) => {
    try {
      const storedAuth = sessionStorage.getItem('auth');
      if (storedAuth) {
        const { user } = JSON.parse(storedAuth);
        // Assuming the token is stored in user.token
        if (user && user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      }
    } catch (e) {
      console.error('Failed to parse auth from session storage', e);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Global Error Handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    
    // Handle specific status codes
    if (error.response?.status === 401) {
      // Unauthorized: Logout user globally using custom event
      window.dispatchEvent(new Event('lumen_unauthorized'));
    }

    return Promise.reject(new Error(message));
  }
);

export default apiClient;
