import "./WelcomeBanner.css";
import {
    CalendarDays,
    HeartPulse,
    Activity,
    ArrowRight
} from "lucide-react";

function WelcomeBanner({ patient, records = [] }) {

    const hour = new Date().getHours();

    let greeting = "Good Evening";

    if (hour < 12) greeting = "Good Morning";
    else if (hour < 18) greeting = "Good Afternoon";

    const fullName = patient?.user_details?.full_name || patient?.user_details?.username || "Patient";

    const lastRecord = records.length > 0 ? records[0] : null;
    const lastCheckupDate = lastRecord?.date 
        ? new Date(lastRecord.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        : "7 Days Ago";

    const scrollToRecords = () => {
        const table = document.querySelector(".medical-table");
        if (table) {
            table.scrollIntoView({ behavior: "smooth" });
        }
    };

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
                    Your health journey continues today.
                    Review your appointments, prescriptions,
                    and medical history anytime.
                </p>

                <div className="banner-buttons">

                    <button className="primary-btn" onClick={scrollToRecords}>

                        View Medical Records ({records.length})

                        <ArrowRight size={18} />

                    </button>

                    <button className="secondary-btn" onClick={() => alert("Appointment booking system is coming soon!")}>

                        Book Appointment

                    </button>

                </div>

            </div>

            <div className="welcome-right">

                <div className="health-card">

                    <div className="health-icon">
                        <HeartPulse size={34} />
                    </div>

                    <h3>Health Score</h3>

                    <h1>94%</h1>

                    <p>Excellent Condition</p>

                </div>

                <div className="mini-card">

                    <CalendarDays size={22} />

                    <div>

                        <h4>Next Visit</h4>

                        <p>Wednesday • 10:30 AM</p>

                    </div>

                </div>

                <div className="mini-card">

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