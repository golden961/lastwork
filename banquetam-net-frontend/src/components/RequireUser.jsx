import { Navigate } from "react-router-dom";
import { storage } from "../utils/storage";

export function RequireUser({ children }) {
    const token = storage.getUserToken();
    if (!token) return <Navigate to="/login" replace />;
    return children;
}