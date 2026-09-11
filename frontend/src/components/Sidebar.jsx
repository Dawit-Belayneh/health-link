import "./Sidebar.css";
import { NavLink, useNavigate } from "react-router-dom";

import {
    LayoutDashboard,
    User,
    FileText,
    CalendarDays,
    Pill,
    HeartPulse,
    Bell,
    Settings,
    LogOut,
    X
} from "lucide-react";

function Sidebar({ isOpen = false, onClose }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user");
        onClose?.();
        navigate("/login");
    };

    const handleLinkClick = () => {
        onClose?.();
    };

    return (
        <>
            {isOpen && (
                <div
                    className="sidebar-backdrop"
                    onClick={onClose}
                    aria-label="Close sidebar"
                />
            )}

            <aside className={`sidebar ${isOpen ? "open" : ""}`}>
                <div className="sidebar-logo">
                    <div className="logo-circle">
                        🏥
                    </div>

                    <div className="logo-text">
                        <h2>HealthLink</h2>
                        <p>Patient Portal</p>
                    </div>

                    <button className="sidebar-close-btn" onClick={onClose} aria-label="Close menu">
                        <X size={20} />
                    </button>
                </div>

                <nav className="sidebar-menu">
                    <NavLink to="/patient/dashboard" className="menu-link" onClick={handleLinkClick}>
                        <LayoutDashboard size={22} />
                        <span>Dashboard</span>
                    </NavLink>

                    <NavLink to="/profile" className="menu-link" onClick={handleLinkClick}>
                        <User size={22} />
                        <span>My Profile</span>
                    </NavLink>

                    <NavLink to="/medical-records" className="menu-link" onClick={handleLinkClick}>
                        <FileText size={22} />
                        <span>Medical Records</span>
                    </NavLink>

                    <NavLink to="/appointments" className="menu-link" onClick={handleLinkClick}>
                        <CalendarDays size={22} />
                        <span>Appointments</span>
                    </NavLink>

                    <NavLink to="/medications" className="menu-link" onClick={handleLinkClick}>
                        <Pill size={22} />
                        <span>Medications</span>
                    </NavLink>

                    <NavLink to="/health" className="menu-link" onClick={handleLinkClick}>
                        <HeartPulse size={22} />
                        <span>Health Status</span>
                    </NavLink>

                    <NavLink to="/notifications" className="menu-link" onClick={handleLinkClick}>
                        <Bell size={22} />
                        <span>Notifications</span>
                    </NavLink>

                    <NavLink to="/settings" className="menu-link" onClick={handleLinkClick}>
                        <Settings size={22} />
                        <span>Settings</span>
                    </NavLink>
                </nav>

            <div className="sidebar-bottom">

                <button className="logout-btn" onClick={handleLogout}>

                    <LogOut size={20} />

                    Logout

                </button>

            </div>

        </aside>
        </>
    );

}

export default Sidebar;