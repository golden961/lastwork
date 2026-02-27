import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import MainHeader from "../components/MainHeader.jsx";
import { loginRequest } from "../api/auth.js";
import { useAuth } from "../state/auth.jsx";

export default function LoginPage() {
    const nav = useNavigate();
    const { setSession } = useAuth();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({ mode: "onBlur", defaultValues: { login: "", password: "" } });

    async function onSubmit(values) {
        try {
            const res = await loginRequest(values);

            if (!res.token) {
                toast.error("Бэкенд не вернул токен. Проверь формат ответа /auth/login");
                return;
            }

            setSession({ token: res.token, user: res.user });
            toast.success("Вход выполнен");
            nav("/profile");
        } catch (e) {
            const data = e?.response?.data;

            // если бэк отдаёт ошибки по полям
            if (data?.errors && typeof data.errors === "object") {
                Object.entries(data.errors).forEach(([field, message]) => {
                    setError(field, { type: "server", message: String(message) });
                });
                return;
            }

            const msg = data?.message || "Неверный логин или пароль";
            toast.error(msg);
        }
    }

    return (
        <div className="mobile-shell">
            <MainHeader />

            <div className="page">
                <div className="section">
                    <div className="sectionTitle">Вход</div>
                    <div className="sectionSub">Авторизация по логину и паролю</div>

                    <form className="mt-4 space-y-3" onSubmit={handleSubmit(onSubmit)}>
                        <Field label="Логин" error={errors.login?.message}>
                            <input className="field" {...register("login", { required: "Введите логин" })} />
                        </Field>

                        <Field label="Пароль" error={errors.password?.message}>
                            <input className="field" type="password" {...register("password", { required: "Введите пароль" })} />
                        </Field>

                        <button className="btnPrimary" disabled={isSubmitting} type="submit">
                            Войти
                        </button>

                        <div className="btnRow">
                            <button className="btnGhost" type="button" onClick={() => nav("/register")}>
                                Регистрация
                            </button>
                            <button className="btnGhost" type="button" onClick={() => nav("/admin")}>
                                Админка
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

function Field({ label, error, children }) {
    return (
        <label className="block">
            <div className="text-[12px] font-bold text-black/70 mb-1">{label}</div>
            {children}
            {error ? <div className="text-[12px] mt-1 font-bold text-[var(--crimson)]">{error}</div> : null}
        </label>
    );
}