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

function EmergencyCard() {

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

                    JD

                </div>

                <div>

                    <h3>John Doe</h3>

                    <p>Brother • Emergency Contact</p>

                </div>

            </div>

            <div className="emergency-details">

                <div className="detail-item">

                    <PhoneCall size={20} />

                    <div>

                        <h4>Phone</h4>

                        <p>+251 911 123 456</p>

                    </div>

                </div>

                <div className="detail-item">

                    <Droplets size={20} />

                    <div>

                        <h4>Blood Type</h4>

                        <p>O+</p>

                    </div>

                </div>

                <div className="detail-item">

                    <TriangleAlert size={20} />

                    <div>

                        <h4>Allergies</h4>

                        <p>Penicillin</p>

                    </div>

                </div>

                <div className="detail-item">

                    <Pill size={20} />

                    <div>

                        <h4>Current Medication</h4>

                        <p>Vitamin D</p>

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

                        <p>HealthLink Medical Center</p>

                    </div>

                </div>

            </div>

            <button className="emergency-btn">

                <PhoneCall size={18} />

                Contact Emergency Person

            </button>

        </section>

    );

}

export default EmergencyCard;