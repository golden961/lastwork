import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
export const USE_MOCK = (import.meta.env.VITE_USE_MOCK || "true") === "true";

export const http = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
});

http.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    const adminToken = localStorage.getItem("adminToken");
    // обычные запросы
    if (token) config.headers.Authorization = `Bearer ${token}`;
    // админ запросы (если используешь отдельный токен)
    if (adminToken && config.url?.startsWith("/admin")) {
        config.headers.Authorization = `Bearer ${adminToken}`;
    }
    return config;
});