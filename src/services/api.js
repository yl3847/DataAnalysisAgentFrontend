import axios from 'axios';

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:3001';
const LAMBDA_URL = process.env.REACT_APP_LAMBDA_URL;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_ENDPOINT,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log('API Request:', config);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Log response in development
    if (process.env.NODE_ENV === 'development') {
      console.log('API Response:', response);
    }
    
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Handle unauthorized
          localStorage.removeItem('authToken');
          window.location.href = '/login';
          break;
        case 403:
          console.error('Forbidden:', error.response.data);
          break;
        case 404:
          console.error('Not found:', error.response.data);
          break;
        case 500:
          console.error('Server error:', error.response.data);
          break;
        default:
          console.error('API Error:', error.response.data);
      }
    } else if (error.request) {
      console.error('Network error:', error.request);
    } else {
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// API methods
const api = {
  // Query endpoint
  async sendQuery(query, options = {}) {
    try {
      const response = await apiClient.post('/query', {
        query,
        ...options,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get data with filters
  async getData(filters = {}) {
    try {
      const response = await apiClient.get('/data', { params: filters });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get chart data
  async getChartData(chartType, params = {}) {
    try {
      const response = await apiClient.post('/charts', {
        type: chartType,
        ...params,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Health check
  async healthCheck() {
    try {
      const response = await apiClient.get('/health');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Export data
  async exportData(format, data) {
    try {
      const response = await apiClient.post('/export', {
        format,
        data,
      }, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default api;