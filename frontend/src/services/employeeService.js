import api from "./api";

const BASE = "/employees";

export const employeeService = {
    getAll: () => api.get(BASE),
    getById: (id) => api.get(`${BASE}/${id}`),
    search: (keyword) => api.get(`${BASE}/search`, { params: { keyword } }),
    getByStationId: (stationId) => api.get(`${BASE}/stationId/${stationId}`),
    getByUnitId: (unitId) => api.get(`${BASE}/unitId/${unitId}`),
    create: (payload) => api.post(BASE, payload),
    update: (id, payload) => api.put(`${BASE}/${id}`, payload),
    remove: (id) => api.delete(`${BASE}/${id}`),
};
