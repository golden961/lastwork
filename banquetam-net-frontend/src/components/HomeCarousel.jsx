import { useCallback, useEffect, useMemo, useRef, useState } from "react";

function imgSafe(src) {
    // fallback если не найдена картинка
    return src || "/assets/None-106945.jpg";
}

export default function HomeCarousel() {
    const slides = useMemo(
        () => [
            {
                id: "summer",
                title: "Летняя веранда",
                subtitle: "Свежий воздух и красивые виды",
                img: "/assets/1671649122_idei-club-p-veranda-.jpg",
            },
            {
                id: "closed",
                title: "Закрытая веранда",
                subtitle: "Уют круглый год и в любую погоду",
                img: "/assets/3505f015e0d26644e8e4c.jpg",
            },
            {
                id: "hall",
                title: "Зал",
                subtitle: "Классический формат банкетов и торжеств",
                img: "/assets/66155ef0748e9.jpg",
            },
            {
                id: "restaurant",
                title: "Ресторан",
                subtitle: "Сервис и атмосфера для идеального вечера",
                img: "/assets/unnamed%20(2).webp",
            },
        ],
        []
    );

    const [idx, setIdx] = useState(0);
    const timer = useRef(null);

    const go = useCallback((n) => {
        setIdx((cur) => {
            const next = (n + slides.length) % slides.length;
            return next;
        });
    }, [slides.length]);

    const next = useCallback(() => go(idx + 1), [go, idx]);
    const prev = useCallback(() => go(idx - 1), [go, idx]);

    const restart = useCallback(() => {
        if (timer.current) clearInterval(timer.current);
        timer.current = setInterval(() => {
            setIdx((cur) => (cur + 1) % slides.length);
        }, 3000);
    }, [slides.length]);

    useEffect(() => {
        restart();
        return () => timer.current && clearInterval(timer.current);
    }, [restart]);

    // swipe
    const startX = useRef(null);
    const onTouchStart = (e) => (startX.current = e.touches?.[0]?.clientX ?? null);
    const onTouchEnd = (e) => {
        const endX = e.changedTouches?.[0]?.clientX ?? null;
        if (startX.current == null || endX == null) return;
        const dx = endX - startX.current;
        startX.current = null;
        if (Math.abs(dx) < 40) return;
        dx > 0 ? prev() : next();
        restart();
    };

    return (
        <div className="carousel">
            <div className="carouselViewport" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
                <div
                    className="carouselTrack"
                    style={{ transform: `translate3d(-${idx * 100}%, 0, 0)` }}
                >
                    {slides.map((s) => (
                        <div key={s.id} className="carouselSlide">
                            <img
                                className="carouselImg"
                                src={imgSafe(s.img)}
                                alt={s.title}
                                onError={(e) => (e.currentTarget.src = "/assets/None-106945.jpg")}
                            />
                            <div className="carouselGrad" />
                            <div className="carouselText">
                                <div className="carouselH">{s.title}</div>
                                <div className="carouselP">{s.subtitle}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <button className="carouselBtn carouselBtnL" type="button" onClick={() => { prev(); restart(); }} aria-label="prev">
                    ‹
                </button>
                <button className="carouselBtn carouselBtnR" type="button" onClick={() => { next(); restart(); }} aria-label="next">
                    ›
                </button>
            </div>

            <div className="carouselDots">
                {slides.map((_, i) => (
                    <span key={i} className={`dot ${i === idx ? "dotActive" : ""}`} />
                ))}
            </div>
        </div>
    );
}