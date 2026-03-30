import axios from "axios";
import { getAuthSession, clearAuthSession } from "../utils/authSession";

const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
export const API_ROOT_URL = isLocal ? "http://localhost:5001" : "https://backend-daycatch.onrender.com";
export const API_BASE_URL = `${API_ROOT_URL}/api/v1`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Flag to prevent multiple refresh calls
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(
  (config) => {
    const { token } = getAuthSession();
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
    // Standard industry response normalization
    if (response.data && response.data.status === "success") {
      if (response.data.data && Array.isArray(response.data.data)) {
        response.data.results = response.data.data;
      }
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 1) Handle 401 Unauthorized (Expired Access Token)
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // If we are on login page, don't try to refresh
      if (window.location.pathname === "/login") {
        clearAuthSession();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queue this request while refreshing is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const { refreshToken } = getAuthSession();

      if (!refreshToken) {
        isRefreshing = false;
        clearAuthSession();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        // Industry Standard: Call refresh-token endpoint
        const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
          refreshToken,
        });

        const { token: newToken } = response.data;
        
        // Update local session with new access token
        localStorage.setItem("token", newToken);
        
        processQueue(null, newToken);
        isRefreshing = false;

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        
        // Refresh token failed -> Force Logout
        clearAuthSession();
        if (window.location.pathname !== "/login") {
            window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
