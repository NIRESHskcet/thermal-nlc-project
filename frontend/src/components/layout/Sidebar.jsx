import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getNavItemsForRole } from "../../utils/roleConfig";

function Sidebar({ collapsed, onNavigate }) {
    const { user } = useAuth();
    const navItems = getNavItemsForRole(user?.role);

    return (
        <aside className={`admin-sidebar ${collapsed ? "collapsed" : ""}`}>
            <div className="admin-sidebar-brand">
                <span className="brand-mark">TN</span>
                {!collapsed && (
                    <div>
                        <strong>Thermal NLC</strong>
                        <small className="d-block">Plant Management</small>
                    </div>
                )}
            </div>
            <nav className="admin-sidebar-nav">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        className={({ isActive }) =>
                            `admin-nav-link${isActive ? " active" : ""}`
                        }
                        onClick={onNavigate}
                    >
                        <span className="nav-dot" aria-hidden="true" />
                        {!collapsed && <span>{item.label}</span>}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}

export default Sidebar;
