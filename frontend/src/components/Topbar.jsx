import { useNavigate } from "react-router-dom";
import "./Topbar.css";
import {
    Menu,
    Search,
    Bell,
    ChevronDown
} from "lucide-react";

function Topbar({ patient, onToggleSidebar }) {
    const navigate = useNavigate();

    const today = new Date();

    const hour = today.getHours();

    let greeting = "Good Evening";

    if (hour < 12) {
        greeting = "Good Morning";
    } else if (hour < 18) {
        greeting = "Good Afternoon";
    }

    const date = today.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    const userStr = localStorage.getItem("user");
    let user = null;
    try {
        user = userStr ? JSON.parse(userStr) : null;
    } catch {
        user = null;
    }

    const role = user?.role || "patient";
    const isDoctor = role === "doctor" || role === "hospital_staff";
    const isAdmin = role === "admin" || user?.is_admin;

    const firstName = isDoctor 
        ? `Dr. ${user?.first_name || user?.username || "Doctor"}`
        : isAdmin
        ? (user?.first_name || "Admin")
        : (patient?.user_details?.first_name || user?.first_name || user?.username || "User");

    const fullName = isDoctor
        ? `Dr. ${user?.full_name || user?.username || "Doctor"}`
        : isAdmin
        ? (user?.full_name || user?.username || "Hospital Administrator")
        : (patient?.user_details?.full_name || user?.full_name || user?.username || "Patient");

    const roleDisplay = isDoctor
        ? (user?.specialization || "Medical Doctor")
        : isAdmin
        ? "Hospital Administrator"
        : "Patient";

    const subtitle = isDoctor
        ? "Review authorized patient records, conduct consultations, and manage appointments."
        : isAdmin
        ? "Hospital administration center — manage staff, doctors, and facilities."
        : "Stay healthy. Your medical information is always available.";

    return (
        <header className="topbar">
            <div className="topbar-left">
                <button className="menu-btn" onClick={onToggleSidebar} aria-label="Toggle navigation">
                    <Menu size={24} />
                </button>

                <div>
                    <h2>{greeting}, {firstName} 👋</h2>
                    <p>{subtitle}</p>
                </div>
            </div>

            <div className="topbar-right">
                <div className="search-box">
                    <Search
                        size={18}
                        className="search-icon"
                    />
                    <input
                        type="text"
                        placeholder={isDoctor ? "Search patients, records..." : "Search appointments, doctors..."}
                    />
                </div>

                <button 
                    className="notification-btn" 
                    onClick={() => navigate("/notifications")}
                    title="View Notifications"
                >
                    <Bell size={22} />
                </button>

                <div className="date-box">
                    {date}
                </div>

                <div
                    className="profile"
                    onClick={() => navigate("/profile")}
                    title="View & Edit Profile"
                    role="button"
                    tabIndex={0}
                >
                    <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=2563eb&color=fff`}
                        alt="profile"
                    />

                    <div>
                        <h4>{fullName}</h4>
                        <span>{roleDisplay}</span>
                    </div>

                    <ChevronDown size={18} />
                </div>
            </div>
        </header>
    );
}

export default Topbar;