import { Link } from "react-router-dom";

export function LinkButton({ to, children, className = "" }) {
    return (
        <Link
            to={to}
            className={`inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium bg-slate-900 text-white ${className}`}
        >
            {children}
        </Link>
    );
}