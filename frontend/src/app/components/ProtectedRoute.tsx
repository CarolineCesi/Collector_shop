import { Navigate, Outlet } from "react-router";
import { useUser } from "../context/UserContext";

export function ProtectedRoute() {
    const { user, loading } = useUser();

    if (loading) {
        return (
            <div className="min-h-screen bg-cyan-950 flex items-center justify-center">
                <div className="w-8 h-8 rounded bg-amber-400 flex items-center justify-center animate-bounce">
                    <span className="font-bold text-cyan-950">C</span>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
