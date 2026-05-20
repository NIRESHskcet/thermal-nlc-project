import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { canAccessRoute, canWrite } from "../utils/roleConfig";

export function usePermissions() {
    const { user } = useAuth();
    const location = useLocation();
    const role = user?.role;

    return useMemo(
        () => ({
            role,
            canAccess: (path) => (role ? canAccessRoute(role, path) : false),
            canWrite: (path = location.pathname) => (role ? canWrite(role, path) : false),
            isReadOnly: !(role && canWrite(role, location.pathname)),
            employeeId: user?.employeeId,
        }),
        [role, location.pathname, user?.employeeId]
    );
}
