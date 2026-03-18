import axios from "axios";

const ORDERS_API_URL = "https://backend-daycatch.onrender.com/api/orders";

export const getAllOrders = async () => {
  return await axios.get(ORDERS_API_URL);
};
