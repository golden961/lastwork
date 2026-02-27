import { cn } from "./cn";

export function Button({ className = "", variant = "primary", ...props }) {
    const base =
        "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none";
    const variants = {
        primary: "bg-slate-900 text-white hover:bg-slate-800 shadow-sm",
        ghost: "bg-transparent text-slate-900 hover:bg-slate-100",
        soft: "bg-slate-100 text-slate-900 hover:bg-slate-200",
        danger: "bg-rose-600 text-white hover:bg-rose-500",
    };

    return <button className={cn(base, variants[variant], className)} {...props} />;
}