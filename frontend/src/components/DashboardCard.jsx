import "./DashboardCard.css";
import { useNavigate } from "react-router-dom";
import {
    FileText,
    CalendarCheck2,
    Pill,
    HeartPulse,
    TrendingUp
} from "lucide-react";

function DashboardCards({ records = [], patient }) {
    const navigate = useNavigate();

    const totalRecords = records.length;
    const medicationsCount = records.filter(r => r.prescription && r.prescription.trim() !== "").length;

    const cards = [
        {
            id: 1,
            title: "Medical Records",
            value: totalRecords.toString(),
            subtitle: "Total History Records",
            icon: <FileText size={30} />,
            color: "blue",
            change: totalRecords > 0 ? `${totalRecords} Logged` : "No Records",
            path: "/medical-records"
        },
        {
            id: 2,
            title: "Appointments",
            value: "1",
            subtitle: "Upcoming Visit",
            icon: <CalendarCheck2 size={30} />,
            color: "green",
            change: "Confirmed",
            path: "/appointments"
        },
        {
            id: 3,
            title: "Prescriptions",
            value: medicationsCount.toString(),
            subtitle: "Active Prescriptions",
            icon: <Pill size={30} />,
            color: "orange",
            change: medicationsCount > 0 ? "Up to date" : "None active",
            path: "/medications"
        },
        {
            id: 4,
            title: "Health Score",
            value: "94%",
            subtitle: "Excellent",
            icon: <HeartPulse size={30} />,
            color: "red",
            change: "+4% Improved",
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