import "./WelcomeBanner.css";
import { useNavigate } from "react-router-dom";
import {
    CalendarDays,
    HeartPulse,
    Activity,
    ArrowRight
} from "lucide-react";

function WelcomeBanner({ patient, records = [], upcomingApt, latestVitals }) {
    const navigate = useNavigate();
    const hour = new Date().getHours();

    let greeting = "Good Evening";
    if (hour < 12) greeting = "Good Morning";
    else if (hour < 18) greeting = "Good Afternoon";

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

    const fullName = isDoctor
        ? `Dr. ${user?.full_name || user?.username || "Doctor"}`
        : isAdmin
        ? (user?.full_name || user?.username || "Administrator")
        : (patient?.user_details?.full_name || user?.full_name || user?.username || "Patient");

    const lastRecord = records.length > 0 ? records[0] : null;
    const lastCheckupDate = lastRecord?.date || lastRecord?.visit_date
        ? new Date(lastRecord.date || lastRecord.visit_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        : "None Recorded";

    // Next appointment info
    let nextVisitText = "No Upcoming Visits";
    if (upcomingApt) {
        const aptDate = new Date(upcomingApt.date);
        const dayStr = isNaN(aptDate.getTime())
            ? upcomingApt.date
            : aptDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
        nextVisitText = `${dayStr} • ${upcomingApt.time}`;
    }

    // Dynamic health score based on real vitals
    let healthScore = 94;
    let healthStatus = "Optimal Condition";
    if (latestVitals) {
        if (latestVitals.systolic > 135 || latestVitals.diastolic > 88) healthScore -= 8;
        if (latestVitals.heart_rate > 90 || latestVitals.heart_rate < 55) healthScore -= 6;
        if (latestVitals.oxygen_level < 95) healthScore -= 10;
        if (healthScore < 80) healthStatus = "Needs Attention";
        else if (healthScore < 90) healthStatus = "Good Condition";
    }

    if (isDoctor) {
        return (
            <section className="welcome-banner">
                <div className="welcome-left">
                    <span className="welcome-tag">
                        🩺 {greeting}
                    </span>

                    <h1>
                        Welcome to Clinical Hub,
                        <br />
                        {fullName}
                    </h1>

                    <p>
                        Patient privacy is safeguarded. You have access exclusively to patients who have granted active permission to share their health vitals and medical records.
                    </p>

                    <div className="banner-buttons">
                        <button className="primary-btn" onClick={() => navigate("/notifications")}>
                            Notifications & Approvals
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </div>

                <div className="welcome-right">
                    <div className="health-card">
                        <div className="health-icon">
                            <HeartPulse size={34} />
                        </div>
                        <h3>Security Protocol</h3>
                        <h1>Active</h1>
                        <p>Permission-Gated Data</p>
                    </div>

                    <div className="mini-card">
                        <CalendarDays size={22} />
                        <div>
                            <h4>Hospital</h4>
                            <p>{user?.hospital_name || "Partner Health System"}</p>
                        </div>
                    </div>

                    <div className="mini-card">
                        <Activity size={22} />
                        <div>
                            <h4>Specialization</h4>
                            <p>{user?.specialization || "Clinical Practice"}</p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (isAdmin) {
        return (
            <section className="welcome-banner">
                <div className="welcome-left">
                    <span className="welcome-tag">
                        🏥 {greeting}
                    </span>

                    <h1>
                        Hospital Admin Console,
                        <br />
                        {fullName}
                    </h1>

                    <p>
                        Provision doctor credentials, verify staff certifications, and manage clinical accounts across departments.
                    </p>
                </div>

                <div className="welcome-right">
                    <div className="health-card">
                        <div className="health-icon">
                            <Activity size={34} />
                        </div>
                        <h3>System Status</h3>
                        <h1>Active</h1>
                        <p>Credentials Enforced</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="welcome-banner">
            <div className="welcome-left">
                <span className="welcome-tag">
                    👋 {greeting}
                </span>

                <h1>
                    Welcome back,
                    <br />
                    {fullName}
                </h1>

                <p>
                    Your health journey continues today. Review your real clinical appointments, active prescriptions, and medical history.
                </p>

                <div className="banner-buttons">
                    <button className="primary-btn" onClick={() => navigate("/medical-records")}>
                        View Medical Records ({records.length})
                        <ArrowRight size={18} />
                    </button>

                    <button className="secondary-btn" onClick={() => navigate("/appointments")}>
                        Book Appointment
                    </button>
                </div>
            </div>

            <div className="welcome-right">
                <div
                    className="health-card"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/health")}
                    title="View Health Status"
                >
                    <div className="health-icon">
                        <HeartPulse size={34} />
                    </div>

                    <h3>Health Score</h3>
                    <h1>{healthScore}%</h1>
                    <p>{healthStatus}</p>
                </div>

                <div
                    className="mini-card"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/appointments")}
                    title="View Appointments"
                >
                    <CalendarDays size={22} />
                    <div>
                        <h4>Next Visit</h4>
                        <p>{nextVisitText}</p>
                    </div>
                </div>

                <div
                    className="mini-card"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/medical-records")}
                    title="View Records"
                >
                    <Activity size={22} />
                    <div>
                        <h4>Last Checkup</h4>
                        <p>{lastCheckupDate}</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default WelcomeBanner;