import "./DashboardCards.css";
import {
    FileText,
    CalendarCheck2,
    Pill,
    HeartPulse,
    TrendingUp
} from "lucide-react";

function DashboardCards() {

    const cards = [
        {
            id: 1,
            title: "Medical Records",
            value: "18",
            subtitle: "Total Records",
            icon: <FileText size={30} />,
            color: "blue",
            change: "+2 This Month"
        },
        {
            id: 2,
            title: "Appointments",
            value: "3",
            subtitle: "Upcoming Visits",
            icon: <CalendarCheck2 size={30} />,
            color: "green",
            change: "Next Tomorrow"
        },
        {
            id: 3,
            title: "Medications",
            value: "5",
            subtitle: "Active Medicines",
            icon: <Pill size={30} />,
            color: "orange",
            change: "2 Need Refill"
        },
        {
            id: 4,
            title: "Health Score",
            value: "92%",
            subtitle: "Excellent",
            icon: <HeartPulse size={30} />,
            color: "red",
            change: "+4% Improved"
        }
    ];

    return (

        <section className="dashboard-cards">

            {cards.map((card) => (

                <div
                    key={card.id}
                    className="card"
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