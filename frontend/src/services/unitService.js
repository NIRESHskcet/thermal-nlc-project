import api from "./api";

const BASE = "/unit";

export const unitService = {
    getAll: () => api.get(BASE),
    getById: (id) => api.get(`${BASE}/${id}`),
    getByStationId: (stationId) => api.get(`${BASE}/stationId/${stationId}`),
    search: (keyword) => api.get(`${BASE}/search`, { params: { keyword } }),
    create: (payload) => api.post(BASE, payload),
    update: (id, payload) => api.put(`${BASE}/${id}`, payload),
    remove: (id) => api.delete(`${BASE}/${id}`),
};
