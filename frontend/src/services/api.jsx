import axios from "axios";
import { authService } from "./authService";

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080",
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach JWT token to every outgoing request
api.interceptors.request.use((config) => {
    const session = authService.getSession();
    if (session?.token) {
        config.headers.Authorization = `Bearer ${session.token}`;
    }
    return config;
});

export default api;