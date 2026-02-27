import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import AppHeader from "../components/AppHeader.jsx";
import HeroTop from "../components/HeroTop.jsx";
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";
import { api } from "../api/index.js";
import { useAuth } from "../state/auth.jsx";

export default function LoginPage() {
    const nav = useNavigate();
    const { setSession } = useAuth();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        defaultValues: { login: "", password: "" },
        mode: "onBlur",
    });

    async function onSubmit(values) {
        const res = await api.login(values);
        setSession({ token: res.token, user: res.user });
        toast.success("Вход выполнен");
        nav("/profile");
    }

    return (
        <div>
            <AppHeader />
            <HeroTop title="Вход" subtitle="Авторизация по логину и паролю" />

            <main className="px-4 py-4">
                <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
                    <Input label="Логин" error={errors.login?.message} {...register("login", { required: "Введите логин" })} />
                    <Input label="Пароль" type="password" error={errors.password?.message} {...register("password", { required: "Введите пароль" })} />

                    <Button disabled={isSubmitting} type="submit">Войти</Button>

                    <div className="text-center text-help-12">
                        Еще не зарегистрированы?{" "}
                        <Link className="text-crimson" to="/register">Регистрация</Link>
                    </div>

                    <div className="flex justify-center pt-2">
                        <img src="/social/soc.png" alt="social" className="h-7 opacity-90" />
                    </div>
                </form>
            </main>
        </div>
    );
}