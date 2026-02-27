import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { CalendarDays, CreditCard, Check } from "lucide-react";

import { AppShell } from "../layout/AppShell";
import { apiFetch } from "../api/http";
import { storage } from "../utils/storage";
import { Card, CardBody } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { normalizeDateInput } from "../utils/format";

export function BookingPage() {
    const nav = useNavigate();
    const token = storage.getUserToken();

    const [rooms, setRooms] = useState([]);
    const [roomId, setRoomId] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("CASH");
    const [startDate, setStartDate] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const data = await apiFetch("/api/rooms");
                setRooms(data.rooms || []);
                setRoomId(String(data.rooms?.[0]?.id || ""));
            } catch (e) {
                toast.error(e.message);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    async function submit() {
        if (!roomId) return toast.error("Выберите помещение");
        if (!startDate || startDate.length !== 10) return toast.error("Дата должна быть в формате ДД.ММ.ГГГГ");

        setSaving(true);
        try {
            await apiFetch("/api/bookings", {
                method: "POST",
                token,
                body: { roomId: Number(roomId), startDate, paymentMethod },
            });
            toast.success("Заявка создана и отправлена администратору");
            nav("/profile");
        } catch (e) {
            toast.error(e.message);
        } finally {
            setSaving(false);
        }
    }

    return (
        <AppShell title="Оформление заявки" backTo="/profile">
            <div className="space-y-4">
                <Card>
                    <CardBody className="space-y-3">
                        <div className="text-sm font-semibold">Данные заявки</div>

                        <div>
                            <div className="text-xs font-semibold text-slate-700 mb-1">Помещение</div>
                            <Select value={roomId} onChange={(e) => setRoomId(e.target.value)} disabled={loading}>
                                {rooms.map((r) => (
                                    <option key={r.id} value={r.id}>
                                        {r.title}
                                    </option>
                                ))}
                            </Select>
                        </div>

                        <div>
                            <div className="text-xs font-semibold text-slate-700 mb-1 flex items-center gap-2">
                                <CalendarDays size={14} /> Дата начала (ДД.ММ.ГГГГ)
                            </div>
                            <Input
                                value={startDate}
                                onChange={(e) => setStartDate(normalizeDateInput(e.target.value))}
                                placeholder="27.02.2026"
                                inputMode="numeric"
                            />
                        </div>

                        <div>
                            <div className="text-xs font-semibold text-slate-700 mb-1 flex items-center gap-2">
                                <CreditCard size={14} /> Способ оплаты
                            </div>
                            <Select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                                <option value="CASH">Наличные</option>
                                <option value="CARD">Карта</option>
                                <option value="ONLINE">Онлайн</option>
                            </Select>
                        </div>

                        <Button disabled={saving} onClick={submit} className="w-full">
                            <Check size={16} />
                            {saving ? "Сохранение…" : "Отправить заявку"}
                        </Button>

                        <div className="text-xs text-slate-500">
                            После отправки заявка будет иметь статус <span className="font-semibold">«Новая»</span> и уйдёт на проверку администратору.
                        </div>
                    </CardBody>
                </Card>
            </div>
        </AppShell>
    );
}