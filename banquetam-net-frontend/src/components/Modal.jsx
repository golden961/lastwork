export default function Modal({ open, title, children, onClose }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
            <div className="mobile-shell w-full">
                <div className="m-4 bg-white rounded-2xl p-4 border border-gold">
                    <div className="flex items-center justify-between mb-2">
                        <div className="h3">{title}</div>
                        <button className="text-crimson font-bold" onClick={onClose}>×</button>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}