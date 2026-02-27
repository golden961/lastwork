export default function Button({ children, variant = "primary", ...props }) {
    const base =
        "w-full rounded-xl py-3 font-semibold transition active:scale-[0.99]";
    const styles =
        variant === "primary"
            ? "bg-crimson text-white"
            : "bg-white border border-gold text-gold";

    return (
        <button {...props} className={`${base} ${styles} ${props.disabled ? "opacity-50" : ""}`}>
            {children}
        </button>
    );
}