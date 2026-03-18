import axios from "axios";

const USERS_API_URL =
  process.env.REACT_APP_USERS_API_URL ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "https://backend-daycatch.onrender.com/api/users"
    : "/api/users-proxy");

export const getAllUsers = async (params = {}) => {
  return await axios.get(USERS_API_URL, { params });
};
