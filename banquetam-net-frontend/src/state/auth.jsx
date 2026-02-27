import { createContext, useContext, useMemo, useState } from "react";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const raw = localStorage.getItem("user");
        return raw ? JSON.parse(raw) : null;
    });

    const token = localStorage.getItem("userToken") || "";
    const isAuthed = !!token;

    const value = useMemo(
        () => ({
            user,
            token,
            isAuthed,
            setSession: ({ token, user }) => {
                if (token) localStorage.setItem("userToken", token);
                if (user) localStorage.setItem("user", JSON.stringify(user));
                setUser(user || null);
            },
            logout: () => {
                localStorage.removeItem("userToken");
                localStorage.removeItem("user");
                setUser(null);
            },
        }),
        [user, token, isAuthed]
    );

    return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthCtx);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}