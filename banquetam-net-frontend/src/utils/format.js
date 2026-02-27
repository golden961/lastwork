export function ruStatus(s) {
    if (s === "NEW") return "Новая";
    if (s === "SCHEDULED") return "Банкет назначен";
    if (s === "DONE") return "Банкет завершен";
    return s || "";
}

export function statusTone(s) {
    if (s === "NEW") return "amber";
    if (s === "SCHEDULED") return "blue";
    if (s === "DONE") return "green";
    return "gray";
}

export function ruPayment(p) {
    if (p === "CASH") return "Наличные";
    if (p === "CARD") return "Карта";
    if (p === "ONLINE") return "Онлайн";
    return p || "";
}

// для отображения startAt (ISO) в ДД.ММ.ГГГГ
export function toDDMMYYYY(iso) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}.${mm}.${yyyy}`;
}

// мягкий инпут: автоточки в ДД.ММ.ГГГГ
export function normalizeDateInput(v) {
    const digits = (v || "").replace(/\D/g, "").slice(0, 8);
    const parts = [];
    if (digits.length >= 2) parts.push(digits.slice(0, 2));
    else parts.push(digits);
    if (digits.length >= 4) parts.push(digits.slice(2, 4));
    else if (digits.length > 2) parts.push(digits.slice(2));
    if (digits.length > 4) parts.push(digits.slice(4));
    return parts.filter(Boolean).join(".");
}