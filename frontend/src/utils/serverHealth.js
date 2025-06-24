import axios from 'axios';

const SERVER_URL = 'https://chhipwong.onrender.com/health'; // Use explicit health endpoint
const TIMEOUT = 8000; // 8 seconds timeout

/**
 * Checks if the server is up and running
 * @returns {Promise<boolean>} True if server is up, false otherwise
 */
export const checkServerHealth = async () => {
  try {
    const response = await axios.get(SERVER_URL, {
      timeout: TIMEOUT,
      headers: { 'Cache-Control': 'no-cache' }
    });
    return response.status === 200;
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      console.error('Server health check failed: Request timed out after', TIMEOUT, 'ms');
    } else if (error.response) {
      console.error('Server health check failed: Received status', error.response.status);
    } else {
      console.error('Server health check failed:', error.message);
    }
    return false;
  }
};

export default checkServerHealth;
