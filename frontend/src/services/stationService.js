import api from "./api";

const BASE = "/station";

export const stationService = {
    getAll: () => api.get(BASE),
    getById: (id) => api.get(`${BASE}/${id}`),
    search: (keyword) => api.get(`${BASE}/search`, { params: { keyword } }),
    create: (payload) => api.post(BASE, payload),
    update: (id, payload) => api.put(`${BASE}/${id}`, payload),
    remove: (id) => api.delete(`${BASE}/${id}`),
};
