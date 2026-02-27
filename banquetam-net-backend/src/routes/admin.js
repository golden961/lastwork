const express = require("express");
const jwt = require("jsonwebtoken");
const { prisma } = require("../lib/prisma");
const { requireAdmin } = require("../middleware/adminAuth");
const { isNonEmptyString } = require("../lib/validators");

const router = express.Router();

router.post("/login", async (req, res) => {
    const { login, password } = req.body || {};

    const adminLogin = process.env.ADMIN_LOGIN || "Admin26";
    const adminPassword = process.env.ADMIN_PASSWORD || "Demo20";

    if (!isNonEmptyString(login) || !isNonEmptyString(password)) {
        return res.status(400).json({ message: "Введите логин и пароль" });
    }

    if (login !== adminLogin || password !== adminPassword) {
        return res.status(401).json({ message: "Неверные данные администратора" });
    }

    const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, { expiresIn: "7d" });
    return res.json({ message: "Вход администратора выполнен", token });
});

router.get("/bookings", requireAdmin, async (req, res) => {
    // минимально, но удобно: фильтр/пагинация/сортировка
    const {
        status,
        page = "1",
        limit = "20",
        sortBy = "createdAt",
        order = "desc",
        userLogin
    } = req.query;

    const take = Math.min(Math.max(Number(limit) || 20, 1), 50);
    const skip = (Math.max(Number(page) || 1, 1) - 1) * take;

    const where = {};
    if (status && ["NEW", "SCHEDULED", "DONE"].includes(status)) where.status = status;

    if (userLogin && typeof userLogin === "string" && userLogin.trim()) {
        where.user = { login: { contains: userLogin.trim(), mode: "insensitive" } };
    }

    const allowedSort = ["createdAt", "startAt", "status"];
    const safeSortBy = allowedSort.includes(sortBy) ? sortBy : "createdAt";
    const safeOrder = order === "asc" ? "asc" : "desc";

    const [total, bookings] = await Promise.all([
        prisma.booking.count({ where }),
        prisma.booking.findMany({
            where,
            skip,
            take,
            orderBy: { [safeSortBy]: safeOrder },
            include: {
                user: { select: { id: true, login: true, fullName: true, phone: true, email: true } },
                room: true,
                review: true
            }
        })
    ]);

    return res.json({
        page: Math.max(Number(page) || 1, 1),
        limit: take,
        total,
        bookings
    });
});

router.patch("/bookings/:id/status", requireAdmin, async (req, res) => {
    const id = Number(req.params.id);
    const { status } = req.body || {};

    if (Number.isNaN(id)) return res.status(400).json({ message: "Некорректный id" });
    if (!["SCHEDULED", "DONE"].includes(status)) {
        return res.status(400).json({ message: "Статус только: SCHEDULED или DONE" });
    }

    const booking = await prisma.booking.update({
        where: { id },
        data: { status },
        include: { user: true, room: true, review: true }
    });

    return res.json({ message: "Статус обновлён", booking });
});

module.exports = { adminRouter: router };