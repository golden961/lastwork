export default function Select({ label, error, children, ...props }) {
    return (
        <label className="block">
            <div className="text-help-12 mb-1">{label}</div>
            <select
                {...props}
                className={`w-full rounded-xl border px-3 py-3 outline-none bg-white
          ${error ? "border-crimson" : "border-gray-300"}
        `}
            >
                {children}
            </select>
            {error ? <div className="text-[12px] text-crimson mt-1">{error}</div> : null}
        </label>
    );
}