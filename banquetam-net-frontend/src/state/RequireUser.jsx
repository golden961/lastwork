import { Navigate } from "react-router-dom";
import { useAuth } from "./auth.jsx";

export default function RequireUser({ children }) {
    const { userToken } = useAuth();
    if (!userToken) return <Navigate to="/login" replace />;
    return children;
}