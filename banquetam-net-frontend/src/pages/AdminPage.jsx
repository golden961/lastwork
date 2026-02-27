import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../state/auth.jsx";
import { apiFetch } from "../api/http";
import { AppShell } from "../layout/AppShell";
import { Card, CardBody } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import AdminPanelPage from "./AdminPage.jsx";

export default function AdminPage() {
    const { adminToken, setAdminToken, logoutAdmin } = useAuth();
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function onLogin(e) {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await apiFetch("/api/admin/login", { method: "POST", body: { login, password } });
            setAdminToken(data.token);
            toast.success("Админ: вход выполнен");
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    }

    if (adminToken) {
        return <AdminPanelPage onLogout={logoutAdmin} />;
    }

    return (
        <AppShell title="Админ-панель" backTo="/">
            <Card>
                <CardBody className="space-y-3">
                    <div className="text-sm font-semibold">Вход администратора</div>
                    <form className="space-y-3" onSubmit={onLogin}>
                        <div>
                            <div className="text-xs font-semibold text-slate-700 mb-1">Логин</div>
                            <Input value={login} onChange={(e) => setLogin(e.target.value)} placeholder="Admin26" />
                        </div>
                        <div>
                            <div className="text-xs font-semibold text-slate-700 mb-1">Пароль</div>
                            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Demo20" />
                        </div>
                        <Button disabled={loading} className="w-full">
                            {loading ? "Вход…" : "Войти"}
                        </Button>
                    </form>
                </CardBody>
            </Card>
        </AppShell>
    );
}