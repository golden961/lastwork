import React, { createContext, useContext, useMemo, useState } from "react";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const raw = localStorage.getItem("user");
        return raw ? JSON.parse(raw) : null;
    });

    const isAuthed = !!localStorage.getItem("token");

    const value = useMemo(
        () => ({
            user,
            isAuthed,
            setSession: ({ token, user }) => {
                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(user));
                setUser(user);
            },
            logout: () => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setUser(null);
            },
        }),
        [user, isAuthed]
    );

    return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthCtx);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}