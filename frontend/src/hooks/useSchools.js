import { useState, useCallback } from "react";

import axios from "axios";

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "https://chhipwong.onrender.com";

const API = axios.create({ baseURL: API_URL });

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

const useSchools = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Get all schools
  const getSchools = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/api/schools");
      setSchools(data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to fetch schools");
    } finally {
      setLoading(false);
    }
  };

  // Get single school
  const getSchool = async (id) => {
    try {
      const { data } = await API.get(`/api/schools/${id}`);
      return data;
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to fetch school");
      return null;
    }
  };

  // Create new school
  const createSchool = async (schoolData) => {
    setLoading(true);
    try {
      const formData = new FormData();
      
      // Handle basic fields
      Object.keys(schoolData).forEach(key => {
        if (key !== 'logo' && key !== 'heroImages' && key !== 'testimonialImages') {
          if (typeof schoolData[key] === 'object') {
            formData.append(key, JSON.stringify(schoolData[key]));
          } else {
            formData.append(key, schoolData[key]);
          }
        }
      });

      // Handle file uploads
      if (schoolData.logo) {
        formData.append('logo', schoolData.logo);
      }
      
      if (schoolData.heroImages) {
        schoolData.heroImages.forEach(image => {
          formData.append('heroImages', image);
        });
      }

      if (schoolData.testimonialImages) {
        schoolData.testimonialImages.forEach(image => {
          formData.append('testimonialImages', image);
        });
      }

      const { data } = await API.post("/api/schools", formData);
      setSchools([...schools, data]);
      return data;
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create school");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update school
  const updateSchool = useCallback(async (id, schoolData) => {
    setLoading(true);
    try {
      // Convert FormData to regular object
      const formDataObj = {};
      for(let [key, value] of schoolData.entries()) {
        try {
          // Try to parse JSON strings
          formDataObj[key] = JSON.parse(value);
        } catch {
          // If not JSON, use raw value
          formDataObj[key] = value;
        }
      }

      if (schoolData.logo) {
        formDataObj.logo = schoolData.logo;
      } 
      
      if (schoolData.heroImages) {
        formDataObj.heroImages = schoolData.heroImages;
      }
      
      if (schoolData.testimonialImages) {
        formDataObj.testimonialImages = schoolData.testimonialImages;
      }
      
      const response = await API.put(`/api/schools/${id}`, formDataObj, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Update schools state with new data
      setSchools(prevSchools => 
        prevSchools.map(school => 
          school._id === id ? response.data : school
        )
      );
      
      return response.data;
    } catch (err) {
      console.error("Update error:", err);
      setError(err?.response?.data?.message || "Failed to update school");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete school
  const deleteSchool = async (id) => {
    setLoading(true);
    try {
      await API.delete(`/api/schools/${id}`);
      setSchools(schools.filter(school => school._id !== id));
      return true;
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete school");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    schools,
    loading,
    error,
    getSchools,
    getSchool,
    createSchool,
    updateSchool,
    deleteSchool
  };
};

export default useSchools;
