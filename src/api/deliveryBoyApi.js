import api from "./api";

const ADD_DELIVERY_BOY_URL =
  "https://daycatch-backend-3.onrender.com/api/deliveryBoy/addDeliveryBoy";
const GET_ALL_DELIVERY_BOYS_URL =
  "https://daycatch-backend-3.onrender.com/api/deliveryBoy/getAllDeliveryBoy";

// Delivery Boy API calls
export const addDeliveryBoy = async (payload) => {
  return await api.post(ADD_DELIVERY_BOY_URL, payload, {
    headers: { "Content-Type": "application/json" },
  });
};

export const getAllDeliveryBoys = async () => {
  return await api.get(GET_ALL_DELIVERY_BOYS_URL);
};

export const updateDeliveryBoy = async (id, payload) => {
  return await api.put(`/deliveryBoy/updateDeliveryBoy/${id}`, payload, {
    headers: { "Content-Type": "application/json" },
  });
};

export const deleteDeliveryBoy = async (id) => {
  return await api.delete(`/deliveryBoy/deleteDeliveryBoy/${id}`);
};
