import api from "./api";

const DELIVERY_BOY_API_BASE_URL =
  "https://daycatch-backend-3.onrender.com/api/deliveryBoy";

// Delivery Boy API calls
export const addDeliveryBoy = async (payload) => {
  return await api.post(`${DELIVERY_BOY_API_BASE_URL}/addDeliveryBoy`, payload, {
    headers: { "Content-Type": "application/json" },
  });
};

export const getAllDeliveryBoys = async () => {
  return await api.get(`${DELIVERY_BOY_API_BASE_URL}/getAllDeliveryBoy`);
};

export const updateDeliveryBoy = async (id, payload) => {
  return await api.put(`${DELIVERY_BOY_API_BASE_URL}/updateDeliveryBoy/${id}`, payload, {
    headers: { "Content-Type": "application/json" },
  });
};

export const deleteDeliveryBoy = async (id) => {
  return await api.delete(`${DELIVERY_BOY_API_BASE_URL}/deleteDeliveryBoy/${id}`);
};
