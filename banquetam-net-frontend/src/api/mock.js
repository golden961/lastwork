const LS_USERS = "mock_users";
const LS_BOOKINGS = "mock_bookings";
const LS_REVIEWS = "mock_reviews";

const STATUSES = ["Новая", "Банкет назначен", "Банкет завершен"];

const ROOMS = [
    { id: "hall", label: "Зал", image: "/assets/66155ef0748e9.jpg" },
    { id: "restaurant", label: "Ресторан", image: "/assets/unnamed%20(2).webp" },
    { id: "summer", label: "Летняя веранда", image: "/assets/1671649122_idei-club-p-veranda-.jpg" },
    { id: "closed", label: "Закрытая веранда", image: "/assets/3505f015e0d26644e8e4c.jpg" },
];

function read(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch {
        return fallback;
    }
}
function write(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
}

function ensureSeed() {
    const users = read(LS_USERS, null);
    const bookings = read(LS_BOOKINGS, null);
    const reviews = read(LS_REVIEWS, null);
    if (!users) write(LS_USERS, []);
    if (!bookings) write(LS_BOOKINGS, []);
    if (!reviews) write(LS_REVIEWS, []);
}

function makeToken(payload) {
    return btoa(JSON.stringify(payload));
}

export const mockApi = {
    rooms() {
        ensureSeed();
        return Promise.resolve({ rooms: ROOMS });
    },

    register(data) {
        ensureSeed();
        const users = read(LS_USERS, []);
        const exists = users.some((u) => u.login.toLowerCase() === data.login.toLowerCase());
        if (exists) {
            return Promise.reject({ message: "Логин уже занят" });
        }
        const user = { id: crypto.randomUUID(), ...data, password: data.password };
        users.push(user);
        write(LS_USERS, users);
        return Promise.resolve({ ok: true });
    },

    login({ login, password }) {
        ensureSeed();
        const users = read(LS_USERS, []);
        const user = users.find((u) => u.login === login);
        if (!user || user.password !== password) {
            return Promise.reject({ message: "Неверный логин или пароль" });
        }
        const token = makeToken({ userId: user.id });
        return Promise.resolve({
            token,
            user: { id: user.id, login: user.login, fullName: user.fullName, phone: user.phone, email: user.email },
        });
    },

    myBookings(userId) {
        ensureSeed();
        const bookings = read(LS_BOOKINGS, []);
        const mine = bookings.filter((b) => b.userId === userId);
        return Promise.resolve({ bookings: mine, rooms: ROOMS });
    },

    createBooking(userId, data) {
        ensureSeed();
        const bookings = read(LS_BOOKINGS, []);
        const booking = {
            id: crypto.randomUUID(),
            userId,
            roomId: data.roomId,
            date: data.date, // ДД.ММ.ГГГГ
            paymentMethod: data.paymentMethod,
            status: "Новая",
            createdAt: new Date().toISOString(),
        };
        bookings.unshift(booking);
        write(LS_BOOKINGS, bookings);
        return Promise.resolve({ booking });
    },

    createReview(userId, data) {
        ensureSeed();
        const bookings = read(LS_BOOKINGS, []);
        const booking = bookings.find((b) => b.id === data.bookingId && b.userId === userId);
        if (!booking) return Promise.reject({ message: "Заявка не найдена" });

        // правило — пока строго после "Банкет завершен"
        if (booking.status !== "Банкет завершен") {
            return Promise.reject({ message: "Отзыв можно оставить только после завершения банкета" });
        }

        const reviews = read(LS_REVIEWS, []);
        const exists = reviews.some((r) => r.bookingId === data.bookingId);
        if (exists) return Promise.reject({ message: "Отзыв по этой заявке уже оставлен" });

        reviews.unshift({
            id: crypto.randomUUID(),
            userId,
            bookingId: data.bookingId,
            text: data.text,
            createdAt: new Date().toISOString(),
        });
        write(LS_REVIEWS, reviews);
        return Promise.resolve({ ok: true });
    },

    adminLogin({ login, password }) {
        if (login === "Admin26" && password === "Demo20") {
            const adminToken = makeToken({ admin: true });
            return Promise.resolve({ adminToken });
        }
        return Promise.reject({ message: "Неверные данные администратора" });
    },

    adminList({ status, sort = "desc", page = 1, pageSize = 5 }) {
        ensureSeed();
        const bookings = read(LS_BOOKINGS, []);
        let data = [...bookings];

        if (status && status !== "all") {
            data = data.filter((b) => b.status === status);
        }

        data.sort((a, b) => {
            const av = new Date(a.createdAt).getTime();
            const bv = new Date(b.createdAt).getTime();
            return sort === "asc" ? av - bv : bv - av;
        });

        const total = data.length;
        const start = (page - 1) * pageSize;
        const items = data.slice(start, start + pageSize);

        return Promise.resolve({ items, total, rooms: ROOMS, statuses: STATUSES });
    },

    adminSetStatus({ bookingId, status }) {
        ensureSeed();
        const bookings = read(LS_BOOKINGS, []);
        const idx = bookings.findIndex((b) => b.id === bookingId);
        if (idx === -1) return Promise.reject({ message: "Заявка не найдена" });
        bookings[idx].status = status;
        write(LS_BOOKINGS, bookings);
        return Promise.resolve({ ok: true });
    },
};