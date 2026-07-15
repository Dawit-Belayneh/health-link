import "./Sidebar.css";
import { NavLink } from "react-router-dom";

import {
    LayoutDashboard,
    User,
    FileText,
    CalendarDays,
    Pill,
    HeartPulse,
    Bell,
    Settings,
    LogOut
} from "lucide-react";

function Sidebar() {

    return (

        <aside className="sidebar">

            <div className="sidebar-logo">

                <div className="logo-circle">
                    🏥
                </div>

                <div>
                    <h2>HealthLink</h2>
                    <p>Patient Portal</p>
                </div>

            </div>

            <nav className="sidebar-menu">

                <NavLink to="/patient/dashboard" className="menu-link">
                    <LayoutDashboard size={22} />
                    <span>Dashboard</span>
                </NavLink>

                <NavLink to="/profile" className="menu-link">
                    <User size={22} />
                    <span>My Profile</span>
                </NavLink>

                <NavLink to="/medical-records" className="menu-link">
                    <FileText size={22} />
                    <span>Medical Records</span>
                </NavLink>

                <NavLink to="/appointments" className="menu-link">
                    <CalendarDays size={22} />
                    <span>Appointments</span>
                </NavLink>

                <NavLink to="/medications" className="menu-link">
                    <Pill size={22} />
                    <span>Medications</span>
                </NavLink>

                <NavLink to="/health" className="menu-link">
                    <HeartPulse size={22} />
                    <span>Health Status</span>
                </NavLink>

                <NavLink to="/notifications" className="menu-link">
                    <Bell size={22} />
                    <span>Notifications</span>
                </NavLink>

                <NavLink to="/settings" className="menu-link">
                    <Settings size={22} />
                    <span>Settings</span>
                </NavLink>

            </nav>

            <div className="sidebar-bottom">

                <button className="logout-btn">

                    <LogOut size={20} />

                    Logout

                </button>

            </div>

        </aside>

    );

}

export default Sidebar;