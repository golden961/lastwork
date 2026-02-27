import { Link, useLocation } from "react-router-dom";

export default function AppHeader() {
    const { pathname } = useLocation();

    return (
        <header className="px-4 pt-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img
                        src="/assets/icon2.svg"
                        alt="logo"
                        className="w-10 h-10"
                    />
                    <div>
                        <div className="h3">Банкетам.Нет</div>
                        <div className="text-help-12">Бронирование помещений</div>
                    </div>
                </div>

                <nav className="flex gap-3 text-help-12">
                    {pathname !== "/login" && <Link to="/login">Вход</Link>}
                    {pathname !== "/register" && <Link to="/register">Регистрация</Link>}
                </nav>
            </div>
        </header>
    );
}