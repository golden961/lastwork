import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import AppHeader from "../components/AppHeader.jsx";
import HeroTop from "../components/HeroTop.jsx";
import Button from "../components/Button.jsx";
import { useAuth } from "../state/auth.jsx";

export default function HomePage() {
    const nav = useNavigate();
    const { isAuthed, user } = useAuth();

    function goBooking() {
        if (!isAuthed) {
            toast.error("Чтобы забронировать, нужно войти или зарегистрироваться");
            nav("/login");
            return;
        }
        nav("/booking");
    }

    return (
        <div>
            <AppHeader />
            <HeroTop
                title="Банкетам.Нет"
                subtitle="Бронирование залов и веранд — быстро и удобно"
            />

            <main className="px-4 py-4 space-y-3">
                <div className="bg-white rounded-2xl border border-gold p-3">
                    <div className="h2">Помещения</div>
                    <div className="text-help-12 mb-3">
                        Зал · Ресторан · Летняя веранда · Закрытая веранда
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <img className="w-full h-24 rounded-xl object-cover" src="/assets/66155ef0748e9.jpg" alt="Зал" />
                        <img className="w-full h-24 rounded-xl object-cover" src="/assets/unnamed%20(2).webp" alt="Ресторан" />
                        <img className="w-full h-24 rounded-xl object-cover" src="/assets/1671649122_idei-club-p-veranda-.jpg" alt="Летняя веранда" />
                        <img className="w-full h-24 rounded-xl object-cover" src="/assets/3505f015e0d26644e8e4c.jpg" alt="Закрытая веранда" />
                    </div>
                </div>

                <Button type="button" onClick={goBooking}>
                    Забронировать помещение
                </Button>

                {isAuthed ? (
                    <>
                        <Link to="/profile">
                            <Button variant="secondary" type="button">
                                Перейти в личный кабинет ({user?.login})
                            </Button>
                        </Link>
                    </>
                ) : (
                    <>
                        <Link to="/login">
                            <Button variant="secondary" type="button">Войти</Button>
                        </Link>
                        <Link to="/register">
                            <Button variant="secondary" type="button">Регистрация</Button>
                        </Link>
                    </>
                )}
            </main>
        </div>
    );
}