import api from "./api";

// Delivery Boy API calls
export const addDeliveryBoy = async (payload) => {
  return await api.post("/deliveryBoy/addDeliveryBoy", payload, {
    headers: { "Content-Type": "application/json" },
  });
};

export const getAllDeliveryBoys = async () => {
  return await api.get("/deliveryBoy/getAllDeliveryBoy");
};

export const updateDeliveryBoy = async (id, payload) => {
  return await api.put(`/deliveryBoy/updateDeliveryBoy/${id}`, payload, {
    headers: { "Content-Type": "application/json" },
  });
};

export const deleteDeliveryBoy = async (id) => {
  return await api.delete(`/deliveryBoy/deleteDeliveryBoy/${id}`);
};
