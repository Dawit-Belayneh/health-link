import "./HospitalActivity.css";

import {
    Activity,
    UserPlus,
    Stethoscope,
    CalendarPlus,
    FileText,
    Pill,
    Clock3
} from "lucide-react";

function HospitalActivity() {

    const activities = [

        {
            id: 1,
            icon: <UserPlus size={20} />,
            title: "New patient registered",
            description: "Abebe Kebede created a new patient account.",
            time: "5 minutes ago",
            color: "blue"
        },

        {
            id: 2,
            icon: <Stethoscope size={20} />,
            title: "Doctor account created",
            description: "Dr. Samuel Bekele joined the Cardiology department.",
            time: "20 minutes ago",
            color: "green"
        },

        {
            id: 3,
            icon: <CalendarPlus size={20} />,
            title: "Appointment scheduled",
            description: "12 new appointments were booked today.",
            time: "1 hour ago",
            color: "orange"
        },

        {
            id: 4,
            icon: <FileText size={20} />,
            title: "Medical record updated",
            description: "Patient diagnosis updated successfully.",
            time: "2 hours ago",
            color: "purple"
        },

        {
            id: 5,
            icon: <Pill size={20} />,
            title: "Prescription issued",
            description: "Dr. Hana prescribed medication to Sara.",
            time: "Today",
            color: "red"
        }

    ];

    return (

        <section className="hospital-activity">

            <div className="activity-header">

                <div className="activity-title">

                    <Activity size={26} />

                    <div>

                        <h2>Recent Hospital Activity</h2>

                        <p>Latest activities across the hospital</p>

                    </div>

                </div>

            </div>

            <div className="activity-list">

                {

                    activities.map((item) => (

                        <div
                            className="activity-card"
                            key={item.id}
                        >

                            <div className={`activity-icon ${item.color}`}>

                                {item.icon}

                            </div>

                            <div className="activity-content">

                                <h4>{item.title}</h4>

                                <p>{item.description}</p>

                            </div>

                            <div className="activity-time">

                                <Clock3 size={16} />

                                <span>{item.time}</span>

                            </div>

                        </div>

                    ))

                }

            </div>

        </section>

    );

}

export default HospitalActivity;