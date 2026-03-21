import axios from "axios";

// API base URL — always use local backend
const API_BASE_URL = "http://localhost:5001/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,

  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor for backward compatibility and data flattening
api.interceptors.response.use(
  (response) => {
    // Check if it's our new structured response
    if (response.data && response.data.status === "success") {
      // If the component expects 'results' to be the array (backward compatibility)
      if (response.data.data && Array.isArray(response.data.data)) {
        response.data.results = response.data.data;
      }
      
      // Flatten the data for easier access in components if they use response.data directly
      // However, most components seem to use response.data.results, so we kept it above.
    }
    return response;
  },
  (error) => {
    // Centralized error handling could be added here
    return Promise.reject(error);
  }
);

export default api;
