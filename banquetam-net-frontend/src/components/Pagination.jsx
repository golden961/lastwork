export default function Pagination({ page, pageSize, total, onChange }) {
    const pages = Math.max(1, Math.ceil(total / pageSize));
    return (
        <div className="flex items-center justify-between mt-3 text-help-12">
            <button
                className="px-3 py-2 rounded-xl border bg-white"
                disabled={page <= 1}
                onClick={() => onChange(page - 1)}
            >
                Назад
            </button>
            <div>Стр. {page} / {pages}</div>
            <button
                className="px-3 py-2 rounded-xl border bg-white"
                disabled={page >= pages}
                onClick={() => onChange(page + 1)}
            >
                Вперед
            </button>
        </div>
    );
}