import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../state/auth.jsx";

function NavItem({ to, label, icon }) {
    return (
        <NavLink to={to} className="flex flex-col items-center justify-center px-3 py-2">
            {({ isActive }) => (
                <>
          <span className={`text-[18px] ${isActive ? "text-[var(--crimson)]" : "text-black/55"}`}>
            {icon}
          </span>
                    <span className={`text-[12px] font-bold ${isActive ? "text-[var(--crimson)]" : "text-black/55"}`}>
            {label}
          </span>
                </>
            )}
        </NavLink>
    );
}

export default function AppFrame({ title, subtitle, children, showNav = true, rightAction }) {
    const { pathname } = useLocation();
    const nav = useNavigate();
    const { isAuthed, logout } = useAuth();

    const isAuthPage = pathname === "/login" || pathname === "/register";
    const navVisible = showNav && !isAuthPage;

    return (
        <div className="mobile-shell">
            {/* HEADER */}
            <header className="px-4 pt-4 relative">
                <div className="card overflow-hidden">
                    <div className="p-4">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-2xl bg-white border border-[var(--line)] flex items-center justify-center">
                                    <img src="/assets/icon2.svg" alt="logo" className="w-8 h-8" />
                                </div>

                                <div>
                                    <div className="h2 leading-none">{title}</div>
                                    {subtitle ? <div className="text-[12px] text-black/60 mt-1">{subtitle}</div> : null}
                                </div>
                            </div>

                            {rightAction ? (
                                rightAction
                            ) : isAuthed && !isAuthPage ? (
                                <button
                                    className="text-[12px] font-bold px-3 py-2 rounded-2xl border border-[var(--line)] bg-white"
                                    onClick={() => { logout(); nav("/"); }}
                                >
                                    Выйти
                                </button>
                            ) : null}
                        </div>
                    </div>

                    {/* декоративная полоска (не перегружает) */}
                    <div className="h-1" style={{ background: "linear-gradient(90deg, var(--gold), var(--crimson))" }} />
                </div>
            </header>

            {/* CONTENT */}
            <main className={`px-4 pt-4 ${navVisible ? "pb-28" : "pb-6"}`}>
                {children}
            </main>

            {/* BOTTOM NAV */}
            {navVisible ? (
                <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="bn-nav flex justify-around">
                        <NavItem to="/" label="Главная" icon="⌂" />
                        <NavItem to="/booking" label="Заявка" icon="✎" />
                        <NavItem to="/profile" label="Кабинет" icon="☺" />
                    </div>
                </div>
            ) : null}
        </div>
    );
}