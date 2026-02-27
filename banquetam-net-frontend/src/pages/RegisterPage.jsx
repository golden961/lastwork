import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { AppShell } from "../layout/AppShell";
import { apiFetch } from "../api/http";

const schema = z.object({
    login: z.string().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, "Логин: латиница+цифры, минимум 6"),
    password: z.string().min(8, "Пароль: минимум 8 символов"),
    fullName: z.string().min(1, "ФИО обязательно"),
    phone: z.string().min(1, "Телефон обязателен"),
    email: z.string().email("Некорректный e-mail"),
});

export function RegisterPage() {
    const nav = useNavigate();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: { login: "", password: "", fullName: "", phone: "", email: "" },
    });

    async function onSubmit(values) {
        try {
            await apiFetch("/api/auth/register", { method: "POST", body: values });
            toast.success("Регистрация успешна");
            nav("/login");
        } catch (e) {
            if (e.status === 409) toast.error("Логин уже занят");
            else toast.error(e.message);
        }
    }

    return (
        <AppShell title="Регистрация">
            <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
                <Field label="Логин" error={errors.login?.message}>
                    <input className="inp" {...register("login")} placeholder="user123" />
                </Field>

                <Field label="Пароль" error={errors.password?.message}>
                    <input className="inp" type="password" {...register("password")} placeholder="минимум 8 символов" />
                </Field>

                <Field label="ФИО" error={errors.fullName?.message}>
                    <input className="inp" {...register("fullName")} placeholder="Иванов Иван Иванович" />
                </Field>

                <Field label="Телефон" error={errors.phone?.message}>
                    <input className="inp" {...register("phone")} placeholder="+996..." />
                </Field>

                <Field label="Email" error={errors.email?.message}>
                    <input className="inp" {...register("email")} placeholder="mail@example.com" />
                </Field>

                <button
                    disabled={isSubmitting}
                    className="w-full rounded-xl bg-slate-900 text-white py-2 font-medium disabled:opacity-50"
                >
                    Создать аккаунт
                </button>

                <div className="text-sm text-center text-slate-600">
                    Уже зарегистрированы?{" "}
                    <Link className="text-slate-900 underline" to="/login">Войти</Link>
                </div>
            </form>

            <StyleHelpers />
        </AppShell>
    );
}

function Field({ label, error, children }) {
    return (
        <div>
            <div className="text-sm font-medium mb-1">{label}</div>
            {children}
            {error ? <div className="text-xs text-red-600 mt-1">{error}</div> : null}
        </div>
    );
}

function StyleHelpers() {
    return (
        <style>{`
      .inp{width:100%;border:1px solid #e2e8f0;border-radius:12px;padding:10px 12px;font-size:14px;outline:none}
      .inp:focus{border-color:#0f172a;box-shadow:0 0 0 3px rgba(15,23,42,.08)}
    `}</style>
    );
}