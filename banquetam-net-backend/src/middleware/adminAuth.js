const jwt = require("jsonwebtoken");

function requireAdmin(req, res, next) {
    const header = req.headers.authorization || "";
    const [type, token] = header.split(" ");

    if (type !== "Bearer" || !token) {
        return res.status(401).json({ message: "Нет авторизации админа" });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        if (!payload || payload.role !== "admin") {
            return res.status(403).json({ message: "Доступ запрещён" });
        }
        req.admin = payload;
        next();
    } catch {
        return res.status(401).json({ message: "Неверный токен" });
    }
}

module.exports = { requireAdmin };