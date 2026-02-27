import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Plus, LogOut, Star } from "lucide-react";

import { AppShell } from "../layout/AppShell";
import { apiFetch } from "../api/http";
import { storage } from "../utils/storage";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card, CardBody } from "../ui/Card";
import { Textarea } from "../ui/Textarea";
import { ruPayment, ruStatus, statusTone, toDDMMYYYY } from "../utils/format";
import { Slider } from "../components/Slider";

export function ProfilePage() {
    const nav = useNavigate();
    const token = storage.getUserToken();

    const [me, setMe] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reviewTextById, setReviewTextById] = useState({});

    async function load() {
        setLoading(true);
        try {
            const [meRes, bRes] = await Promise.all([
                apiFetch("/api/me", { token }),
                apiFetch("/api/bookings/my", { token }),
            ]);
            setMe(meRes.user);
            setBookings(bRes.bookings || []);
        } catch (e) {
            toast.error(e.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { load(); }, []);

    const stats = useMemo(() => {
        const total = bookings.length;
        const done = bookings.filter((b) => b.status === "DONE").length;
        return { total, done };
    }, [bookings]);

    function logout() {
        storage.clearUserToken();
        nav("/login");
    }

    async function submitReview(bookingId) {
        const text = (reviewTextById[bookingId] || "").trim();
        if (!text) return toast.error("Введите текст отзыва");

        try {
            await apiFetch("/api/reviews", { method: "POST", token, body: { bookingId, text } });
            toast.success("Отзыв добавлен");
            setReviewTextById((m) => ({ ...m, [bookingId]: "" }));
            await load();
        } catch (e) {
            toast.error(e.message);
        }
    }

    return (
        <AppShell title="Личный кабинет">
            <div className="space-y-4">
                <Card>
                    <CardBody className="space-y-3">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <div className="text-xs text-slate-500">Пользователь</div>
                                <div className="text-sm font-semibold">{me?.fullName || "—"}</div>
                                <div className="text-xs text-slate-500">{me?.email || ""}</div>
                            </div>

                            <Button variant="soft" onClick={logout}>
                                <LogOut size={16} />
                                Выйти
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <MiniStat label="Всего заявок" value={stats.total} />
                            <MiniStat label="Завершено" value={stats.done} />
                        </div>

                        <div className="flex gap-2">
                            <Button className="flex-1" onClick={() => nav("/booking/new")}>
                                <Plus size={16} />
                                Оформить заявку
                            </Button>
                            <Button variant="soft" onClick={load}>Обновить</Button>
                        </div>
                    </CardBody>
                </Card>

                {/* Слайдер по ТЗ */}
                <Slider />

                <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold">История заявок</div>
                    {loading ? <div className="text-xs text-slate-500">Загрузка…</div> : null}
                </div>

                {(!loading && bookings.length === 0) ? (
                    <Card>
                        <CardBody>
                            <div className="text-sm font-medium">Заявок пока нет</div>
                            <div className="text-xs text-slate-500 mt-1">Нажмите “Оформить заявку”, чтобы создать первую.</div>
                        </CardBody>
                    </Card>
                ) : null}

                <div className="space-y-3">
                    {bookings.map((b) => {
                        const canReview = b.status === "DONE"; // ✅ под твой текущий бэкенд
                        const already = Boolean(b.review);

                        return (
                            <Card key={b.id}>
                                <CardBody className="space-y-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <div className="text-sm font-semibold">{b.room?.title || "Помещение"}</div>
                                            <div className="text-xs text-slate-500 mt-1">
                                                Дата: <span className="font-medium text-slate-700">{toDDMMYYYY(b.startAt)}</span>
                                                {" · "}Оплата: <span className="font-medium text-slate-700">{ruPayment(b.paymentMethod)}</span>
                                            </div>
                                        </div>
                                        <Badge tone={statusTone(b.status)}>{ruStatus(b.status)}</Badge>
                                    </div>

                                    {/* Отзыв */}
                                    {already ? (
                                        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3">
                                            <div className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                                                <Star size={14} /> Ваш отзыв
                                            </div>
                                            <div className="text-sm mt-1 text-slate-800">{b.review.text}</div>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <div className="text-xs font-semibold text-slate-700">Оставить отзыв</div>

                                            {!canReview ? (
                                                <div className="text-xs text-slate-500">
                                                    Отзыв доступен после статуса <span className="font-semibold">«Банкет завершен»</span>.
                                                </div>
                                            ) : (
                                                <>
                                                    <Textarea
                                                        value={reviewTextById[b.id] || ""}
                                                        onChange={(e) => setReviewTextById((m) => ({ ...m, [b.id]: e.target.value }))}
                                                        placeholder="Напишите коротко, как всё прошло…"
                                                    />
                                                    <Button onClick={() => submitReview(b.id)}>Отправить</Button>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </CardBody>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </AppShell>
    );
}

function MiniStat({ label, value }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-3">
            <div className="text-xs text-slate-500">{label}</div>
            <div className="text-lg font-extrabold text-slate-900">{value}</div>
        </div>
    );
}