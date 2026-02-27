export default function HeroTop({ title, subtitle }) {
    return (
        <div
            className="mx-4 mt-4 rounded-2xl overflow-hidden"
            style={{
                backgroundImage: "url(/assets/04.png)",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <div className="p-4 bg-black/30">
                <div className="h1">{title}</div>
                {subtitle ? <div className="text-base-16 text-white">{subtitle}</div> : null}
            </div>
        </div>
    );
}