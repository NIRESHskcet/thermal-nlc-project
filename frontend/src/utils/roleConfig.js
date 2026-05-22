/** Role-based route and write permissions */

export const ROLES = {
    ADMIN: "ADMIN",
    HR: "HR",
    OPERATOR: "OPERATOR",
    ENGINEER: "ENGINEER",
    SUPERVISOR: "SUPERVISOR",
    TECHNICIAN: "TECHNICIAN",
    SAFETY_OFFICER: "SAFETY_OFFICER",
};

/** Paths each role may visit */
export const ROUTE_ACCESS = {
    "/": [ROLES.ADMIN, ROLES.HR, ROLES.OPERATOR, ROLES.ENGINEER, ROLES.SUPERVISOR, ROLES.TECHNICIAN, ROLES.SAFETY_OFFICER],
    "/employees": [ROLES.ADMIN, ROLES.HR],
    "/stations": [ROLES.ADMIN],
    "/units": [ROLES.ADMIN],
    "/shifts": [ROLES.ADMIN, ROLES.OPERATOR, ROLES.ENGINEER, ROLES.SUPERVISOR, ROLES.TECHNICIAN, ROLES.SAFETY_OFFICER],
    "/employee-shifts": [ROLES.ADMIN, ROLES.HR, ROLES.OPERATOR, ROLES.ENGINEER, ROLES.SUPERVISOR, ROLES.TECHNICIAN, ROLES.SAFETY_OFFICER],
    "/users": [ROLES.ADMIN],
    "/reports": [ROLES.ADMIN, ROLES.HR],
    "/profile": [ROLES.ADMIN, ROLES.HR, ROLES.OPERATOR, ROLES.ENGINEER, ROLES.SUPERVISOR, ROLES.TECHNICIAN, ROLES.SAFETY_OFFICER],
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
    if ([ROLES.OPERATOR, ROLES.ENGINEER, ROLES.SUPERVISOR, ROLES.TECHNICIAN, ROLES.SAFETY_OFFICER].includes(role)) return "/employee-shifts";
    if (role === ROLES.HR) return "/employees";
    return "/";
}

export function getNavItemsForRole(role) {
    return NAV_ITEMS.filter((item) => canAccessRoute(role, item.to));
}
