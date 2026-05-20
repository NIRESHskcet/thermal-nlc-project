import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { canAccessRoute, getDefaultRoute } from "../../utils/roleConfig";

function RoleRoute() {
    const { user } = useAuth();
    const location = useLocation();

    if (!user?.role) {
        return <Navigate to="/login" replace />;
    }

    if (!canAccessRoute(user.role, location.pathname)) {
        return <Navigate to={getDefaultRoute(user.role)} replace />;
    }

    return <Outlet />;
}

export default RoleRoute;
