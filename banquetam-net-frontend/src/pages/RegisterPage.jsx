import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";

import AppHeader from "../components/AppHeader.jsx";
import HeroTop from "../components/HeroTop.jsx";
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";
import { api } from "../api/index.js";

const schema = yup.object({
    login: yup
        .string()
        .required("Логин обязателен")
        .matches(/^[A-Za-z0-9]+$/, "Только латиница и цифры")
        .min(6, "Минимум 6 символов"),
    password: yup.string().required("Пароль обязателен").min(8, "Минимум 8 символов"),
    fullName: yup.string().required("ФИО обязательно"),
    phone: yup
        .string()
        .required("Телефон обязателен")
        .matches(/^\+?\d{10,15}$/, "Введите номер в формате +996... или просто цифры"),
    email: yup.string().required("Email обязателен").email("Некорректный email"),
});

export default function RegisterPage() {
    const nav = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({ resolver: yupResolver(schema), mode: "onBlur" });

    async function onSubmit(values) {
        await api.register(values);
        toast.success("Регистрация успешна");
        nav("/login");
    }

    return (
        <div>
            <AppHeader />
            <HeroTop title="Регистрация" subtitle="Создайте аккаунт для бронирования" />

            <main className="px-4 py-4">
                <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
                    <Input label="Логин" placeholder="latin+digits, min 6" error={errors.login?.message} {...register("login")} />
                    <Input label="Пароль" type="password" placeholder="min 8" error={errors.password?.message} {...register("password")} />
                    <Input label="ФИО" placeholder="Иванов Иван Иванович" error={errors.fullName?.message} {...register("fullName")} />
                    <Input label="Телефон" placeholder="+996..." error={errors.phone?.message} {...register("phone")} />
                    <Input label="E-mail" placeholder="name@mail.com" error={errors.email?.message} {...register("email")} />

                    <Button disabled={isSubmitting} type="submit">
                        Зарегистрироваться
                    </Button>

                    <div className="text-center text-help-12">
                        Уже зарегистрированы? <Link className="text-crimson" to="/login">Войти</Link>
                    </div>

                    {/* соц-блок из zip */}
                    <div className="flex justify-center pt-2">
                        <img src="/social/social.png" alt="social" className="h-7 opacity-90" />
                    </div>
                </form>
            </main>
        </div>
    );
}