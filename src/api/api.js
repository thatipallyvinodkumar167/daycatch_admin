import axios from "axios";

export const API_BASE_URL = "https://backend-daycatch.onrender.com/api/v1";
export const API_ROOT_URL = "https://backend-daycatch.onrender.com";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    if (response.data && response.data.status === "success") {
      if (response.data.data && Array.isArray(response.data.data)) {
        response.data.results = response.data.data;
      }
    }

    return response;
  },
  (error) => Promise.reject(error)
);

export default api;
