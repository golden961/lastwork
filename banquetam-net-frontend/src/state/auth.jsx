import { createContext, useContext, useMemo, useState } from "react";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const raw = localStorage.getItem("user");
        return raw ? JSON.parse(raw) : null;
    });

    const isAuthed = !!localStorage.getItem("userToken");

    const value = useMemo(
        () => ({
            user,
            isAuthed,
            setSession: ({ token, user }) => {
                localStorage.setItem("userToken", token);
                localStorage.setItem("user", JSON.stringify(user));
                setUser(user);
            },
            logout: () => {
                localStorage.removeItem("userToken");
                localStorage.removeItem("user");
                setUser(null);
            },
        }),
        [user, isAuthed]
    );

    return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
    const v = useContext(AuthCtx);
    if (!v) throw new Error("useAuth must be inside AuthProvider");
    return v;
}