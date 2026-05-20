import api from "./api";

const USER_KEY = "thermal_nlc_user";
const EXPIRY_KEY = "thermal_nlc_session_expiry";
const STAY_KEY = "thermal_nlc_stay_signed_in";

const SESSION_MS = 30 * 60 * 1000;
const STAY_MS = 7 * 24 * 60 * 60 * 1000;

export const authService = {
    login: (username, password) => api.post("/auth/login", { username, password }),

    getProfile: (userId) => api.get(`/auth/profile/${userId}`),

    changePassword: (payload) => api.put("/auth/change-password", payload),

    saveSession: (user, staySignedIn = false) => {
        const storage = staySignedIn ? localStorage : sessionStorage;
        const expiry = Date.now() + (staySignedIn ? STAY_MS : SESSION_MS);
        storage.setItem(USER_KEY, JSON.stringify(user));
        storage.setItem(EXPIRY_KEY, String(expiry));
        storage.setItem(STAY_KEY, staySignedIn ? "1" : "0");
        authService.clearOtherStorage(staySignedIn);
    },

    clearOtherStorage: (usingLocal) => {
        const other = usingLocal ? sessionStorage : localStorage;
        other.removeItem(USER_KEY);
        other.removeItem(EXPIRY_KEY);
        other.removeItem(STAY_KEY);
    },

    getSession: () => {
        const fromLocal = authService._readStorage(localStorage);
        if (fromLocal) return fromLocal;
        return authService._readStorage(sessionStorage);
    },

    _readStorage: (storage) => {
        try {
            const raw = storage.getItem(USER_KEY);
            const expiry = storage.getItem(EXPIRY_KEY);
            if (!raw || !expiry) return null;
            if (Date.now() > Number(expiry)) {
                storage.removeItem(USER_KEY);
                storage.removeItem(EXPIRY_KEY);
                storage.removeItem(STAY_KEY);
                return null;
            }
            return JSON.parse(raw);
        } catch {
            return null;
        }
    },

    touchSession: () => {
        const stay = localStorage.getItem(STAY_KEY) === "1";
        const storage = stay ? localStorage : sessionStorage;
        const raw = storage.getItem(USER_KEY);
        if (!raw) return;
        const expiry = Date.now() + (stay ? STAY_MS : SESSION_MS);
        storage.setItem(EXPIRY_KEY, String(expiry));
    },

    isStaySignedIn: () =>
        localStorage.getItem(STAY_KEY) === "1" || sessionStorage.getItem(STAY_KEY) === "1",

    clearSession: () => {
        [localStorage, sessionStorage].forEach((s) => {
            s.removeItem(USER_KEY);
            s.removeItem(EXPIRY_KEY);
            s.removeItem(STAY_KEY);
        });
    },
};
