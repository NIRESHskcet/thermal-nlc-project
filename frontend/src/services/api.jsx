import axios from "axios";

// Central Axios instance — all module services import from here.
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080",
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;
