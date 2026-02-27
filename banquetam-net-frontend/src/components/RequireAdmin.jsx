import { Navigate } from "react-router-dom";
import { storage } from "../utils/storage";

export function RequireAdmin({ children }) {
    const token = storage.getAdminToken();
    if (!token) return <Navigate to="/admin/login" replace />;
    return children;
}