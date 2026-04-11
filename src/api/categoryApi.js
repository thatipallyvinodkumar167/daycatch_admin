import api from "./api";

// Parent Categories
export const getParentCategories = async (params = {}) => {
  return await api.get("/collections/categories", { params });
};

export const addParentCategory = async (data) => {
  return await api.post("/collections/categories", data);
};

export const updateParentCategory = async (id, data) => {
  return await api.put(`/collections/categories/${id}`, data);
};

export const deleteParentCategory = async (id) => {
  return await api.delete(`/collections/categories/${id}`);
};

// Sub Categories
export const getSubCategories = async (params = {}) => {
  return await api.get("/collections/subcategories", { params });
};

export const addSubCategory = async (data) => {
  return await api.post("/collections/subcategories", data);
};

export const updateSubCategory = async (id, data) => {
  return await api.put(`/collections/subcategories/${id}`, data);
};

export const deleteSubCategory = async (id) => {
  return await api.delete(`/collections/subcategories/${id}`);
};
