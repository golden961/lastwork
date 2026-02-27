require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { authRouter } = require("./routes/auth");
const { meRouter } = require("./routes/me");
const { roomsRouter } = require("./routes/rooms");
const { bookingsRouter } = require("./routes/bookings");
const { reviewsRouter } = require("./routes/reviews");
const { adminRouter } = require("./routes/admin");

const app = express();

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: false
}));

app.use(express.json());

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRouter);
app.use("/api/me", meRouter);
app.use("/api/rooms", roomsRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/admin", adminRouter);

// простая обработка ошибок (чтобы не падало)
app.use((err, req, res, next) => {
    console.error("UNHANDLED ERROR:", err);
    res.status(500).json({ message: "Ошибка сервера" });
});

module.exports = { app };