export default {
    content: ["./index.html", "./src/**/*.{js,jsx}"],
    theme: {
        extend: {
            colors: {
                gold: "var(--gold)",
                rose: "var(--rose)",
                cream: "var(--cream)",
                crimson: "var(--crimson)",
                green: "var(--green)",
            },
            fontFamily: { oswald: ["Oswald", "sans-serif"] },
            boxShadow: {
                soft: "0 8px 24px rgba(0,0,0,0.10)",
            },
        },
    },
    plugins: [],
};