import api from "./api";

// Cities APIs
export const addCity = async (data) => {
  return await api.post("/cities", data);
};

export const getAllCities = async (params = {}) => {
  return await api.get("/cities", { params });
};

export const updateCity = async (id, data) => {
  return await api.patch(`/cities/${id}`, data);
};

export const deleteCity = async (id) => {
  return await api.delete(`/cities/${id}`);
};

// Area APIs
export const addArea = async (data) => {
  return await api.post("/areas", data);
};

export const getAllAreas = async (params = {}) => {
  return await api.get("/areas", { params });
};

export const updateArea = async (id, data) => {
  return await api.patch(`/areas/${id}`, data);
};

export const deleteArea = async (id) => {
  return await api.delete(`/areas/${id}`);
};
