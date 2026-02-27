const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
    const header = req.headers.authorization || "";
    const [type, token] = header.split(" ");

    if (type !== "Bearer" || !token) {
        return res.status(401).json({ message: "Нет авторизации" });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        if (!payload || !payload.userId) {
            return res.status(401).json({ message: "Неверный токен" });
        }
        req.user = payload;
        next();
    } catch {
        return res.status(401).json({ message: "Неверный токен" });
    }
}

module.exports = { requireAuth };