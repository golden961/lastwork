const express = require("express");
const { prisma } = require("../lib/prisma");
const { requireAuth } = require("../middleware/auth");
const { isNonEmptyString } = require("../lib/validators");

const router = express.Router();

router.post("/", requireAuth, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { bookingId, text } = req.body || {};

        if (!bookingId || Number.isNaN(Number(bookingId))) {
            return res.status(400).json({ message: "Некорректная заявка" });
        }
        if (!isNonEmptyString(text)) {
            return res.status(400).json({ message: "Текст отзыва обязателен" });
        }

        const booking = await prisma.booking.findUnique({
            where: { id: Number(bookingId) },
            include: { review: true }
        });

        if (!booking || booking.userId !== userId) {
            return res.status(404).json({ message: "Заявка не найдена" });
        }

        if (booking.status === "NEW") {
            return res.status(403).json({ message: "Отзыв можно оставить после подтверждения администратором" });
        }

        if (booking.review) {
            return res.status(409).json({ message: "Отзыв по этой заявке уже оставлен" });
        }

        const review = await prisma.review.create({
            data: {
                userId,
                bookingId: booking.id,
                text
            }
        });

        return res.status(201).json({ message: "Отзыв добавлен", review });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Ошибка сервера" });
    }
});

module.exports = { reviewsRouter: router };