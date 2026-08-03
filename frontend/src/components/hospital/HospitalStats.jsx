import "./HospitalStats.css";

import {
    Stethoscope,
    Users,
    CalendarCheck,
    Building2
} from "lucide-react";

function HospitalStats() {

    const stats = [

        {
            title: "Total Doctors",
            value: "48",
            change: "+4 This Month",
            icon: <Stethoscope size={30} />,
            color: "blue"
        },

        {
            title: "Total Patients",
            value: "2,156",
            change: "+126 This Month",
            icon: <Users size={30} />,
            color: "green"
        },

        {
            title: "Today's Appointments",
            value: "89",
            change: "12 Pending",
            icon: <CalendarCheck size={30} />,
            color: "orange"
        },

        {
            title: "Departments",
            value: "12",
            change: "2 New",
            icon: <Building2 size={30} />,
            color: "purple"
        }

    ];

    return (

        <section className="hospital-stats">

            {

                stats.map((stat, index) => (

                    <div
                        className="hospital-card"
                        key={index}
                    >

                        <div className={`hospital-icon ${stat.color}`}>

                            {stat.icon}

                        </div>

                        <div className="hospital-info">

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

export default HospitalStats;