import api from "./api";

// Delivery Boy API calls
export const addDeliveryBoy = async (formData) => {
  return await api.post("/deliveryBoy/addDeliveryBoy", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getAllDeliveryBoys = async () => {
  return await api.get("/deliveryBoy/getAllDeliveryBoy");
};

export const updateDeliveryBoy = async (id, formData) => {
  return await api.put(`/deliveryBoy/updateDeliveryBoy/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteDeliveryBoy = async (id) => {
  return await api.delete(`/deliveryBoy/deleteDeliveryBoy/${id}`);
};
