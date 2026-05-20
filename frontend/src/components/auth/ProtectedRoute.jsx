import { Navigate, Outlet } from "react-router-dom";
import LoadingSpinner from "../common/LoadingSpinner";
import { useAuth } from "../../context/AuthContext";

/**
 * Blocks dashboard routes until a valid Users-table session exists.
 */
function ProtectedRoute() {
    const { user, bootstrapping } = useAuth();

    if (bootstrapping) {
        return (
            <div className="auth-bootstrapping">
                <LoadingSpinner message="Checking session..." />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;
