import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.MODE === "development"
  ? "http://localhost:5001"
  : "https://chhipwong.onrender.com";

const API = axios.create({ baseURL: API_URL });

const useViewers = () => {
  const [viewers, setViewers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchViewers = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await API.get("/api/viewers");
      setViewers(data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to fetch viewers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchViewers();
  }, []);

  return { viewers, loading, error, fetchViewers };
};

export default useViewers; 