import { useEffect, useMemo, useState } from "react";

export default function Slider() {
    // Берём 4 изображения строго из М2/images
    const slides = useMemo(
        () => [
            "/images/image%20(1).jpeg",
            "/images/image%20(2).jpeg",
            "/images/image%20(3).jpeg",
            "/images/image%20(4).jpeg",
        ],
        []
    );

    const [idx, setIdx] = useState(0);

    useEffect(() => {
        const t = setInterval(() => setIdx((v) => (v + 1) % slides.length), 3000);
        return () => clearInterval(t);
    }, [slides.length]);

    const prev = () => setIdx((v) => (v - 1 + slides.length) % slides.length);
    const next = () => setIdx((v) => (v + 1) % slides.length);

    return (
        <div className="mx-4 mt-4">
            <div className="relative rounded-2xl overflow-hidden border border-gold bg-white">
                <img
                    src={slides[idx]}
                    alt={`slide-${idx}`}
                    className="w-full h-[180px] object-cover"
                />

                <button
                    type="button"
                    onClick={prev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full w-10 h-10 flex items-center justify-center border"
                >
                    ‹
                </button>
                <button
                    type="button"
                    onClick={next}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full w-10 h-10 flex items-center justify-center border"
                >
                    ›
                </button>
            </div>

            <div className="flex justify-center gap-2 mt-2">
                {slides.map((_, i) => (
                    <span
                        key={i}
                        className={`w-2.5 h-2.5 rounded-full ${i === idx ? "bg-crimson" : "bg-gold/40"}`}
                    />
                ))}
            </div>
        </div>
    );
}