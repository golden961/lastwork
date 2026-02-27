import toast from "react-hot-toast";
import { USE_MOCK, http } from "./http";
import { mockApi } from "./mock";

function msg(e) {
    return e?.response?.data?.message || e?.message || "Ошибка";
}

export const api = {
    rooms() {
        if (USE_MOCK) return mockApi.rooms();
        return http.get("/rooms").then((r) => r.data);
    },

    register(dto) {
        if (USE_MOCK) return mockApi.register(dto).catch((e) => (toast.error(e.message), Promise.reject(e)));
        return http.post("/auth/register", dto).then((r) => r.data).catch((e) => (toast.error(msg(e)), Promise.reject(e)));
    },

    login(dto) {
        if (USE_MOCK) return mockApi.login(dto).catch((e) => (toast.error(e.message), Promise.reject(e)));
        return http.post("/auth/login", dto).then((r) => r.data).catch((e) => (toast.error(msg(e)), Promise.reject(e)));
    },

    myBookings(userId) {
        if (USE_MOCK) return mockApi.myBookings(userId);
        return http.get("/bookings/my").then((r) => r.data);
    },

    createBooking(userId, dto) {
        if (USE_MOCK) return mockApi.createBooking(userId, dto).catch((e) => (toast.error(e.message), Promise.reject(e)));
        return http.post("/bookings", dto).then((r) => r.data).catch((e) => (toast.error(msg(e)), Promise.reject(e)));
    },

    createReview(userId, dto) {
        if (USE_MOCK) return mockApi.createReview(userId, dto).catch((e) => (toast.error(e.message), Promise.reject(e)));
        return http.post("/reviews", dto).then((r) => r.data).catch((e) => (toast.error(msg(e)), Promise.reject(e)));
    },

    adminLogin(dto) {
        if (USE_MOCK) return mockApi.adminLogin(dto).catch((e) => (toast.error(e.message), Promise.reject(e)));
        return http.post("/admin/login", dto).then((r) => r.data).catch((e) => (toast.error(msg(e)), Promise.reject(e)));
    },

    adminList(params) {
        if (USE_MOCK) return mockApi.adminList(params);
        return http.get("/admin/bookings", { params }).then((r) => r.data);
    },

    adminSetStatus(dto) {
        if (USE_MOCK) return mockApi.adminSetStatus(dto).catch((e) => (toast.error(e.message), Promise.reject(e)));
        return http.patch(`/admin/bookings/${dto.bookingId}/status`, { status: dto.status }).then((r) => r.data)
            .catch((e) => (toast.error(msg(e)), Promise.reject(e)));
    },
};