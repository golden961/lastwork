import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import RegisterPage from "./pages/RegisterPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import BookingPage from "./pages/BookingPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";

import { AuthProvider } from "./state/auth.jsx";
import ProtectedRoute from "./state/ProtectedRoute.jsx";
import HomePage from "./pages/HomePage.jsx";

export default function App() {
    return (
        <AuthProvider>
            <div className="mobile-shell">
                <Toaster position="top-center" />
                <Routes>
                    <Route path="/" element={<HomePage />} />

                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/login" element={<LoginPage />} />

                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <ProfilePage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/booking"
                        element={
                            <ProtectedRoute>
                                <BookingPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route path="/admin" element={<AdminPage />} />

                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </div>
        </AuthProvider>
    );
}