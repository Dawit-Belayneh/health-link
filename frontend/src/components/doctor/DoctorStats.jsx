import { useState, useEffect } from "react";
import "./DoctorStats.css";
import {
    Users,
    CalendarDays,
    FileText,
    ShieldCheck,
    Clock,
    Activity
} from "lucide-react";
import { getDoctorDashboardSummary } from "../../services/doctor";

function DoctorStats() {
    const [statsData, setStatsData] = useState({
        total_patients: 0,
        permitted_patients: 0,
        pending_requests: 0,
        today_appointments: 0,
        total_records: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getDoctorDashboardSummary();
                if (data && data.stats) {
                    setStatsData(data.stats);
                }
            } catch (err) {
                console.error("Failed to load doctor stats:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const stats = [
        {
            id: 1,
            title: "Permitted Patients",
            value: loading ? "—" : statsData.permitted_patients,
            icon: <ShieldCheck size={28} />,
            color: "green",
            change: "Access granted by patient"
        },
        {
            id: 2,
            title: "Pending Permission Requests",
            value: loading ? "—" : statsData.pending_requests,
            icon: <Clock size={28} />,
            color: "orange",
            change: "Awaiting patient approval"
        },
        {
            id: 3,
            title: "Today's Appointments",
            value: loading ? "—" : statsData.today_appointments,
            icon: <CalendarDays size={28} />,
            color: "blue",
            change: "Scheduled for today"
        },
        {
            id: 4,
            title: "Total Patient Inquiries",
            value: loading ? "—" : statsData.total_patients,
            icon: <Users size={28} />,
            color: "purple",
            change: "In health network"
        }
    ];

    return (
        <section className="doctor-stats">
            {stats.map((stat) => (
                <div key={stat.id} className="doctor-card">
                    <div className={`doctor-icon ${stat.color}`}>
                        {stat.icon}
                    </div>
                    <div className="doctor-info">
                        <h3>{stat.title}</h3>
                        <h1>{stat.value}</h1>
                        <p>{stat.change}</p>
                    </div>
                </div>
            ))}
        </section>
    );
}

export default DoctorStats;