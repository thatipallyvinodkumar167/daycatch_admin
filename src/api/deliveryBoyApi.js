import api from "./api";

// Delivery Boy APIs
export const addDeliveryBoy = async (payload) => {
  return await api.post("/delivery-boys", payload);
};

export const getAllDeliveryBoys = async (params = {}) => {
  return await api.get("/delivery-boys", { params });
};

export const updateDeliveryBoy = async (id, data) => {
  return await api.patch(`/delivery-boys/${id}`, data);
};

export const deleteDeliveryBoy = async (id) => {
  return await api.delete(`/delivery-boys/${id}`);
};
