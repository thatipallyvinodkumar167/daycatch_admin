import api from "./api";

export const storeWorkspaceApi = {
  getDashboard: async (storeId) =>
    api.get(`/stores/${encodeURIComponent(storeId)}/workspace/dashboard`),

  getSettings: async (storeId) =>
    api.get(`/stores/${encodeURIComponent(storeId)}/workspace/settings`),

  updateSettings: async (storeId, payload) =>
    api.patch(`/stores/${encodeURIComponent(storeId)}/workspace/settings`, payload),

  getCatalogProducts: async (storeId) =>
    api.get(`/stores/${encodeURIComponent(storeId)}/workspace/catalog/products`),

  updateCatalogPricing: async (storeId, productId, payload) =>
    api.patch(
      `/stores/${encodeURIComponent(storeId)}/workspace/catalog/products/${encodeURIComponent(productId)}/pricing`,
      payload
    ),

  updateCatalogStock: async (storeId, productId, payload) =>
    api.patch(
      `/stores/${encodeURIComponent(storeId)}/workspace/catalog/products/${encodeURIComponent(productId)}/stock`,
      payload
    ),

  updateCatalogOrderQuantity: async (storeId, productId, payload) =>
    api.patch(
      `/stores/${encodeURIComponent(storeId)}/workspace/catalog/products/${encodeURIComponent(productId)}/order-quantity`,
      payload
    ),

  getDeals: async (storeId) =>
    api.get(`/stores/${encodeURIComponent(storeId)}/workspace/catalog/deals`),

  createDeal: async (storeId, payload) =>
    api.post(`/stores/${encodeURIComponent(storeId)}/workspace/catalog/deals`, payload),

  deleteDeal: async (storeId, productId) =>
    api.delete(
      `/stores/${encodeURIComponent(storeId)}/workspace/catalog/deals/${encodeURIComponent(productId)}`
    ),

  getSpotlight: async (storeId) =>
    api.get(`/stores/${encodeURIComponent(storeId)}/workspace/catalog/spotlight`),

  updateSpotlight: async (storeId, payload) =>
    api.put(`/stores/${encodeURIComponent(storeId)}/workspace/catalog/spotlight`, payload),
};
