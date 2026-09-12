import { useState, useEffect } from "react";
import "./AppointmentTable.css";
import {
    Search,
    Eye,
    CalendarDays,
    Clock3
} from "lucide-react";
import { getDoctorAppointments } from "../../services/doctor";

function AppointmentTable() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                setLoading(true);
                const data = await getDoctorAppointments();
                setAppointments(Array.isArray(data) ? data : (data.results || []));
            } catch (err) {
                console.error("Failed to load doctor appointments:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAppointments();
    }, []);

    const filtered = appointments.filter((apt) => {
        const pName = apt.patient_name || apt.patient?.user_details?.full_name || apt.patient?.user?.username || "";
        const q = searchTerm.toLowerCase();
        return pName.toLowerCase().includes(q) || (apt.appointment_type || "").toLowerCase().includes(q);
    });

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
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="5" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                                    Loading appointment roster...
                                </td>
                            </tr>
                        ) : filtered.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                                    {searchTerm ? "No appointments matching search." : "No scheduled appointments for today."}
                                </td>
                            </tr>
                        ) : (
                            filtered.map((apt) => {
                                const patientName = apt.patient_name || apt.patient?.user_details?.full_name || "Patient";
                                return (
                                    <tr key={apt.id}>
                                        <td>
                                            <div className="patient-info">
                                                <div className="avatar">
                                                    {patientName.charAt(0)}
                                                </div>
                                                <div>
                                                    <strong>{patientName}</strong>
                                                    <small>{apt.room || "Room 102"}</small>
                                                </div>
                                            </div>
                                        </td>

                                        <td>
                                            <div className="cell">
                                                <CalendarDays size={16} />
                                                {apt.date}
                                            </div>
                                        </td>

                                        <td>
                                            <div className="cell">
                                                <Clock3 size={16} />
                                                {apt.time}
                                            </div>
                                        </td>

                                        <td>
                                            {apt.notes || apt.appointment_type || "Clinical Consultation"}
                                        </td>

                                        <td>
                                            <span className={`status ${(apt.status || "confirmed").toLowerCase().replace(" ", "-")}`}>
                                                {apt.status || "Confirmed"}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>

                </table>

            </div>

        </section>

    );

}

export default AppointmentTable;