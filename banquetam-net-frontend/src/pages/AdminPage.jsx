import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import AppHeader from "../components/AppHeader.jsx";
import HeroTop from "../components/HeroTop.jsx";
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";
import Select from "../components/Select.jsx";
import Modal from "../components/Modal.jsx";
import Pagination from "../components/Pagination.jsx";
import { api } from "../api/index.js";

const STATUS_OPTIONS = ["Новая", "Банкет назначен", "Банкет завершен"];

const ROOM_MAP = {
    hall: { label: "Зал", image: "/assets/66155ef0748e9.jpg" },
    restaurant: { label: "Ресторан", image: "/assets/unnamed%20(2).webp" },
    summer: { label: "Летняя веранда", image: "/assets/1671649122_idei-club-p-veranda-.jpg" },
    closed: { label: "Закрытая веранда", image: "/assets/3505f015e0d26644e8e4c.jpg" },
};

export default function AdminPage() {
    const [adminAuthed, setAdminAuthed] = useState(() => !!localStorage.getItem("adminToken"));

    // login form
    const [login, setLogin] = useState("Admin26");
    const [password, setPassword] = useState("Demo20");

    // list controls
    const [status, setStatus] = useState("all");
    const [sort, setSort] = useState("desc");
    const [page, setPage] = useState(1);
    const pageSize = 5;

    const [data, setData] = useState({ items: [], total: 0 });
    const [loading, setLoading] = useState(false);

    // modal
    const [modalOpen, setModalOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const [newStatus, setNewStatus] = useState("Новая");

    async function doAdminLogin() {
        const res = await api.adminLogin({ login, password });
        localStorage.setItem("adminToken", res.adminToken);
        setAdminAuthed(true);
        toast.success("Администратор вошёл");
    }

    async function load() {
        setLoading(true);
        try {
            const res = await api.adminList({ status, sort, page, pageSize });
            setData({ items: res.items || [], total: res.total || 0 });
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (adminAuthed) load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [adminAuthed, status, sort, page]);

    const openStatusModal = (booking) => {
        setSelected(booking);
        setNewStatus(booking.status);
        setModalOpen(true);
    };

    async function saveStatus() {
        await api.adminSetStatus({ bookingId: selected.id, status: newStatus });
        toast.success("Статус обновлён");
        setModalOpen(false);
        load();
    }

    const logoutAdmin = () => {
        localStorage.removeItem("adminToken");
        setAdminAuthed(false);
        toast.success("Выход из админки");
    };

    // ---- UI ----
    if (!adminAuthed) {
        return (
            <div>
                <AppHeader />
                <HeroTop title="Админка" subtitle="Вход администратора" />
                <main className="px-4 py-4 space-y-3">
                    <Input label="Логин" value={login} onChange={(e) => setLogin(e.target.value)} />
                    <Input label="Пароль" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <Button type="button" onClick={doAdminLogin}>Войти</Button>
                </main>
            </div>
        );
    }

    return (
        <div>
            <AppHeader />
            <HeroTop title="Панель администратора" subtitle="Управление заявками" />

            <main className="px-4 py-4">
                <div className="flex gap-2 mb-3">
                    <Select label="Фильтр по статусу" value={status} onChange={(e) => { setPage(1); setStatus(e.target.value); }}>
                        <option value="all">Все</option>
                        {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </Select>

                    <Select label="Сортировка" value={sort} onChange={(e) => setSort(e.target.value)}>
                        <option value="desc">Сначала новые</option>
                        <option value="asc">Сначала старые</option>
                    </Select>
                </div>

                <div className="mb-3">
                    <button
                        className="w-full rounded-xl border border-gold bg-white text-gold py-3 font-semibold"
                        onClick={logoutAdmin}
                    >
                        Выйти из админки
                    </button>
                </div>

                <section className="bg-white rounded-2xl border border-gold p-3">
                    <div className="h2 mb-2">Заявки</div>

                    {loading ? (
                        <div className="text-help-12">Загрузка...</div>
                    ) : data.items.length === 0 ? (
                        <div className="text-help-12">Заявок нет</div>
                    ) : (
                        <div className="space-y-3">
                            {data.items.map((b) => {
                                const room = ROOM_MAP[b.roomId] || { label: b.roomId, image: "/assets/None-106945.jpg" };
                                return (
                                    <div key={b.id} className="rounded-2xl border p-3">
                                        <div className="flex gap-3">
                                            <img src={room.image} alt={room.label} className="w-16 h-16 rounded-xl object-cover" />
                                            <div className="flex-1">
                                                <div className="h3">{room.label}</div>
                                                <div className="text-help-12">Дата: {b.date}</div>
                                                <div className="text-help-12">Оплата: {b.paymentMethod}</div>
                                                <div className="text-help-12">Статус: <span className="text-crimson">{b.status}</span></div>
                                            </div>
                                        </div>

                                        <div className="mt-3">
                                            <button
                                                className="w-full rounded-xl border border-gold bg-white text-gold py-2 font-semibold"
                                                onClick={() => openStatusModal(b)}
                                            >
                                                Изменить статус
                                            </button>
                                        </div>

                                        <div className="text-[11px] text-gray-500 mt-2">ID: {b.id}</div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <Pagination
                        page={page}
                        pageSize={pageSize}
                        total={data.total}
                        onChange={(p) => setPage(p)}
                    />
                </section>
            </main>

            <Modal
                open={modalOpen}
                title="Смена статуса"
                onClose={() => setModalOpen(false)}
            >
                <div className="space-y-3">
                    <div className="text-help-12">Выберите новый статус:</div>
                    <select
                        className="w-full rounded-xl border px-3 py-3 outline-none bg-white border-gray-300"
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                    >
                        {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>

                    <Button type="button" onClick={saveStatus}>Сохранить</Button>
                </div>
            </Modal>
        </div>
    );
}