import "./EmergencyCard.css";
import { useNavigate } from "react-router-dom";
import {
    PhoneCall,
    HeartHandshake,
    Droplets,
    TriangleAlert,
    Pill,
    Building2,
    BadgeCheck,
    Edit3
} from "lucide-react";

function EmergencyCard({ patient, prescriptions = [], records = [] }) {
    const navigate = useNavigate();

    const contactName = patient?.emergency_contact_name || "";
    const relationship = patient?.emergency_contact_relationship || "Emergency Contact";
    const phone = patient?.emergency_contact_phone || "";
    const bloodType = patient?.blood_type || "O+";
    const allergies = patient?.allergies || "None reported";

    // Current real medication
    let currentMed = "None";
    if (prescriptions && prescriptions.length > 0) {
        currentMed = `${prescriptions[0].medication_name} (${prescriptions[0].dosage})`;
    } else {
        const rxRecord = records.find(r => r.prescription && r.prescription.trim());
        if (rxRecord) {
            currentMed = rxRecord.prescription.split("-")[0].trim();
        }
    }

    const initials = contactName
        ? contactName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
        : "EC";

    return (
        <section className="emergency-card">
            <div className="emergency-header">
                <h2>Emergency Information</h2>
                <span className="emergency-badge">
                    <BadgeCheck size={16} />
                    {contactName ? "Verified" : "Action Needed"}
                </span>
            </div>

            <div className="emergency-contact">
                <div className="contact-avatar">
                    {initials}
                </div>

                <div>
                    <h3>{contactName || "No Contact Added"}</h3>
                    <p>{contactName ? `${relationship} • Primary Emergency Contact` : "Please add an emergency contact in your profile"}</p>
                </div>
            </div>

            <div className="emergency-details">
                <div className="detail-item">
                    <PhoneCall size={20} />
                    <div>
                        <h4>Phone</h4>
                        <p>{phone || "Not specified"}</p>
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
                        <h4>Emergency Access</h4>
                        <p>Authorized</p>
                    </div>
                </div>

                <div className="detail-item">
                    <Building2 size={20} />
                    <div>
                        <h4>Primary Facility</h4>
                        <p>HealthLink Central Hospital</p>
                    </div>
                </div>
            </div>

            {contactName ? (
                <button
                    className="emergency-btn"
                    onClick={() => {
                        if (phone) {
                            window.location.href = `tel:${phone}`;
                        } else {
                            navigate("/profile");
                        }
                    }}
                >
                    <PhoneCall size={18} />
                    Call Emergency Contact ({phone || "Add Phone"})
                </button>
            ) : (
                <button
                    className="emergency-btn"
                    style={{ background: "#2563eb" }}
                    onClick={() => navigate("/profile")}
                >
                    <Edit3 size={18} />
                    Add Emergency Contact
                </button>
            )}
        </section>
    );
}

export default EmergencyCard;