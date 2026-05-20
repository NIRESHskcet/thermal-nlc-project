import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../components/common/LoadingSpinner";
import AlertMessage from "../components/common/AlertMessage";
import { employeeService } from "../services/employeeService";
import { stationService } from "../services/stationService";
import { unitService } from "../services/unitService";
import { shiftService } from "../services/shiftService";
import { employeeShiftService } from "../services/employeeShiftService";
import { usersService } from "../services/usersService";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../utils/errorUtils";
import { getNavItemsForRole } from "../utils/roleConfig";

const MODULE_LINKS = [
    { path: "/employees", label: "Employees", key: "employees" },
    { path: "/stations", label: "Stations", key: "stations" },
    { path: "/units", label: "Units", key: "units" },
    { path: "/shifts", label: "Shifts", key: "shifts" },
    { path: "/employee-shifts", label: "Employee Shifts", key: "employeeShifts" },
    { path: "/users", label: "Users", key: "users" },
];

function DashboardPage() {
    const { user } = useAuth();
    const visibleModules = getNavItemsForRole(user?.role).filter((n) => n.to !== "/profile");
    const [counts, setCounts] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError("");
                const [emp, st, un, sh, es, us] = await Promise.all([
                    employeeService.getAll(),
                    stationService.getAll(),
                    unitService.getAll(),
                    shiftService.getAll(),
                    employeeShiftService.getAll(),
                    usersService.getAll(),
                ]);
                setCounts({
                    employees: emp.data.length,
                    stations: st.data.length,
                    units: un.data.length,
                    shifts: sh.data.length,
                    employeeShifts: es.data.length,
                    users: us.data.length,
                });
            } catch (err) {
                setError(getErrorMessage(err));
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) {
        return <LoadingSpinner message="Loading dashboard..." />;
    }

    return (
        <div className="fade-in-up">
            <h2 className="admin-page-title mb-1">Dashboard</h2>
            <p className="text-muted mb-4">Overview of thermal plant operations data</p>

            <AlertMessage message={error} onClose={() => setError("")} />

            <div className="row g-3">
                {MODULE_LINKS.filter((m) => visibleModules.some((v) => v.to === m.path)).map((mod, index) => (
                    <div key={mod.key} className={`col-sm-6 col-lg-4 fade-in-up stagger-${(index % 3) + 1}`}>
                        <Link to={mod.path} className="text-decoration-none">
                            <div className="card dashboard-card h-100">
                                <div className="card-body">
                                    <h6 className="text-muted text-uppercase small mb-2">{mod.label}</h6>
                                    <div className="dashboard-stat">{counts[mod.key] ?? 0}</div>
                                    <span className="dashboard-link small">View module</span>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DashboardPage;
