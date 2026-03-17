import api from "./api";

// Cities APIs
export const addCity = async (data) => {
  return await api.post("/areaManagment/addCity", data);
};

export const getAllCities = async () => {
  return await api.get("/areaManagment/getAllCities");
};

export const updateCity = async (id, data) => {
  return await api.put(`/areaManagment/updateCity/${id}`, data);
};

export const deleteCity = async (id) => {
  return await api.delete(`/areaManagment/deleteCity/${id}`);
};

// Area APIs
export const addArea = async (data) => {
  // Notice uppercase 'A' in AreaManagment based on user instructions
  return await api.post("/AreaManagment/addArea", data);
};

export const getAllAreas = async () => {
  return await api.get("/AreaManagment/getAllAreas");
};

export const updateArea = async (id, data) => {
  return await api.put(`/AreaManagment/updateArea/${id}`, data);
};

export const deleteArea = async (id) => {
  return await api.delete(`/AreaManagment/deleteArea/${id}`);
};
