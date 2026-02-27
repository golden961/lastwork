import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import MainHeader from "../components/MainHeader.jsx";
import { registerRequest } from "../api/auth.js";

const schema = yup.object({
    login: yup
        .string()
        .required("Логин обязателен")
        .matches(/^[A-Za-z0-9]+$/, "Только латиница и цифры")
        .min(6, "Минимум 6 символов"),
    password: yup.string().required("Пароль обязателен").min(8, "Минимум 8 символов"),
    fullName: yup.string().required("ФИО обязательно"),
    phone: yup.string().required("Телефон обязателен"),
    email: yup.string().required("Email обязателен").email("Некорректный email"),
});

export default function RegisterPage() {
    const nav = useNavigate();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({ resolver: yupResolver(schema), mode: "onBlur" });

    async function onSubmit(values) {
        try {
            await registerRequest(values);
            toast.success("Регистрация успешна");
            nav("/login");
        } catch (e) {
            const data = e?.response?.data;

            // если бэк отдаёт ошибки по полям: { errors: { login: "...", email: "..." } }
            if (data?.errors && typeof data.errors === "object") {
                Object.entries(data.errors).forEach(([field, message]) => {
                    setError(field, { type: "server", message: String(message) });
                });
                return;
            }

            // если 409 (уникальность логина)
            if (e?.response?.status === 409) {
                setError("login", { type: "server", message: "Логин уже занят" });
                return;
            }

            toast.error(data?.message || "Ошибка регистрации");
        }
    }

    return (
        <div className="mobile-shell">
            <MainHeader />

            <div className="page">
                <div className="section">
                    <div className="sectionTitle">Регистрация</div>
                    <div className="sectionSub">Заполните все поля</div>

                    <form className="mt-4 space-y-3" onSubmit={handleSubmit(onSubmit)}>
                        <Field label="Логин" error={errors.login?.message}>
                            <input className="field" placeholder="latin+digits, min 6" {...register("login")} />
                        </Field>

                        <Field label="Пароль" error={errors.password?.message}>
                            <input className="field" type="password" placeholder="min 8" {...register("password")} />
                        </Field>

                        <Field label="ФИО" error={errors.fullName?.message}>
                            <input className="field" placeholder="Иванов Иван Иванович" {...register("fullName")} />
                        </Field>

                        <Field label="Телефон" error={errors.phone?.message}>
                            <input className="field" placeholder="+996..." {...register("phone")} />
                        </Field>

                        <Field label="E-mail" error={errors.email?.message}>
                            <input className="field" placeholder="mail@example.com" {...register("email")} />
                        </Field>

                        <button className="btnPrimary" disabled={isSubmitting} type="submit">
                            Создать аккаунт
                        </button>

                        <button className="btnGhost" type="button" onClick={() => nav("/login")}>
                            Уже есть аккаунт? Войти
                        </button>
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