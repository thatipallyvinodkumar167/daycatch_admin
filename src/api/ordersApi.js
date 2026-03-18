import axios from "axios";

const ORDERS_API_URL =
  process.env.REACT_APP_ORDERS_API_URL || "/api/orders-proxy";

export const getAllOrders = async () => {
  return await axios.get(ORDERS_API_URL);
};
