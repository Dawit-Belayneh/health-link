import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
    return (
        <aside className="sidebar">

            <div className="sidebar-logo">
                <h2>🏥 HealthLink</h2>
                <p>Patient Portal</p>
            </div>

            <nav className="sidebar-menu">

                <NavLink
                    to="/patient/dashboard"
                    className={({ isActive }) =>
                        isActive ? "menu-item active" : "menu-item"
                    }
                >
                    🏠 <span>Dashboard</span>
                </NavLink>

                <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                        isActive ? "menu-item active" : "menu-item"
                    }
                >
                    👤 <span>My Profile</span>
                </NavLink>

                <NavLink
                    to="/medical-records"
                    className={({ isActive }) =>
                        isActive ? "menu-item active" : "menu-item"
                    }
                >
                    📄 <span>Medical Records</span>
                </NavLink>

                <NavLink
                    to="/appointments"
                    className={({ isActive }) =>
                        isActive ? "menu-item active" : "menu-item"
                    }
                >
                    📅 <span>Appointments</span>
                </NavLink>

                <NavLink
                    to="/medications"
                    className={({ isActive }) =>
                        isActive ? "menu-item active" : "menu-item"
                    }
                >
                    💊 <span>Medications</span>
                </NavLink>

                <NavLink
                    to="/emergency"
                    className={({ isActive }) =>
                        isActive ? "menu-item active" : "menu-item"
                    }
                >
                    🚑 <span>Emergency Contact</span>
                </NavLink>

                <NavLink
                    to="/settings"
                    className={({ isActive }) =>
                        isActive ? "menu-item active" : "menu-item"
                    }
                >
                    ⚙️ <span>Settings</span>
                </NavLink>

            </nav>

            <div className="sidebar-footer">

                <button className="logout-btn">
                    🚪 Logout
                </button>

            </div>

        </aside>
    );
}

export default Sidebar;