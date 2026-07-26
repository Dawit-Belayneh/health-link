import "./AppointmentTable.css";

import {
    Search,
    Eye,
    SquarePen,
    CalendarDays,
    Clock3
} from "lucide-react";

function AppointmentTable() {

    const appointments = [

        {
            id: 1,
            patient: "Dawit Belayneh",
            age: 23,
            date: "26 Jul 2026",
            time: "09:00 AM",
            reason: "Routine Checkup",
            status: "Waiting"
        },

        {
            id: 2,
            patient: "Hana Tesfaye",
            age: 35,
            date: "26 Jul 2026",
            time: "10:30 AM",
            reason: "Diabetes Follow-up",
            status: "In Progress"
        },

        {
            id: 3,
            patient: "Samuel Bekele",
            age: 44,
            date: "26 Jul 2026",
            time: "11:45 AM",
            reason: "Blood Pressure Review",
            status: "Completed"
        },

        {
            id: 4,
            patient: "Abel Girma",
            age: 29,
            date: "26 Jul 2026",
            time: "02:00 PM",
            reason: "Skin Allergy",
            status: "Waiting"
        }

    ];

    return (

        <section className="appointment-table">

            <div className="appointment-header">

                <div>

                    <h2>Today's Appointments</h2>

                    <p>Manage today's patient schedule</p>

                </div>

                <div className="appointment-search">

                    <Search size={18} />

                    <input
                        type="text"
                        placeholder="Search patient..."
                    />

                </div>

            </div>

            <div className="table-wrapper">

                <table>

                    <thead>

                        <tr>

                            <th>Patient</th>

                            <th>Date</th>

                            <th>Time</th>

                            <th>Reason</th>

                            <th>Status</th>

                            <th>Action</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            appointments.map((appointment)=>(

                                <tr key={appointment.id}>

                                    <td>

                                        <div className="patient-info">

                                            <div className="avatar">

                                                {appointment.patient.charAt(0)}

                                            </div>

                                            <div>

                                                <strong>{appointment.patient}</strong>

                                                <small>{appointment.age} Years</small>

                                            </div>

                                        </div>

                                    </td>

                                    <td>

                                        <div className="cell">

                                            <CalendarDays size={16}/>

                                            {appointment.date}

                                        </div>

                                    </td>

                                    <td>

                                        <div className="cell">

                                            <Clock3 size={16}/>

                                            {appointment.time}

                                        </div>

                                    </td>

                                    <td>{appointment.reason}</td>

                                    <td>

                                        <span
                                            className={`status ${appointment.status.toLowerCase().replace(" ","-")}`}
                                        >

                                            {appointment.status}

                                        </span>

                                    </td>

                                    <td>

                                        <div className="actions">

                                            <button className="view-btn">

                                                <Eye size={17}/>

                                            </button>

                                            <button className="edit-btn">

                                                <SquarePen size={17}/>

                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ))

                        }

                    </tbody>

                </table>

            </div>

        </section>

    );

}

export default AppointmentTable;