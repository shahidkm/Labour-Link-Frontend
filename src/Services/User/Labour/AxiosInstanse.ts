
import axios from 'axios';

const BASE_API_URL = 'https://localhost:7202/api';

export const axiosInstance = axios.create({
  baseURL: BASE_API_URL,
  withCredentials: true, // Enable sending cookies with cross-origin requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to attach additional headers if needed
axiosInstance.interceptors.request.use(
  (config) => {
    // Optional: Add any additional headers
    // For example, you might want to add a custom header
    // config.headers['X-Custom-Header'] = 'value';
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Add response interceptor for global error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Global error handling
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Data:', error.response.data);
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Request:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);
