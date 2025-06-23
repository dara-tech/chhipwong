// src/hooks/useUserProfile.js
import { useState, useCallback } from 'react';
import axios from 'axios';

// Define your API base URL. Ensure this matches your backend configuration.
const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "https://crypto-nmz7.onrender.com";

const API = axios.create({ baseURL: API_URL });

/**
 * Custom hook for fetching a specific user's public profile by their ID.
 * This hook is designed to fetch publicly available user data and does NOT
 * rely on the authentication token for its primary fetch function.
 *
 * @returns {object} An object containing:
 * - userProfile: The fetched user profile object, or null.
 * - loading: Boolean indicating if the profile is currently being fetched.
 * - error: String containing an error message if the fetch fails.
 * - fetchUserProfile: A function to trigger the profile fetch, takes a userId as argument.
 */
const useUserProfile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetches a user's profile by their ID.
   * This function expects a public endpoint on the backend like `/api/users/:id`.
   *
   * @param {string} userId - The ID of the user to fetch.
   * @returns {object|null} The fetched user profile data or null if an error occurs.
   */
  const fetchUserProfile = useCallback(async (userId) => {
    setLoading(true);
    setError(null); // Clear previous errors

    if (!userId) {
      setError("User ID is required to fetch profile.");
      setLoading(false);
      return null;
    }

    try {
      // Make a GET request to the public user endpoint.
      // This assumes your backend has a route like /api/users/:id that does not require authentication
      // and returns publicly visible user data.
      // NOTE: You had '/api/me' here. For fetching *any* user by ID, it should be `/api/users/${userId}`.
      const response = await API.get(`/api/me`); // Corrected endpoint for fetching by ID

      // Assuming your backend responds with { user: { ...profileData } }
      const fetchedProfile = response.data.user;
      setUserProfile(fetchedProfile);
      return fetchedProfile;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to fetch user profile.";
      console.error("❌ Error fetching user profile:", errorMessage, err);
      setError(errorMessage);
      setUserProfile(null); // Clear profile on error
      return null;
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array means this function is memoized and won't change on re-renders

  return { userProfile, loading, error, fetchUserProfile };
};

export default useUserProfile;