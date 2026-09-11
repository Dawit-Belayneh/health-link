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

    const firstName = patient?.user_details?.first_name || patient?.user_details?.username || "User";
    const fullName = patient?.user_details?.full_name || patient?.user_details?.username || "Patient";

    return (

        <header className="topbar">

            <div className="topbar-left">

                <button className="menu-btn" onClick={onToggleSidebar} aria-label="Toggle navigation">

                    <Menu size={24} />

                </button>

                <div>

                    <h2>{greeting}, {firstName} 👋</h2>

                    <p>
                        Stay healthy. Your medical information is always available.
                    </p>

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
                        placeholder="Search appointments, doctors..."
                    />

                </div>

                <button className="notification-btn">

                    <Bell size={22} />

                    <span className="badge">
                        3
                    </span>

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

                        <span>Patient</span>

                    </div>

                    <ChevronDown size={18} />

                </div>

            </div>

        </header>

    );

}

export default Topbar;