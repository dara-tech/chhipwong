import { useState, useCallback } from 'react';
import axios from 'axios';

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

const useUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.get('/api/auth/users');
      setUsers(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteUser = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    try {
      await API.delete(`/api/auth/users/${userId}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user.');
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserById = useCallback(async (userId) => {
    setError(null);
    setLoading(true);
    try {
      const { data } = await API.get(`/api/auth/users/${userId}`);
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error fetching user details';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUserByAdmin = useCallback(async (userId, userData) => {
    setError(null);
    setLoading(true);
    try {
      const { data } = await API.put(`/api/auth/users/${userId}`, userData);
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error updating user';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return { users, loading, error, fetchUsers, deleteUser, getUserById, updateUserByAdmin };
};

export default useUserManagement;
