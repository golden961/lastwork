import toast from "react-hot-toast";
import { USE_MOCK, http } from "./client";
import { mockApi } from "./mock";

function errMsg(e) {
    return e?.response?.data?.message || e?.message || "Ошибка";
}

export const api = {
    async rooms() {
        if (USE_MOCK) return mockApi.rooms();
        const { data } = await http.get("/rooms");
        return data;
    },

    async register(payload) {
        try {
            if (USE_MOCK) return await mockApi.register(payload);
            const { data } = await http.post("/auth/register", payload);
            return data;
        } catch (e) {
            toast.error(errMsg(e));
            throw e;
        }
    },

    async login(payload) {
        try {
            if (USE_MOCK) return await mockApi.login(payload);
            const { data } = await http.post("/auth/login", payload);
            return data;
        } catch (e) {
            toast.error(errMsg(e));
            throw e;
        }
    },

    async myBookings(userId) {
        if (USE_MOCK) return mockApi.myBookings(userId);
        const { data } = await http.get("/bookings/my");
        return data;
    },

    async createBooking(userId, payload) {
        try {
            if (USE_MOCK) return await mockApi.createBooking(userId, payload);
            const { data } = await http.post("/bookings", payload);
            return data;
        } catch (e) {
            toast.error(errMsg(e));
            throw e;
        }
    },

    async createReview(userId, payload) {
        try {
            if (USE_MOCK) return await mockApi.createReview(userId, payload);
            const { data } = await http.post("/reviews", payload);
            return data;
        } catch (e) {
            toast.error(errMsg(e));
            throw e;
        }
    },

    async adminLogin(payload) {
        try {
            if (USE_MOCK) return await mockApi.adminLogin(payload);
            const { data } = await http.post("/admin/login", payload);
            return data;
        } catch (e) {
            toast.error(errMsg(e));
            throw e;
        }
    },

    async adminList(payload) {
        if (USE_MOCK) return mockApi.adminList(payload);
        const { data } = await http.get("/admin/bookings", { params: payload });
        return data;
    },

    async adminSetStatus(payload) {
        try {
            if (USE_MOCK) return await mockApi.adminSetStatus(payload);
            const { data } = await http.patch(`/admin/bookings/${payload.bookingId}/status`, {
                status: payload.status,
            });
            return data;
        } catch (e) {
            toast.error(errMsg(e));
            throw e;
        }
    },
};