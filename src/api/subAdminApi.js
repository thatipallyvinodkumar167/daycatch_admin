import api from "./api";

export const subAdminApi = {
  getAll: async () => api.get("/sub-admins"),
  getOne: async (id) => api.get(`/sub-admins/${id}`),
  create: async (payload) => api.post("/sub-admins", payload),
  update: async (id, payload) => api.patch(`/sub-admins/${id}`, payload),
  getCities: async (id) => api.get(`/sub-admins/${id}/cities`),
  updateCities: async (id, payload) => api.put(`/sub-admins/${id}/cities`, payload),
  getMyAccess: async () => api.get("/sub-admins/me/access"),
  getMyCities: async () => api.get("/sub-admins/me/cities"),
  remove: async (id) => api.delete(`/sub-admins/${id}`),
};
