import { createContext, useContext, useMemo, useState } from "react";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
    const [userToken, setUserToken] = useState(localStorage.getItem("userToken") || "");
    const [adminToken, setAdminToken] = useState(localStorage.getItem("adminToken") || "");

    const value = useMemo(() => ({
        userToken,
        adminToken,
        setUserToken: (t) => {
            setUserToken(t);
            if (t) localStorage.setItem("userToken", t);
            else localStorage.removeItem("userToken");
        },
        setAdminToken: (t) => {
            setAdminToken(t);
            if (t) localStorage.setItem("adminToken", t);
            else localStorage.removeItem("adminToken");
        },
        logoutUser: () => {
            setUserToken("");
            localStorage.removeItem("userToken");
        },
        logoutAdmin: () => {
            setAdminToken("");
            localStorage.removeItem("adminToken");
        },
    }), [userToken, adminToken]);

    return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthCtx);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}