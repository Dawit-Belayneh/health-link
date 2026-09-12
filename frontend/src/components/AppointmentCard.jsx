import "./AppointmentCard.css";
import { useNavigate } from "react-router-dom";
import {
    UserRound,
    CalendarDays,
    Clock3,
    MapPin,
    Phone,
    FileText,
    BadgeCheck,
    Plus,
    Video
} from "lucide-react";

function AppointmentCard({ appointment, records = [] }) {
    const navigate = useNavigate();

    // If no direct appointment prop passed, see if records has any doctor context
    const apt = appointment || null;

    if (!apt) {
        return (
            <section className="appointment-card empty-apt">
                <div className="appointment-header">
                    <h2>Upcoming Appointment</h2>
                </div>
                <div style={{ padding: "30px 20px", textAlign: "center", color: "#64748b" }}>
                    <CalendarDays size={42} color="#94a3b8" style={{ margin: "0 auto 12px" }} />
                    <h3 style={{ fontSize: "1.1rem", color: "#1e293b", margin: "0 0 6px" }}>No Upcoming Appointments</h3>
                    <p style={{ fontSize: "0.88rem", margin: "0 0 16px" }}>You do not have any scheduled appointments at this time.</p>
                    <button
                        className="primary-action"
                        style={{ margin: "0 auto", padding: "9px 18px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                        onClick={() => navigate("/appointments")}
                    >
                        <Plus size={16} />
                        Book Appointment
                    </button>
                </div>
            </section>
        );
    }

    const docName = apt.doctor_name || "Dr. Attending Physician";
    const specialization = apt.specialization || "General Medicine";
    const hospital = apt.hospital_name || "HealthLink Central Hospital";
    const room = apt.room || "Consultation Room 302";

    const formatDate = (dateStr) => {
        if (!dateStr) return "Scheduled";
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return d.toLocaleDateString("en-US", {
            weekday: "long",
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    };

    return (
        <section className="appointment-card">
            <div className="appointment-header">
                <h2>Upcoming Appointment</h2>
                <span className="appointment-status">
                    <BadgeCheck size={16}/>
                    {apt.status || "Confirmed"}
                </span>
            </div>

            <div className="doctor-profile">
                <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(docName)}&background=10b981&color=fff`}
                    alt={docName}
                />
                <div>
                    <h3>{docName}</h3>
                    <p>{specialization}</p>
                </div>
            </div>

            <div className="appointment-info">
                <div className="info-item">
                    <CalendarDays size={20}/>
                    <span>{formatDate(apt.date)}</span>
                </div>

                <div className="info-item">
                    <Clock3 size={20}/>
                    <span>{apt.time}</span>
                </div>

                <div className="info-item">
                    {apt.appointment_type === "Telehealth" ? <Video size={20} /> : <MapPin size={20}/>}
                    <span>{room} • {hospital}</span>
                </div>

                <div className="info-item">
                    <UserRound size={20}/>
                    <span>{apt.appointment_type || "In-Person"} Consultation</span>
                </div>
            </div>

            {apt.notes && (
                <div className="appointment-note">
                    <strong>Note: </strong>
                    {apt.notes}
                </div>
            )}

            <div className="appointment-actions">
                <button className="primary-action" onClick={() => navigate("/appointments")}>
                    <FileText size={18}/>
                    Manage Appointment
                </button>

                <button
                    className="secondary-action"
                    onClick={() => alert(`Connecting to hospital reception: +251 115 517 000`)}
                >
                    <Phone size={18}/>
                    Contact Hospital
                </button>
            </div>
        </section>
    );
}

export default AppointmentCard;