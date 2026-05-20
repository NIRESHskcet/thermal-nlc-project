/** Role-based route and write permissions */

export const ROLES = {
    ADMIN: "ADMIN",
    HR: "HR",
    OPERATOR: "OPERATOR",
};

/** Paths each role may visit */
export const ROUTE_ACCESS = {
    "/": [ROLES.ADMIN, ROLES.HR, ROLES.OPERATOR],
    "/employees": [ROLES.ADMIN, ROLES.HR],
    "/stations": [ROLES.ADMIN],
    "/units": [ROLES.ADMIN],
    "/shifts": [ROLES.ADMIN, ROLES.OPERATOR],
    "/employee-shifts": [ROLES.ADMIN, ROLES.HR, ROLES.OPERATOR],
    "/users": [ROLES.ADMIN],
    "/reports": [ROLES.ADMIN, ROLES.HR],
    "/profile": [ROLES.ADMIN, ROLES.HR, ROLES.OPERATOR],
};

/** Paths where create/update/delete is allowed */
export const WRITE_ACCESS = {
    "/employees": [ROLES.ADMIN, ROLES.HR],
    "/stations": [ROLES.ADMIN],
    "/units": [ROLES.ADMIN],
    "/shifts": [ROLES.ADMIN],
    "/employee-shifts": [ROLES.ADMIN, ROLES.HR],
    "/users": [ROLES.ADMIN],
};

export const NAV_ITEMS = [
    { to: "/", label: "Dashboard", end: true },
    { to: "/employees", label: "Employees" },
    { to: "/stations", label: "Stations" },
    { to: "/units", label: "Units" },
    { to: "/shifts", label: "Shifts" },
    { to: "/employee-shifts", label: "Employee Shifts" },
    { to: "/users", label: "Users" },
    { to: "/reports", label: "Reports" },
    { to: "/profile", label: "My Profile" },
];

export function canAccessRoute(role, path) {
    const allowed = ROUTE_ACCESS[path];
    return allowed ? allowed.includes(role) : false;
}

export function canWrite(role, path) {
    const allowed = WRITE_ACCESS[path];
    return allowed ? allowed.includes(role) : false;
}

export function getDefaultRoute(role) {
    if (role === ROLES.OPERATOR) return "/employee-shifts";
    if (role === ROLES.HR) return "/employees";
    return "/";
}

export function getNavItemsForRole(role) {
    return NAV_ITEMS.filter((item) => canAccessRoute(role, item.to));
}
