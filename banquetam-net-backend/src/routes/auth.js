const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { prisma } = require("../lib/prisma");
const {
    isValidLogin,
    isValidPassword,
    isValidEmail,
    isNonEmptyString
} = require("../lib/validators");

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const { login, password, fullName, phone, email } = req.body || {};

        const errors = {};
        if (!isValidLogin(login)) errors.login = "Логин: латиница+цифры, минимум 6, должны быть буквы и цифры";
        if (!isValidPassword(password)) errors.password = "Пароль: минимум 8 символов";
        if (!isNonEmptyString(fullName)) errors.fullName = "ФИО обязательно";
        if (!isNonEmptyString(phone)) errors.phone = "Телефон обязателен";
        if (!isValidEmail(email)) errors.email = "Некорректный e-mail";

        if (Object.keys(errors).length) {
            return res.status(400).json({ message: "Ошибка валидации", errors });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: { login, passwordHash, fullName, phone, email },
            select: { id: true, login: true, fullName: true, phone: true, email: true, createdAt: true }
        });

        return res.status(201).json({ message: "Пользователь создан", user });
    } catch (e) {
        // Prisma unique login
        if (e && e.code === "P2002") {
            return res.status(409).json({
                message: "Логин уже занят",
                errors: { login: "Этот логин уже используется" }
            });
        }
        console.error(e);
        return res.status(500).json({ message: "Ошибка сервера" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { login, password } = req.body || {};

        if (!isNonEmptyString(login) || !isNonEmptyString(password)) {
            return res.status(400).json({ message: "Введите логин и пароль" });
        }

        const user = await prisma.user.findUnique({ where: { login } });
        if (!user) {
            return res.status(401).json({ message: "Неверный логин или пароль" });
        }

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) {
            return res.status(401).json({ message: "Неверный логин или пароль" });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        return res.json({
            message: "Вход выполнен",
            token,
            user: { id: user.id, login: user.login, fullName: user.fullName, phone: user.phone, email: user.email }
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Ошибка сервера" });
    }
});

module.exports = { authRouter: router };