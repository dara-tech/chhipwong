import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// At the top of usePaymentGateways.js
// At the top of usePaymentGateways.js
let API_URL;
if (process.env.NODE_ENV === 'test') {
  API_URL = 'http://test-api';
} else {
  API_URL = import.meta.env.MODE === 'development'
    ? 'http://localhost:5001'
    : 'https://crypto-nmz7.onrender.com';
}

const API = axios.create({ baseURL: API_URL });

// Interceptor to automatically attach JWT token to requests
// This is important if the /api/payments endpoint requires authentication
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to automatically attach JWT token to requests
// This is important if the /api/payments endpoint requires authentication
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const usePaymentGateways = () => {
  const [gateways, setGateways] = useState(null); // Initialize as null if expecting an object, or [] if an array
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchGateways = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get('/api/payments');
      // Assuming the response data is an array of gateways or a single object for this page
      // If it's nested, e.g., response.data.gateways, adjust accordingly
      setGateways(response.data || (Array.isArray(response.data) ? [] : null)); 
    } catch (err) {
      setError(err); // Set the full error object
      setGateways(Array.isArray(null) ? [] : null); // Clear gateways on error, ensure type consistency with initial state if it was an array
      console.error('Error fetching payment gateways:', err.response?.data?.message || err.message, err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGateways(); // Fetch gateways when the hook is first used
  }, [fetchGateways]);

  return { gateways, loading, error, refetchGateways: fetchGateways };
};

export default usePaymentGateways;
