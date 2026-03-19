import api from "./api";

export const getAllOrders = async (params = {}) => {
  return await api.get("/orders", { params });
};

export const getOrder = async (id) => {
    return await api.get(`/orders/${id}`);
};

export const createOrder = async (data) => {
    return await api.post("/orders", data);
};

export const updateOrder = async (id, data) => {
    return await api.patch(`/orders/${id}`, data);
};

export const deleteOrder = async (id) => {
    return await api.delete(`/orders/${id}`);
};
