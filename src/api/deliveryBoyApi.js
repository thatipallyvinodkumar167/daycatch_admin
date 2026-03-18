import api from "./api";

const DELIVERY_BOY_API_BASE_URL =
  "https://daycatch-backend-3.onrender.com/api/deliveryBoy";
const JSON_HEADERS = { "Content-Type": "application/json" };

// Delivery Boy API calls
export const addDeliveryBoy = async (payload) => {
  return await api.post(`${DELIVERY_BOY_API_BASE_URL}/addDeliveryBoy`, payload, {
    headers: JSON_HEADERS,
  });
};

export const getAllDeliveryBoys = async () => {
  return await api.get(`${DELIVERY_BOY_API_BASE_URL}/getAllDeliveryBoy`);
};

export const updateDeliveryBoy = async (payload) => {
  const deliveryBoyId = payload?._id || payload?.id;

  try {
    return await api.put(
      `${DELIVERY_BOY_API_BASE_URL}/updateDeliveryBoy/${deliveryBoyId}`,
      payload,
      {
        headers: JSON_HEADERS,
      }
    );
  } catch (error) {
    if (error?.response?.status !== 404) {
      throw error;
    }

    return await api.put(`${DELIVERY_BOY_API_BASE_URL}/updateDeliveryBoy`, payload, {
      headers: JSON_HEADERS,
    });
  }
};

export const deleteDeliveryBoy = async (id) => {
  try {
    return await api.delete(`${DELIVERY_BOY_API_BASE_URL}/deleteDeliveryBoy/${id}`, {
      headers: JSON_HEADERS,
    });
  } catch (error) {
    if (error?.response?.status !== 404) {
      throw error;
    }

    return await api.delete(`${DELIVERY_BOY_API_BASE_URL}/deleteDeliveryBoy`, {
      data: { _id: id, id },
      headers: JSON_HEADERS,
    });
  }
};
