import "./AppointmentCard.css";
import {
    UserRound,
    CalendarDays,
    Clock3,
    MapPin,
    Phone,
    FileText,
    BadgeCheck
} from "lucide-react";

function AppointmentCard() {

    return (

        <section className="appointment-card">

            <div className="appointment-header">

                <h2>Upcoming Appointment</h2>

                <span className="appointment-status">
                    <BadgeCheck size={16}/>
                    Confirmed
                </span>

            </div>

            <div className="doctor-profile">

                <img
                    src="https://i.pravatar.cc/150?img=32"
                    alt="Doctor"
                />

                <div>

                    <h3>Dr. Sarah Johnson</h3>

                    <p>Cardiology Specialist</p>

                </div>

            </div>

            <div className="appointment-info">

                <div className="info-item">

                    <CalendarDays size={20}/>

                    <span>Wednesday, July 22, 2026</span>

                </div>

                <div className="info-item">

                    <Clock3 size={20}/>

                    <span>10:30 AM</span>

                </div>

                <div className="info-item">

                    <MapPin size={20}/>

                    <span>Room 302 • HealthLink Hospital</span>

                </div>

                <div className="info-item">

                    <UserRound size={20}/>

                    <span>30 Minute Consultation</span>

                </div>

            </div>

            <div className="appointment-note">

                Please arrive at least
                <strong> 15 minutes early </strong>
                and bring any recent laboratory reports if available.

            </div>

            <div className="appointment-actions">

                <button className="primary-action">

                    <FileText size={18}/>

                    View Details

                </button>

                <button className="secondary-action">

                    <Phone size={18}/>

                    Contact Hospital

                </button>

            </div>

        </section>

    );

}

export default AppointmentCard;