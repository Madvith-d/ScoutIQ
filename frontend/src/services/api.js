import axios from 'axios';
import { auth } from '../firebase';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 30000, // 30 seconds
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      auth.signOut();
      window.location.href = '/login';
    }
    
    // Handle specific error messages from backend
    if (error.response?.data?.error) {
      // Pass through the specific error message from backend
      error.userMessage = error.response.data.error;
    } else if (error.code === 'ERR_NETWORK') {
      error.userMessage = 'Network error. Please check your connection and try again.';
    } else {
      error.userMessage = 'An unexpected error occurred. Please try again.';
    }
    
    return Promise.reject(error);
  }
);

// Resume analysis API
export const resumeAPI = {
  // Upload and analyze resume
  analyze: async (formData) => {
    const response = await api.post('/resume/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get analysis history
  getHistory: async (page = 1, limit = 10) => {
    const response = await api.get('/resume/history', {
      params: { page, limit },
    });
    return response.data;
  },

  // Get user stats
  getStats: async () => {
    const response = await api.get('/resume/stats');
    return response.data;
  },

  // Get specific analysis by ID
  getAnalysis: async (id) => {
    const response = await api.get(`/resume/${id}`);
    return response.data;
  },
};

// Auth API
export const authAPI = {
  // Verify token
  verifyToken: async () => {
    const response = await api.get('/auth/verify');
    return response.data;
  },
};

// Health check
export const healthAPI = {
  check: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;
