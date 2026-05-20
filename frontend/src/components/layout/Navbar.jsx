import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getNavItemsForRole } from "../../utils/roleConfig";

function Navbar({ title }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const navItems = getNavItemsForRole(user?.role);

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    return (
        <header className="navbar navbar-expand-lg bg-body border-bottom sticky-top">
            <div className="container-fluid gap-3">
                <span className="navbar-brand mb-0 h1">Thermal NLC</span>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#adminTopNav"
                    aria-controls="adminTopNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon" />
                </button>

                <div className="collapse navbar-collapse" id="adminTopNav">
                    <nav className="d-flex flex-wrap gap-2 my-3 my-lg-0">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.end}
                                className={({ isActive }) =>
                                    `btn btn-sm ${isActive ? "btn-secondary" : "btn-outline-secondary"}`
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>
                </div>

                <div className="d-flex flex-wrap gap-2 align-items-center ms-lg-auto">
                    <span className="small text-muted d-none d-xl-inline">{title}</span>
                    <span className="badge text-bg-light border">{user?.role}</span>
                <button
                    type="button"
                    className="btn btn-sm btn-link text-decoration-none"
                    onClick={() => navigate("/profile")}
                >
                    {user?.username}
                </button>
                <button type="button" className="btn btn-outline-secondary btn-sm" onClick={handleLogout}>
                    Logout
                </button>
                </div>
            </div>
        </header>
    );
}

export default Navbar;
