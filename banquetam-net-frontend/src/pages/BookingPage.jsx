import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import AppHeader from "../components/AppHeader.jsx";
import HeroTop from "../components/HeroTop.jsx";
import Select from "../components/Select.jsx";
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";

import { api } from "../api/index.js";
import { useAuth } from "../state/auth.jsx";

const ROOMS = [
    { id: "hall", label: "Зал", image: "/assets/66155ef0748e9.jpg" },
    { id: "restaurant", label: "Ресторан", image: "/assets/unnamed%20(2).webp" },
    { id: "summer", label: "Летняя веранда", image: "/assets/1671649122_idei-club-p-veranda-.jpg" },
    { id: "closed", label: "Закрытая веранда", image: "/assets/3505f015e0d26644e8e4c.jpg" },
];

const PAYMENTS = [
    { id: "cash", label: "Наличные" },
    { id: "card", label: "Карта" },
    { id: "online", label: "Онлайн" },
];

// маска ДД.ММ.ГГГГ
function maskDate(v) {
    const digits = v.replace(/\D/g, "").slice(0, 8);
    const dd = digits.slice(0, 2);
    const mm = digits.slice(2, 4);
    const yyyy = digits.slice(4, 8);
    let out = dd;
    if (mm) out += "." + mm;
    if (yyyy) out += "." + yyyy;
    return out;
}

function isValidDateStr(s) {
    if (!/^\d{2}\.\d{2}\.\d{4}$/.test(s)) return false;
    const [d, m, y] = s.split(".").map(Number);
    if (y < 1900 || y > 2100) return false;
    if (m < 1 || m > 12) return false;
    if (d < 1 || d > 31) return false;
    return true;
}

export default function BookingPage() {
    const nav = useNavigate();
    const { user } = useAuth();

    const [roomId, setRoomId] = useState("");
    const [date, setDate] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");

    const room = useMemo(() => ROOMS.find((r) => r.id === roomId), [roomId]);

    async function submit() {
        if (!roomId) return toast.error("Выберите помещение");
        if (!isValidDateStr(date)) return toast.error("Введите дату в формате ДД.ММ.ГГГГ");
        if (!paymentMethod) return toast.error("Выберите способ оплаты");

        await api.createBooking(user.id, { roomId, date, paymentMethod });
        toast.success("Заявка создана и отправлена администратору");
        nav("/profile");
    }

    return (
        <div>
            <AppHeader />
            <HeroTop title="Оформление заявки" subtitle="Выберите помещение, дату и оплату" />

            <main className="px-4 py-4 space-y-3">
                <Select label="Помещение" value={roomId} onChange={(e) => setRoomId(e.target.value)}>
                    <option value="">— Выберите —</option>
                    {ROOMS.map((r) => (
                        <option key={r.id} value={r.id}>{r.label}</option>
                    ))}
                </Select>

                {room ? (
                    <div className="rounded-2xl border border-gold bg-white p-3 flex gap-3">
                        <img src={room.image} alt={room.label} className="w-20 h-20 rounded-xl object-cover" />
                        <div>
                            <div className="h3">{room.label}</div>
                            <div className="text-help-12">Фото из приложений М1/М2</div>
                        </div>
                    </div>
                ) : null}

                <Input
                    label="Дата начала банкета (ДД.ММ.ГГГГ)"
                    placeholder="27.02.2026"
                    value={date}
                    onChange={(e) => setDate(maskDate(e.target.value))}
                />

                <Select label="Способ оплаты" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                    <option value="">— Выберите —</option>
                    {PAYMENTS.map((p) => (
                        <option key={p.id} value={p.label}>{p.label}</option>
                    ))}
                </Select>

                <Button type="button" onClick={submit}>
                    Отправить заявку
                </Button>
            </main>
        </div>
    );
}