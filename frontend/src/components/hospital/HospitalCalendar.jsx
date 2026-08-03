import "./HospitalCalendar.css";

import {
    CalendarDays,
    Clock3,
    Users,
    Stethoscope,
    ArrowRight
} from "lucide-react";

function HospitalCalendar() {

    const schedules = [

        {
            time: "08:00 AM",
            title: "Morning Doctor Meeting",
            doctor: "All Department Heads"
        },

        {
            time: "09:30 AM",
            title: "Patient Appointment",
            doctor: "Dr. Hana Tesfaye"
        },

        {
            time: "11:00 AM",
            title: "Surgery",
            doctor: "Dr. Samuel Bekele"
        },

        {
            time: "02:00 PM",
            title: "Emergency Review",
            doctor: "Emergency Department"
        },

        {
            time: "04:30 PM",
            title: "Hospital Staff Meeting",
            doctor: "Hospital Administration"
        }

    ];

    return (

        <section className="hospital-calendar">

            <div className="calendar-header">

                <div className="calendar-title">

                    <CalendarDays size={26} />

                    <div>

                        <h2>Today's Schedule</h2>

                        <p>Hospital events and appointments</p>

                    </div>

                </div>

                <button>

                    View All

                    <ArrowRight size={18} />

                </button>

            </div>

            <div className="calendar-date">

                <h1>03</h1>

                <div>

                    <h3>Monday</h3>

                    <p>August 2026</p>

                </div>

            </div>

            <div className="schedule-list">

                {

                    schedules.map((item,index)=>(

                        <div
                            className="schedule-card"
                            key={index}
                        >

                            <div className="schedule-icon">

                                <Clock3 size={22}/>

                            </div>

                            <div className="schedule-content">

                                <h4>{item.title}</h4>

                                <p>

                                    <Stethoscope size={14}/>

                                    {item.doctor}

                                </p>

                            </div>

                            <span>{item.time}</span>

                        </div>

                    ))

                }

            </div>

            <div className="calendar-summary">

                <div>

                    <Users size={22}/>

                    <h3>89</h3>

                    <p>Appointments</p>

                </div>

                <div>

                    <Stethoscope size={22}/>

                    <h3>48</h3>

                    <p>Doctors</p>

                </div>

            </div>

        </section>

    );

}

export default HospitalCalendar;