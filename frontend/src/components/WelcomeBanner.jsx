import "./WelcomeBanner.css";
import {
    CalendarDays,
    HeartPulse,
    Activity,
    ArrowRight
} from "lucide-react";

function WelcomeBanner() {

    const hour = new Date().getHours();

    let greeting = "Good Evening";

    if (hour < 12) greeting = "Good Morning";
    else if (hour < 18) greeting = "Good Afternoon";

    return (

        <section className="welcome-banner">

            <div className="welcome-left">

                <span className="welcome-tag">
                    👋 {greeting}
                </span>

                <h1>
                    Welcome back,
                    <br />
                    Dawit Belayneh
                </h1>

                <p>
                    Your health journey continues today.
                    Review your appointments, prescriptions,
                    and medical history anytime.
                </p>

                <div className="banner-buttons">

                    <button className="primary-btn">

                        View Medical Records

                        <ArrowRight size={18} />

                    </button>

                    <button className="secondary-btn">

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

                    <h1>92%</h1>

                    <p>Excellent Condition</p>

                </div>

                <div className="mini-card">

                    <CalendarDays size={22} />

                    <div>

                        <h4>Next Visit</h4>

                        <p>Tomorrow • 10:30 AM</p>

                    </div>

                </div>

                <div className="mini-card">

                    <Activity size={22} />

                    <div>

                        <h4>Last Checkup</h4>

                        <p>7 Days Ago</p>

                    </div>

                </div>

            </div>

        </section>

    );

}

export default WelcomeBanner;