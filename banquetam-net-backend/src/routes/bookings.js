const express = require("express");
const { prisma } = require("../lib/prisma");
const { requireAuth } = require("../middleware/auth");
const { parseDateDDMMYYYY, isNonEmptyString } = require("../lib/validators");

const router = express.Router();

router.post("/", requireAuth, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { roomId, startDate, paymentMethod } = req.body || {};

        const errors = {};
        const date = parseDateDDMMYYYY(startDate);

        if (!roomId || Number.isNaN(Number(roomId))) errors.roomId = "Выберите помещение";
        if (!date) errors.startDate = "Дата должна быть в формате ДД.ММ.ГГГГ";
        if (!isNonEmptyString(paymentMethod)) errors.paymentMethod = "Выберите способ оплаты";

        const allowedPayments = ["CASH", "CARD", "ONLINE"];
        if (paymentMethod && !allowedPayments.includes(paymentMethod)) {
            errors.paymentMethod = "Способ оплаты: CASH / CARD / ONLINE";
        }

        if (Object.keys(errors).length) {
            return res.status(400).json({ message: "Ошибка валидации", errors });
        }

        const room = await prisma.room.findUnique({ where: { id: Number(roomId) } });
        if (!room || !room.isActive) {
            return res.status(404).json({ message: "Помещение не найдено" });
        }

        const booking = await prisma.booking.create({
            data: {
                userId,
                roomId: Number(roomId),
                startAt: date,
                paymentMethod,
                status: "NEW"
            },
            include: { room: true }
        });

        return res.status(201).json({ message: "Заявка создана", booking });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Ошибка сервера" });
    }
});

router.get("/my", requireAuth, async (req, res) => {
    const userId = req.user.userId;

    const bookings = await prisma.booking.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: { room: true, review: true }
    });

    return res.json({ bookings });
});

module.exports = { bookingsRouter: router };