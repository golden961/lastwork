import { Link, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export function AppShell({ title, children, backTo }) {
    const loc = useLocation();
    const showBack = Boolean(backTo) && loc.pathname !== backTo;

    return (
        <div className="min-h-screen bg-slate-100">
            <div className="mx-auto w-[390px] max-w-full min-h-screen bg-white shadow">
                <div className="px-4 pt-4 pb-3 bg-gradient-to-b from-slate-900 to-slate-800 text-white">
                    <div className="flex items-center gap-2">
                        {showBack ? (
                            <Link
                                to={backTo}
                                className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/15 transition"
                                aria-label="Назад"
                            >
                                <ArrowLeft size={18} />
                            </Link>
                        ) : (
                            <div className="w-10 h-10" />
                        )}
                        <div className="flex-1">
                            <div className="text-xs text-white/70">Банкетам.Нет</div>
                            <div className="text-base font-semibold leading-tight">{title}</div>
                        </div>
                    </div>
                </div>

                <main className="px-4 py-4">{children}</main>
            </div>
        </div>
    );
}