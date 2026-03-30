import axios from "axios";

export const API_BASE_URL = "http://localhost:5001/api/v1";
export const API_ROOT_URL = "http://localhost:5001";

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
  (error) => {
    if (error.response && error.response.status === 401) {
      if (window.location.pathname !== "/login") {
        localStorage.removeItem("token");
        localStorage.removeItem("user_role");
        localStorage.removeItem("user_email");
        localStorage.removeItem("user_name");
        localStorage.removeItem("user_scope");
        localStorage.removeItem("user_store_id");
        localStorage.removeItem("user_store_name");
        localStorage.removeItem("user_status");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
