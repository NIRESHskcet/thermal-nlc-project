import api from "./api";

const BASE = "/employeeShift";

export const employeeShiftService = {
    getAll: () => api.get(BASE),
    getById: (id) => api.get(`${BASE}/${id}`),
    search: (keyword) => api.get(`${BASE}/search`, { params: { keyword } }),
    getByEmployeeId: (employeeId) => api.get(`${BASE}/employeeId/${employeeId}`),
    getByShiftId: (shiftId) => api.get(`${BASE}/shiftId/${shiftId}`),
    create: (payload) => api.post(BASE, payload),
    update: (id, payload) => api.put(`${BASE}/${id}`, payload),
    remove: (id) => api.delete(`${BASE}/${id}`),
};
