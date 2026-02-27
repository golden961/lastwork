import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import MainHeader from "../components/MainHeader.jsx";
import HomeCarousel from "../components/HomeCarousel.jsx";
import MainFooter from "../components/MainFooter.jsx";

const ROOMS = [
    { id: "hall", title: "Зал", img: "/assets/66155ef0748e9.jpg", desc: "Для торжеств, юбилеев и банкетов" },
    { id: "restaurant", title: "Ресторан", img: "/assets/unnamed%20(2).webp", desc: "Сервис и атмосфера для вечера" },
    { id: "summer", title: "Летняя веранда", img: "/assets/1671649122_idei-club-p-veranda-.jpg", desc: "Свежий воздух и красивые виды" },
    { id: "closed", title: "Закрытая веранда", img: "/assets/3505f015e0d26644e8e4c.jpg", desc: "Уют круглый год и в любую погоду" },
];

export default function HomePage() {
    const nav = useNavigate();
    const isAuthed = !!localStorage.getItem("userToken");

    const goBooking = () => {
        if (!isAuthed) {
            toast.error("Чтобы забронировать, нужно войти или зарегистрироваться");
            nav("/login");
            return;
        }
        nav("/booking");
    };

    return (
        <div className="mobile-shell">
            <MainHeader />

            <div className="page">
                <HomeCarousel />

                <div style={{ height: 12 }} />

                <div className="btnRow">
                    <button className="btnPrimary" type="button" onClick={goBooking}>
                        Забронировать
                    </button>

                    {!isAuthed ? (
                        <button className="btnGhost" type="button" onClick={() => nav("/register")}>
                            Регистрация
                        </button>
                    ) : (
                        <button className="btnGhost" type="button" onClick={() => nav("/profile")}>
                            Мои заявки
                        </button>
                    )}
                </div>

                <div style={{ height: 14 }} />

                <section className="section">
                    <div className="sectionTitle">Выберите помещение</div>
                    <div className="sectionSub">Зал · Ресторан · Летняя веранда · Закрытая веранда</div>

                    <div className="grid2">
                        {ROOMS.map((r) => (
                            <button key={r.id} type="button" className="roomCard" onClick={goBooking}>
                                <img src={r.img} alt={r.title} className="roomImg" onError={(e) => (e.currentTarget.src = "/assets/None-106945.jpg")} />
                                <div className="roomBody">
                                    <div className="roomTitle">{r.title}</div>
                                    <div className="roomDesc">{r.desc}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </section>

                <MainFooter />
            </div>
        </div>
    );
}