import { cn } from "../ui/cn";

export function Modal({ open, title, children, onClose, footer }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="absolute inset-0 flex items-end justify-center p-3">
                <div className={cn("w-[390px] max-w-full rounded-3xl bg-white shadow-xl border border-slate-200 overflow-hidden")}>
                    <div className="px-4 py-3 border-b">
                        <div className="text-sm font-semibold">{title}</div>
                    </div>
                    <div className="px-4 py-4">{children}</div>
                    {footer ? <div className="px-4 py-3 border-t bg-slate-50">{footer}</div> : null}
                </div>
            </div>
        </div>
    );
}