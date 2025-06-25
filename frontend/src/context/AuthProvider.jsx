import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.MODE === 'development' ? 'http://localhost:5001' : 'https://chhipwong.onrender.com';
const API = axios.create({ baseURL: API_URL });

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

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getAdminProfile = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setProfile(null);
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      const { data } = await API.get('/api/auth/me');
      const userData = data?.user || data;

      if (!userData || typeof userData !== 'object') {
        throw new Error('Unexpected API response format.');
      }

      setProfile({ ...userData, lastLogin: userData.lastLogin });
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error fetching profile:', error);
      localStorage.removeItem('token');
      setProfile(null);
      setIsAuthenticated(false);
      setError(error.response?.data?.message || 'Session expired. Please log in again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogin = useCallback(async (credentials) => {
    setError('');
    try {
      const { data } = await API.post('/api/auth/login', credentials);
      localStorage.setItem('token', data.token);
      const userData = data?.user || data;
      setProfile({ ...userData, lastLogin: userData.lastLogin });
      setIsAuthenticated(true);
      const from = new URLSearchParams(window.location.search).get('from') || '/';
      navigate(from, { replace: true });
      return { success: true };
    } catch (err) {
      const errorMessage = err?.response?.data?.message || 'Login failed.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [navigate]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    setProfile(null);
    setIsAuthenticated(false);
    navigate('/login');
  }, [navigate]);

  const handleRegister = useCallback(async (credentials) => {
    setError('');
    try {
      await API.post('/api/auth/register', credentials);
      navigate('/login');
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed.');
    }
  }, [navigate]);

  const updateAdminProfile = useCallback(async (formData) => {
    setError('');
    try {
      const { data } = await API.put('/api/auth/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      
      if (data.user) {
        setProfile(data.user);
      }
      
      return {
        success: true,
        data
      };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error updating profile';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    }
  }, []);

  const getUser = useCallback(async () => {
    setError('');
    try {
      const { data } = await API.get(`/api/auth/users`);
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error fetching user';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const getUserById = useCallback(async (userId) => {
    setError('');
    try {
      const { data } = await API.get(`/api/auth/users/${userId}`);
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error fetching user details';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const updateUserByAdmin = useCallback(async (userId, userData) => {
    setError('');
    try {
      const { data } = await API.put(`/api/auth/users/${userId}`, userData);
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error updating user';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  useEffect(() => {
    getAdminProfile();
  }, [getAdminProfile]);

  const authContextValue = {
    profile,
    error,
    loading,
    isAuthenticated,
    handleLogin,
    logout: handleLogout,
    handleLogout,
    handleRegister,
    updateAdminProfile,
    getAdminProfile,
    getUser,
    getUserById,
    updateUserByAdmin,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};