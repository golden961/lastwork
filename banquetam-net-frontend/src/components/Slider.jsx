import { useEffect, useMemo, useState } from "react";

export function Slider() {
    const images = useMemo(() => ["/slider/1.jpg", "/slider/2.jpg", "/slider/3.jpg", "/slider/4.jpg"], []);
    const [i, setI] = useState(0);

    function prev() { setI((v) => (v - 1 + images.length) % images.length); }
    function next() { setI((v) => (v + 1) % images.length); }

    useEffect(() => {
        const t = setInterval(next, 3000);
        return () => clearInterval(t);
    }, [images.length]);

    return (
        <div className="rounded-2xl overflow-hidden border bg-slate-100">
            <div className="relative w-full h-44">
                <div
                    className="absolute inset-0 flex transition-transform duration-500"
                    style={{ transform: `translateX(-${i * 100}%)` }}
                >
                    {images.map((src) => (
                        <img key={src} src={src} className="w-full h-44 object-cover flex-shrink-0" alt="" />
                    ))}
                </div>

                <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 rounded-full w-9 h-9 border">
                    ‹
                </button>
                <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 rounded-full w-9 h-9 border">
                    ›
                </button>
            </div>

            <div className="flex justify-center gap-1 py-2 bg-white">
                {images.map((_, idx) => (
                    <div key={idx} className={`h-1.5 w-6 rounded-full ${idx === i ? "bg-slate-900" : "bg-slate-200"}`} />
                ))}
            </div>
        </div>
    );
}