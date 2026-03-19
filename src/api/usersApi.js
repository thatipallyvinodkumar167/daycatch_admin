import api from "./api";

export const getAllUsers = async (params = {}) => {
  return await api.get("/users", { params });
};

export const getUser = async (id) => {
    return await api.get(`/users/${id}`);
};

export const createUser = async (data) => {
    return await api.post("/users", data);
};

export const updateUser = async (id, data) => {
    return await api.patch(`/users/${id}`, data);
};

export const deleteUser = async (id) => {
    return await api.delete(`/users/${id}`);
};
