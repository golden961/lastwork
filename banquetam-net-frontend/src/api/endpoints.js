const prefixRaw = import.meta.env.VITE_API_PREFIX || "";
const prefix = prefixRaw ? prefixRaw.replace(/\/$/, "") : ""; // убираем trailing /

export const EP = {
    register: `${prefix}/auth/register`,
    login: `${prefix}/auth/login`,
    me: `${prefix}/me`, // опционально, если у тебя есть

    rooms: `${prefix}/rooms`,
    myBookings: `${prefix}/bookings/my`,
    createBooking: `${prefix}/bookings`,
    createReview: `${prefix}/reviews`,

    adminLogin: `${prefix}/admin/login`,
    adminBookings: `${prefix}/admin/bookings`,
    adminSetStatus: (id) => `${prefix}/admin/bookings/${id}/status`,
};