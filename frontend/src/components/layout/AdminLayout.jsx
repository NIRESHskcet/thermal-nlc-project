import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import "../../styles/admin.css";

const PAGE_TITLES = {
    "/": "Dashboard",
    "/employees": "Employees",
    "/stations": "Stations",
    "/units": "Units",
    "/shifts": "Shifts",
    "/employee-shifts": "Employee Shifts",
    "/users": "Users",
    "/reports": "Reports",
    "/profile": "My Profile",
};

function AdminLayout() {
    const location = useLocation();

    const pageTitle = PAGE_TITLES[location.pathname] || "Admin";

    return (
        <div className="admin-shell">
            <Navbar title={pageTitle} />
            <main className="admin-content container-fluid py-4">
                <Outlet />
            </main>
        </div>
    );
}

export default AdminLayout;
