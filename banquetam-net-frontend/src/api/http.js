import axios from "axios";

const baseURL = (import.meta.env.VITE_API_URL || "http://localhost:3001").replace(/\/$/, "");
const withCredentials = (import.meta.env.VITE_API_WITH_CREDENTIALS || "false") === "true";

export const http = axios.create({
    baseURL,
    timeout: 15000,
    withCredentials,
});

http.interceptors.request.use((config) => {
    const userToken = localStorage.getItem("userToken");
    const adminToken = localStorage.getItem("adminToken");

    // если админ маршруты начинаются с /admin — подставим admin token
    const isAdminReq = typeof config.url === "string" && config.url.startsWith("/admin");

    if (isAdminReq && adminToken) {
        config.headers.Authorization = `Bearer ${adminToken}`;
    } else if (!isAdminReq && userToken) {
        config.headers.Authorization = `Bearer ${userToken}`;
    }

    return config;
});