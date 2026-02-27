/** @type {import('tailwindcss').Config} */
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
            fontFamily: {
                oswald: ["Oswald", "sans-serif"],
            },
        },
    },
    plugins: [],
};