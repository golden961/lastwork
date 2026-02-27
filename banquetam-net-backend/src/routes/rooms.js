const express = require("express");
const { prisma } = require("../lib/prisma");

const router = express.Router();

router.get("/", async (req, res) => {
    const rooms = await prisma.room.findMany({
        where: { isActive: true },
        orderBy: { id: "asc" }
    });
    return res.json({ rooms });
});

module.exports = { roomsRouter: router };