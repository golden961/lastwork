const LS_USERS = "bn_users";
const LS_BOOKINGS = "bn_bookings";
const LS_REVIEWS = "bn_reviews";

const ROOMS = [
    { id: "hall", label: "Зал", img: "/assets/66155ef0748e9.jpg" },
    { id: "restaurant", label: "Ресторан", img: "/assets/unnamed%20(2).webp" },
    { id: "summer", label: "Летняя веранда", img: "/assets/1671649122_idei-club-p-veranda-.jpg" },
    { id: "closed", label: "Закрытая веранда", img: "/assets/3505f015e0d26644e8e4c.jpg" },
];

function read(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key) || ""); } catch { return fallback; }
}
function write(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

function seed() {
    if (!read(LS_USERS, null)) write(LS_USERS, []);
    if (!read(LS_BOOKINGS, null)) write(LS_BOOKINGS, []);
    if (!read(LS_REVIEWS, null)) write(LS_REVIEWS, []);
}
function token(payload) { return btoa(JSON.stringify(payload)); }

export const mockApi = {
    rooms() {
        seed();
        return Promise.resolve({ rooms: ROOMS });
    },

    register(dto) {
        seed();
        const users = read(LS_USERS, []);
        const exists = users.some((u) => u.login.toLowerCase() === dto.login.toLowerCase());
        if (exists) return Promise.reject({ message: "Логин уже занят" });
        users.push({ id: crypto.randomUUID(), ...dto });
        write(LS_USERS, users);
        return Promise.resolve({ ok: true });
    },

    login({ login, password }) {
        seed();
        const users = read(LS_USERS, []);
        const u = users.find((x) => x.login === login && x.password === password);
        if (!u) return Promise.reject({ message: "Неверный логин или пароль" });
        return Promise.resolve({
            token: token({ userId: u.id }),
            user: { id: u.id, login: u.login, fullName: u.fullName, phone: u.phone, email: u.email },
        });
    },

    myBookings(userId) {
        seed();
        const all = read(LS_BOOKINGS, []);
        return Promise.resolve({ bookings: all.filter((b) => b.userId === userId), rooms: ROOMS });
    },

    createBooking(userId, dto) {
        seed();
        const all = read(LS_BOOKINGS, []);
        const booking = {
            id: crypto.randomUUID(),
            userId,
            roomId: dto.roomId,
            date: dto.date,
            paymentMethod: dto.paymentMethod,
            status: "Новая",
            createdAt: new Date().toISOString(),
        };
        all.unshift(booking);
        write(LS_BOOKINGS, all);
        return Promise.resolve({ booking });
    },

    createReview(userId, dto) {
        seed();
        const all = read(LS_BOOKINGS, []);
        const reviews = read(LS_REVIEWS, []);
        const b = all.find((x) => x.id === dto.bookingId && x.userId === userId);
        if (!b) return Promise.reject({ message: "Заявка не найдена" });

        // СТРОГО по доп. ТЗ: отзыв доступен после изменения статуса админом (то есть НЕ "Новая")
        if (b.status === "Новая") return Promise.reject({ message: "Отзыв доступен после подтверждения администратором" });

        if (reviews.some((r) => r.bookingId === dto.bookingId)) {
            return Promise.reject({ message: "Отзыв по этой заявке уже оставлен" });
        }

        reviews.unshift({ id: crypto.randomUUID(), userId, bookingId: dto.bookingId, text: dto.text, createdAt: new Date().toISOString() });
        write(LS_REVIEWS, reviews);
        return Promise.resolve({ ok: true });
    },

    adminLogin({ login, password }) {
        if (login === "Admin26" && password === "Demo20") return Promise.resolve({ adminToken: token({ admin: true }) });
        return Promise.reject({ message: "Неверные данные администратора" });
    },

    adminList({ status = "all", sort = "desc", page = 1, pageSize = 6 }) {
        seed();
        let all = read(LS_BOOKINGS, []);
        if (status !== "all") all = all.filter((b) => b.status === status);
        all.sort((a, b) => (sort === "asc" ? +new Date(a.createdAt) - +new Date(b.createdAt) : +new Date(b.createdAt) - +new Date(a.createdAt)));
        const total = all.length;
        const start = (page - 1) * pageSize;
        return Promise.resolve({ items: all.slice(start, start + pageSize), total, rooms: ROOMS });
    },

    adminSetStatus({ bookingId, status }) {
        seed();
        const all = read(LS_BOOKINGS, []);
        const idx = all.findIndex((b) => b.id === bookingId);
        if (idx === -1) return Promise.reject({ message: "Заявка не найдена" });
        all[idx].status = status;
        write(LS_BOOKINGS, all);
        return Promise.resolve({ ok: true });
    },
};