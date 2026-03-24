/*  */import { genericApi } from "../api/genericApi";

export const extractApiResults = (response) =>
  response.data?.results || response.data?.data || response.data || [];

const normalizeString = (value) => String(value || "").trim().toLowerCase();

const normalizeProduct = (product = {}) => {
  const qty = Number(product.qty ?? product.quantity ?? 1);
  const price = Number(product.price ?? 0);

  return {
    ...product,
    product_name: product.product_name || product.name || product.title || "Product",
    qty,
    tax: product.tax || "0 %",
    price,
    total: Number(product.total ?? qty * price),
    image: product.image || product.img || product.product_image || "",
  };
};

const getFallbackDeliveryDate = (order) => {
  const rawDate = order?.deliveryDateRaw || order?.deliveryDate;

  if (rawDate && !Number.isNaN(Date.parse(rawDate))) {
    return new Date(rawDate).toISOString();
  }

  return new Date().toISOString();
};

export const buildOrderPayload = (order, overrides = {}) => {
  const rawOrder = { ...(order?.raw || order || {}) };
  delete rawOrder._id;

  const productsSource =
    rawOrder.Products ||
    rawOrder.products ||
    rawOrder["cart product"] ||
    rawOrder["Cart Products"] ||
    order?.products_expanded ||
    order?.products ||
    [];

  const normalizedProducts = productsSource.map(normalizeProduct);

  const payload = {
    ...rawOrder,
    "Cart ID": rawOrder["Cart ID"] || rawOrder.cartId || order?.cartId || "N/A",
    "Cart price": Number(rawOrder["Cart price"] ?? rawOrder.cartPrice ?? order?.cartPrice ?? 0),
    User: rawOrder.User || rawOrder.user || order?.userName || "N/A",
    "User Phone":
      rawOrder["User Phone"] ||
      rawOrder.phone ||
      rawOrder.Details?.phone ||
      order?.userPhone ||
      "N/A",
    "Delivery Date":
      rawOrder["Delivery Date"] || rawOrder.deliveryDate || getFallbackDeliveryDate(order),
    "Time Slot": rawOrder["Time Slot"] || rawOrder.timeSlot || order?.timeSlot || "N/A",
    Address:
      rawOrder.Address ||
      rawOrder.address ||
      rawOrder.Details?.address ||
      order?.address ||
      "N/A",
    "Store Name":
      rawOrder["Store Name"] ||
      rawOrder.storeName ||
      rawOrder.Store ||
      order?.store ||
      "N/A",
    "Boy Name":
      rawOrder["Boy Name"] ||
      rawOrder["Delivery Boy"] ||
      rawOrder.Assign ||
      order?.deliveryBoy ||
      "N/A",
    Assign:
      rawOrder.Assign ||
      rawOrder["Boy Name"] ||
      rawOrder["Delivery Boy"] ||
      order?.deliveryBoy ||
      "N/A",
    Details: rawOrder.Details || {
      phone: order?.userPhone || "N/A",
      address: order?.address || "N/A",
    },
    Products: normalizedProducts,
    status: rawOrder.status || rawOrder.Status || "Pending",
    Status: rawOrder.Status || rawOrder.status || "Pending",
  };

  const finalPayload = {
    ...payload,
    ...overrides,
  };

  delete finalPayload._id;

  return finalPayload;
};

const findOrderByCartId = async (collection, cartId) => {
  if (!cartId) {
    return null;
  }

  const response = await genericApi.getAll(collection, { limit: 500 });
  const orders = extractApiResults(response);

  return (
    orders.find(
      (item) =>
        normalizeString(item["Cart ID"] || item.cartId) === normalizeString(cartId)
    ) || null
  );
};

export const upsertOrderByCartId = async (collection, payload) => {
  const cartId = payload["Cart ID"] || payload.cartId;
  const existingOrder = await findOrderByCartId(collection, cartId);

  if (existingOrder?._id) {
    await genericApi.update(collection, existingOrder._id, payload);
    return existingOrder._id;
  }

  const createdOrder = await genericApi.create(collection, payload);
  return createdOrder.data?._id || createdOrder._id || null;
};

export const syncOrderHistory = async (payload) => {
  await upsertOrderByCartId("orders", payload);
};

export const moveOrderBetweenCollections = async ({
  sourceCollection,
  targetCollection,
  order,
  payload,
  syncHistory = true,
}) => {
  await upsertOrderByCartId(targetCollection, payload);

  if (syncHistory) {
    await syncOrderHistory(payload);
  }

  if (sourceCollection && order?.id) {
    await genericApi.remove(sourceCollection, order.id);
  }
};
