import { cn } from "./cn";

export function Input({ className = "", error, ...props }) {
    return (
        <input
            className={cn(
                "w-full rounded-2xl border px-3 py-2 text-sm outline-none transition",
                "border-slate-200 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10",
                error && "border-rose-300 focus:border-rose-600 focus:ring-rose-600/10",
                className
            )}
            {...props}
        />
    );
}