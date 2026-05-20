import api from "./api";

const BASE = "/users";

export const usersService = {
    getAll: () => api.get(BASE),
    getById: (id) => api.get(`${BASE}/${id}`),
    search: (keyword) => api.get(`${BASE}/search`, { params: { keyword } }),
    getByRole: (role) => api.get(`${BASE}/role/${role}`),
    getByEmployeeId: (employeeId) => api.get(`${BASE}/employeeId/${employeeId}`),
    create: (payload) => api.post(BASE, payload),
    update: (id, payload) => api.put(`${BASE}/${id}`, payload),
    remove: (id) => api.delete(`${BASE}/${id}`),
};
