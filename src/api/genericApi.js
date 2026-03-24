import api from "./api";

// Universal API wrapper to interact dynamically with backend collection routes
// Endpoint: /api/v1/collections/:collection

export const genericApi = {
  // Fetch a list of documents for a given collection
  getAll: async (collection, params = {}) => {
    return await api.get(`/collections/${collection}`, { params });
  },

  // Fetch a single document by ID
  getOne: async (collection, id) => {
    return await api.get(`/collections/${collection}/${id}`);
  },

  // Create a new document in the collection
  create: async (collection, data) => {
    return await api.post(`/collections/${collection}`, data);
  },

  // Create multiple documents in the collection
  bulkCreate: async (collection, data) => {
    return await api.post(`/collections/${collection}/bulk`, data);
  },

  // Update an existing document
  update: async (collection, id, data) => {
    return await api.put(`/collections/${collection}/${id}`, data);
  },

  // Delete a document
  remove: async (collection, id) => {
    return await api.delete(`/collections/${collection}/${id}`);
  }
};
