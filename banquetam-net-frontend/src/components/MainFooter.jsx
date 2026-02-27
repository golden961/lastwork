import { Link } from "react-router-dom";

export default function MainFooter() {
    return (
        <div className="ftr">
            <div className="ftrCard">
                <div className="ftrTop">
                    <div>
                        <div className="ftrTitle">Банкетам.Нет</div>
                        <div className="ftrSub">Бронирование помещений · 2026</div>
                    </div>

                    {/* если нет social.png — замени на /social/soc.png или просто удали img */}
                    <img src="/social/social.png" alt="social" className="h-6 opacity-90" />
                </div>

                <div className="ftrNav">
                    <Link className="ftrLink" to="/">Главная</Link>
                    <Link className="ftrLink" to="/booking">Заявка</Link>
                    <Link className="ftrLink" to="/admin">Админ</Link>
                </div>
            </div>
        </div>
    );
}