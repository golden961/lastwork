import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

import { AppShell } from "../layout/AppShell";
import { apiFetch } from "../api/http";
import { storage } from "../utils/storage";
import { Card, CardBody } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

export function AdminLoginPage() {
    const nav = useNavigate();
    const { register, handleSubmit, formState: { isSubmitting } } = useForm({
        defaultValues: { login: "", password: "" },
    });

    async function onSubmit(values) {
        try {
            const data = await apiFetch("/api/admin/login", { method: "POST", body: values });
            storage.setAdminToken(data.token);
            toast.success("Админ: вход выполнен");
            nav("/admin");
        } catch (e) {
            toast.error(e.message);
        }
    }

    return (
        <AppShell title="Админ-вход" backTo="/login">
            <Card>
                <CardBody className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                        <ShieldCheck size={18} />
                        Панель управления
                    </div>

                    <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <div className="text-xs font-semibold text-slate-700 mb-1">Логин</div>
                            <Input {...register("login")} placeholder="Admin26" />
                        </div>

                        <div>
                            <div className="text-xs font-semibold text-slate-700 mb-1">Пароль</div>
                            <Input type="password" {...register("password")} placeholder="Demo20" />
                        </div>

                        <Button disabled={isSubmitting} className="w-full">
                            {isSubmitting ? "Вход…" : "Войти"}
                        </Button>
                    </form>

                    <div className="text-xs text-slate-500 text-center">
                        Вернуться к пользователю:{" "}
                        <Link className="underline" to="/login">Вход</Link>
                    </div>
                </CardBody>
            </Card>
        </AppShell>
    );
}