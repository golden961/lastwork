import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import AppHeader from "../components/AppHeader.jsx";
import HeroTop from "../components/HeroTop.jsx";
import Slider from "../components/Slider.jsx";
import Button from "../components/Button.jsx";
import Input from "../components/Input.jsx";

import { api } from "../api/index.js";
import { useAuth } from "../state/auth.jsx";

const ROOM_MAP = {
    hall: { label: "Зал", image: "/assets/66155ef0748e9.jpg" },
    restaurant: { label: "Ресторан", image: "/assets/unnamed%20(2).webp" },
    summer: { label: "Летняя веранда", image: "/assets/1671649122_idei-club-p-veranda-.jpg" },
    closed: { label: "Закрытая веранда", image: "/assets/3505f015e0d26644e8e4c.jpg" },
};

export default function ProfilePage() {
    const { user, logout } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const [reviewBookingId, setReviewBookingId] = useState("");
    const [reviewText, setReviewText] = useState("");

    const canLeaveReview = useMemo(() => {
        const b = bookings.find((x) => x.id === reviewBookingId);
        return b?.status === "Банкет завершен"; // правило сейчас строго так
    }, [bookings, reviewBookingId]);

    async function load() {
        setLoading(true);
        try {
            const res = await api.myBookings(user.id);
            setBookings(res.bookings || []);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function submitReview() {
        if (!reviewBookingId) return toast.error("Выберите заявку");
        if (!reviewText.trim()) return toast.error("Введите текст отзыва");

        await api.createReview(user.id, { bookingId: reviewBookingId, text: reviewText.trim() });
        toast.success("Отзыв отправлен");
        setReviewText("");
        setReviewBookingId("");
        load();
    }

    return (
        <div>
            <AppHeader />
            <HeroTop title="Личный кабинет" subtitle={user?.fullName || user?.login} />

            <Slider />

            <main className="px-4 py-4 space-y-4">
                <div className="flex gap-2">
                    <Link className="flex-1" to="/booking">
                        <Button type="button">Оформить заявку</Button>
                    </Link>
                    <button
                        type="button"
                        className="flex-1 rounded-xl border border-gold text-gold bg-white py-3 font-semibold"
                        onClick={logout}
                    >
                        Выйти
                    </button>
                </div>

                <section className="bg-white rounded-2xl border border-gold p-3">
                    <div className="h2 mb-2">Мои заявки</div>

                    {loading ? (
                        <div className="text-help-12">Загрузка...</div>
                    ) : bookings.length === 0 ? (
                        <div className="text-help-12">Заявок пока нет</div>
                    ) : (
                        <div className="space-y-3">
                            {bookings.map((b) => {
                                const room = ROOM_MAP[b.roomId] || { label: b.roomId, image: "/assets/None-106945.jpg" };
                                return (
                                    <div key={b.id} className="rounded-2xl border p-3">
                                        <div className="flex gap-3">
                                            <img src={room.image} alt={room.label} className="w-16 h-16 rounded-xl object-cover" />
                                            <div className="flex-1">
                                                <div className="h3">{room.label}</div>
                                                <div className="text-help-12">Дата: {b.date}</div>
                                                <div className="text-help-12">Оплата: {b.paymentMethod}</div>
                                                <div className={`text-help-12 ${b.status === "Новая" ? "text-crimson" : "text-green"}`}>
                                                    Статус: {b.status}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-[11px] text-gray-500 mt-2">ID: {b.id}</div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>

                <section className="bg-white rounded-2xl border border-gold p-3">
                    <div className="h2 mb-2">Оставить отзыв</div>

                    <label className="block mb-2">
                        <div className="text-help-12 mb-1">Выберите заявку</div>
                        <select
                            value={reviewBookingId}
                            onChange={(e) => setReviewBookingId(e.target.value)}
                            className="w-full rounded-xl border px-3 py-3 outline-none bg-white border-gray-300"
                        >
                            <option value="">— Выберите —</option>
                            {bookings.map((b) => (
                                <option key={b.id} value={b.id}>
                                    {b.date} · {b.roomId} · {b.status}
                                </option>
                            ))}
                        </select>
                    </label>

                    <Input
                        label="Текст отзыва"
                        placeholder="Напишите ваш отзыв..."
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                    />

                    <div className="mt-3">
                        <Button type="button" disabled={!canLeaveReview} onClick={submitReview}>
                            Отправить отзыв
                        </Button>
                        {!canLeaveReview ? (
                            <div className="text-help-12 mt-2">
                                Отзыв доступен только после статуса «Банкет завершен».
                            </div>
                        ) : null}
                    </div>
                </section>
            </main>
        </div>
    );
}