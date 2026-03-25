import api from "./api";

export const subAdminApi = {
  getAll: async () => api.get("/sub-admins"),
  getOne: async (id) => api.get(`/sub-admins/${id}`),
  create: async (payload) => api.post("/sub-admins", payload),
  update: async (id, payload) => api.patch(`/sub-admins/${id}`, payload),
  remove: async (id) => api.delete(`/sub-admins/${id}`),
};
