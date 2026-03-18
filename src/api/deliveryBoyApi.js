import api from "./api";

const DELIVERY_BOY_API_BASE_URL =
  "https://daycatch-backend-3.onrender.com/api/deliveryBoy";
const JSON_HEADERS = { "Content-Type": "application/json" };

const getDeliveryBoyId = (payload) => payload?._id || payload?.id;

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
  const deliveryBoyId = getDeliveryBoyId(payload);
  const { _id, id, ...routePayload } = payload || {};

  if (!deliveryBoyId) {
    throw new Error("Delivery boy id is required for update.");
  }

  return await api.put(
    `${DELIVERY_BOY_API_BASE_URL}/updateDeliveryBoy/${deliveryBoyId}`,
    routePayload,
    {
      headers: JSON_HEADERS,
    }
  );
};

export const deleteDeliveryBoy = async (id) => {
  if (!id) {
    throw new Error("Delivery boy id is required for delete.");
  }

  return await api.delete(
    `${DELIVERY_BOY_API_BASE_URL}/deleteDeliveryBoy/${id}`,
    {
      headers: JSON_HEADERS,
    }
  );
};
