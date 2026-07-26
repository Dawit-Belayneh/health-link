import "./DoctorStats.css";

import {
    Users,
    CalendarDays,
    FileText,
    Pill
} from "lucide-react";

function DoctorStats() {

    const stats = [

        {
            id: 1,
            title: "Total Patients",
            value: "346",
            icon: <Users size={28} />,
            color: "blue",
            change: "+12 this week"
        },

        {
            id: 2,
            title: "Today's Appointments",
            value: "18",
            icon: <CalendarDays size={28} />,
            color: "green",
            change: "6 remaining"
        },

        {
            id: 3,
            title: "Pending Reports",
            value: "5",
            icon: <FileText size={28} />,
            color: "orange",
            change: "Need review"
        },

        {
            id: 4,
            title: "Active Prescriptions",
            value: "127",
            icon: <Pill size={28} />,
            color: "purple",
            change: "24 updated today"
        }

    ];

    return (

        <section className="doctor-stats">

            {

                stats.map((stat)=>(

                    <div
                        key={stat.id}
                        className="doctor-card"
                    >

                        <div className={`doctor-icon ${stat.color}`}>

                            {stat.icon}

                        </div>

                        <div className="doctor-info">

                            <h3>{stat.title}</h3>

                            <h1>{stat.value}</h1>

                            <p>{stat.change}</p>

                        </div>

                    </div>

                ))

            }

        </section>

    );

}

export default DoctorStats;