function isValidLogin(login) {
    // минимум 6, латиница+цифры, и обязательно хотя бы 1 буква и 1 цифра
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(login);
}

function isValidPassword(password) {
    return typeof password === "string" && password.length >= 8;
}

function isValidEmail(email) {
    return typeof email === "string" && /.+@.+\..+/.test(email);
}

function isNonEmptyString(v) {
    return typeof v === "string" && v.trim().length > 0;
}

function parseDateDDMMYYYY(input) {
    if (typeof input !== "string") return null;

    // поддержка ISO тоже (на всякий)
    if (/^\d{4}-\d{2}-\d{2}/.test(input)) {
        const d = new Date(input);
        return Number.isNaN(d.getTime()) ? null : d;
    }

    const m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(input);
    if (!m) return null;

    const day = Number(m[1]);
    const month = Number(m[2]);
    const year = Number(m[3]);

    if (month < 1 || month > 12) return null;
    if (day < 1 || day > 31) return null;

    // чтобы не было “сдвига дат” из-за таймзон — ставим 12:00 UTC
    const iso = `${year.toString().padStart(4, "0")}-${m[2]}-${m[1]}T12:00:00.000Z`;
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? null : d;
}

module.exports = {
    isValidLogin,
    isValidPassword,
    isValidEmail,
    isNonEmptyString,
    parseDateDDMMYYYY
};