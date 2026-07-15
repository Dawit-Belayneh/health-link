import "./Topbar.css";
import {
    Menu,
    Search,
    Bell,
    ChevronDown
} from "lucide-react";

function Topbar() {

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

    return (

        <header className="topbar">

            <div className="topbar-left">

                <button className="menu-btn">

                    <Menu size={24} />

                </button>

                <div>

                    <h2>{greeting}, Dawit 👋</h2>

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

                <div className="profile">

                    <img
                        src="https://i.pravatar.cc/100"
                        alt="profile"
                    />

                    <div>

                        <h4>Dawit Belayneh</h4>

                        <span>Patient</span>

                    </div>

                    <ChevronDown size={18} />

                </div>

            </div>

        </header>

    );

}

export default Topbar;