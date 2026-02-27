import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./state/auth.jsx";
import RequireUser from "./state/RequireUser.jsx";

import HomePage from "./pages/HomePage.jsx";

import AdminPage from "./pages/AdminPage.jsx";
import {BookingPage} from "./pages/BookingPage.jsx";

import {ProfilePage} from "./pages/ProfilePage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";

export default function App() {
    return (
        <AuthProvider>
            <Toaster position="top-center" />
            <Routes>
                <Route path="/" element={<HomePage />} />

                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />

                <Route
                    path="/booking"
                    element={
                        <RequireUser>
                            <BookingPage />
                        </RequireUser>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <RequireUser>
                            <ProfilePage />
                        </RequireUser>
                    }
                />

                {/* Админка: одна страница, если не вошёл — покажет форму входа */}
                <Route path="/admin" element={<AdminPage />} />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </AuthProvider>
    );
}