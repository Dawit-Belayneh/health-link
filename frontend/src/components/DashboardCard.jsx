import "./DashboardCard.css";
import { useNavigate } from "react-router-dom";
import {
    FileText,
    CalendarCheck2,
    Pill,
    HeartPulse,
    TrendingUp
} from "lucide-react";

function DashboardCards({ records = [], patient, appointments = [], prescriptions = [], latestVitals }) {
    const navigate = useNavigate();

    const totalRecords = records.length;
    const activeAppointments = appointments.filter(a => a.status !== "Cancelled");
    const activePrescriptionsCount = prescriptions.length > 0
        ? prescriptions.length
        : records.filter(r => r.prescription && r.prescription.trim() !== "").length;

    // Calculate real health score
    let healthScore = 94;
    let scoreCondition = "Excellent";
    if (latestVitals) {
        if (latestVitals.systolic > 135 || latestVitals.diastolic > 88) healthScore -= 8;
        if (latestVitals.heart_rate > 90 || latestVitals.heart_rate < 55) healthScore -= 6;
        if (latestVitals.oxygen_level < 95) healthScore -= 10;
        if (healthScore < 80) scoreCondition = "Check Required";
        else if (healthScore < 90) scoreCondition = "Good";
    }

    const cards = [
        {
            id: 1,
            title: "Medical Records",
            value: totalRecords.toString(),
            subtitle: "Clinical Encounters",
            icon: <FileText size={30} />,
            color: "blue",
            change: totalRecords > 0 ? `${totalRecords} Logged` : "No Records",
            path: "/medical-records"
        },
        {
            id: 2,
            title: "Appointments",
            value: activeAppointments.length.toString(),
            subtitle: "Upcoming Consultations",
            icon: <CalendarCheck2 size={30} />,
            color: "green",
            change: activeAppointments.length > 0 ? "Confirmed" : "None Scheduled",
            path: "/appointments"
        },
        {
            id: 3,
            title: "Prescriptions",
            value: activePrescriptionsCount.toString(),
            subtitle: "Active Medications",
            icon: <Pill size={30} />,
            color: "orange",
            change: activePrescriptionsCount > 0 ? "Active Prescriptions" : "None Active",
            path: "/medications"
        },
        {
            id: 4,
            title: "Health Score",
            value: `${healthScore}%`,
            subtitle: scoreCondition,
            icon: <HeartPulse size={30} />,
            color: "red",
            change: "Live Telemetry",
            path: "/health"
        }
    ];

    return (
        <section className="dashboard-cards">
            {cards.map((card) => (
                <div
                    key={card.id}
                    className="card"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(card.path)}
                    title={`Go to ${card.title}`}
                >
                    <div className={`icon ${card.color}`}>
                        {card.icon}
                    </div>

                    <div className="card-content">
                        <h4>{card.title}</h4>
                        <h2>{card.value}</h2>
                        <p>{card.subtitle}</p>
                    </div>

                    <div className="card-footer">
                        <TrendingUp size={16} />
                        <span>{card.change}</span>
                    </div>
                </div>
            ))}
        </section>
    );
}

export default DashboardCards;