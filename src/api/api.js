import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "https://daycatch-backend-1.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;
