import "./EmergencyCard.css";

import {
    PhoneCall,
    HeartHandshake,
    Droplets,
    TriangleAlert,
    Pill,
    Building2,
    BadgeCheck
} from "lucide-react";

function EmergencyCard({ patient, records = [] }) {

    const contactName = patient?.emergency_contact_name || "John Doe";
    const relationship = patient?.emergency_contact_relationship || "Emergency Contact";
    const phone = patient?.emergency_contact_phone || "+251 911 123 456";
    const bloodType = patient?.blood_type || "O+";
    const allergies = patient?.allergies || "None reported";

    const rxRecord = records.find(r => r.prescription && r.prescription.trim());
    const currentMed = rxRecord ? rxRecord.prescription.split("-")[0].trim() : "None";

    const initials = contactName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "EC";

    return (

        <section className="emergency-card">

            <div className="emergency-header">

                <h2>Emergency Information</h2>

                <span className="emergency-badge">

                    <BadgeCheck size={16} />

                    Ready

                </span>

            </div>

            <div className="emergency-contact">

                <div className="contact-avatar">

                    {initials}

                </div>

                <div>

                    <h3>{contactName}</h3>

                    <p>{relationship} • Emergency Contact</p>

                </div>

            </div>

            <div className="emergency-details">

                <div className="detail-item">

                    <PhoneCall size={20} />

                    <div>

                        <h4>Phone</h4>

                        <p>{phone}</p>

                    </div>

                </div>

                <div className="detail-item">

                    <Droplets size={20} />

                    <div>

                        <h4>Blood Type</h4>

                        <p>{bloodType}</p>

                    </div>

                </div>

                <div className="detail-item">

                    <TriangleAlert size={20} />

                    <div>

                        <h4>Allergies</h4>

                        <p>{allergies}</p>

                    </div>

                </div>

                <div className="detail-item">

                    <Pill size={20} />

                    <div>

                        <h4>Current Medication</h4>

                        <p>{currentMed}</p>

                    </div>

                </div>

                <div className="detail-item">

                    <HeartHandshake size={20} />

                    <div>

                        <h4>Organ Donor</h4>

                        <p>Yes</p>

                    </div>

                </div>

                <div className="detail-item">

                    <Building2 size={20} />

                    <div>

                        <h4>Preferred Hospital</h4>

                        <p>HealthLink Central Hospital</p>

                    </div>

                </div>

            </div>

            <button className="emergency-btn" onClick={() => alert(`Calling emergency contact: ${contactName} at ${phone}`)}>

                <PhoneCall size={18} />

                Contact Emergency Person

            </button>

        </section>

    );

}

export default EmergencyCard;