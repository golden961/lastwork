import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { AppShell } from "../layout/AppShell";
import { apiFetch } from "../api/http";
import { storage } from "../utils/storage";

export function LoginPage() {
    const nav = useNavigate();
    const { register, handleSubmit, formState: { isSubmitting } } = useForm({
        defaultValues: { login: "", password: "" },
    });

    async function onSubmit(values) {
        try {
            const data = await apiFetch("/api/auth/login", { method: "POST", body: values });
            storage.setUserToken(data.token);
            toast.success("Вход выполнен");
            nav("/profile");
        } catch (e) {
            toast.error(e.message);
        }
    }

    return (
        <AppShell title="Вход">
            <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <div className="text-sm font-medium mb-1">Логин</div>
                    <input className="inp" {...register("login")} placeholder="user123" />
                </div>
                <div>
                    <div className="text-sm font-medium mb-1">Пароль</div>
                    <input className="inp" type="password" {...register("password")} placeholder="********" />
                </div>

                <button disabled={isSubmitting} className="w-full rounded-xl bg-slate-900 text-white py-2 font-medium disabled:opacity-50">
                    Войти
                </button>

                <div className="text-sm text-center text-slate-600">
                    Еще не зарегистрированы?{" "}
                    <Link className="text-slate-900 underline" to="/register">Регистрация</Link>
                </div>

                <div className="text-xs text-center text-slate-500">
                    Админ? <Link className="underline" to="/admin/login">Вход администратора</Link>
                </div>
            </form>

            <style>{`
        .inp{width:100%;border:1px solid #e2e8f0;border-radius:12px;padding:10px 12px;font-size:14px;outline:none}
        .inp:focus{border-color:#0f172a;box-shadow:0 0 0 3px rgba(15,23,42,.08)}
      `}</style>
        </AppShell>
    );
}