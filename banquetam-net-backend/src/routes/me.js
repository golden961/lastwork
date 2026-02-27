const express = require("express");
const { prisma } = require("../lib/prisma");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
    const userId = req.user.userId;

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, login: true, fullName: true, phone: true, email: true, createdAt: true }
    });

    return res.json({ user });
});

module.exports = { meRouter: router };