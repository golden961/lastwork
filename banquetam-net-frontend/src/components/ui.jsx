export function Card({ children, className = "" }) {
    return <div className={`card p-4 ${className}`}>{children}</div>;
}

export function Label({ children }) {
    return <div className="t12 mb-1">{children}</div>;
}

export function ErrorText({ children }) {
    if (!children) return null;
    return <div className="text-[12px] text-crimson mt-1 font-bold">{children}</div>;
}

export function ButtonPrimary(props) {
    return <button {...props} className={`btn-primary ${props.className || ""}`} />;
}
export function ButtonGhost(props) {
    return <button {...props} className={`btn-ghost ${props.className || ""}`} />;
}

export function FieldInput({ label, error, ...props }) {
    return (
        <label className="block">
            <Label>{label}</Label>
            <input {...props} className={`field ${error ? "border-[var(--crimson)]" : ""}`} />
            <ErrorText>{error}</ErrorText>
        </label>
    );
}

export function FieldSelect({ label, error, children, ...props }) {
    return (
        <label className="block">
            <Label>{label}</Label>
            <select {...props} className={`field ${error ? "border-[var(--crimson)]" : ""}`}>
                {children}
            </select>
            <ErrorText>{error}</ErrorText>
        </label>
    );
}

export function Modal({ open, title, children, onClose }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
            <div className="mobile-shell w-full">
                <div className="m-4 card p-4 shadow-soft">
                    <div className="flex items-center justify-between">
                        <div className="h3">{title}</div>
                        <button className="text-crimson text-xl font-black" onClick={onClose}>×</button>
                    </div>
                    <div className="mt-3">{children}</div>
                </div>
            </div>
        </div>
    );
}

export function Pagination({ page, pageSize, total, onChange }) {
    const pages = Math.max(1, Math.ceil(total / pageSize));
    return (
        <div className="flex items-center justify-between mt-3">
            <button className="btn-ghost w-auto px-4" disabled={page <= 1} onClick={() => onChange(page - 1)}>Назад</button>
            <div className="t12 font-bold text-black/70">Стр. {page} / {pages}</div>
            <button className="btn-ghost w-auto px-4" disabled={page >= pages} onClick={() => onChange(page + 1)}>Вперёд</button>
        </div>
    );
}



export function StatusBadge({ status }) {
    const cls = status === "Новая" ? "badge badge-new" : "badge badge-ok";
    return <span className={cls}>{status}</span>;
}