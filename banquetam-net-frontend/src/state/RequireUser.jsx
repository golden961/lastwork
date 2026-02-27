import { Navigate } from "react-router-dom";
import { useAuth } from "./auth.jsx";

export default function RequireUser({ children }) {
    const { isAuthed } = useAuth();
    if (!isAuthed) return <Navigate to="/login" replace />;
    return children;
}