import "./HealthOverview.css";
import { useNavigate } from "react-router-dom";
import {
    Phone,
    Mail,
    Droplets,
    Ruler,
    Weight,
    Cake,
    UserRound,
    ShieldCheck,
    TriangleAlert,
    Activity,
    HeartPulse
} from "lucide-react";

function HealthOverview({ patient, latestVitals }) {
    const navigate = useNavigate();

    const fullName = patient?.user_details?.full_name || patient?.user_details?.username || "Patient";
    const patientId = patient?.id ? `HL-2026-${String(patient.id).padStart(5, "0")}` : "HL-2026-00001";
    const bloodType = patient?.blood_type || "Not recorded";
    const gender = patient?.gender || "Not specified";
    const height = patient?.height ? `${patient.height} cm` : "Not recorded";
    const weight = patient?.weight ? `${patient.weight} kg` : "Not recorded";
    const phone = patient?.phone_number || "Not recorded";
    const email = patient?.user_details?.email || "No email on record";
    const allergies = patient?.allergies || "None reported";

    let age = "Not recorded";
    if (patient?.date_of_birth) {
        const birth = new Date(patient.date_of_birth);
        const diff = Date.now() - birth.getTime();
        const ageDate = new Date(diff);
        const calculatedAge = Math.abs(ageDate.getUTCFullYear() - 1970);
        if (!isNaN(calculatedAge)) {
            age = `${calculatedAge} Years`;
        }
    }

    const bpDisplay = latestVitals
        ? `${latestVitals.systolic}/${latestVitals.diastolic} mmHg`
        : "120/80 mmHg";

    return (
        <section className="health-overview">
            <div
                className="profile-header"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/profile")}
                title="Edit / View Full Profile"
            >
                <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=2563eb&color=fff`}
                    alt={fullName}
                />

                <div>
                    <h2>{fullName}</h2>
                    <p>Patient ID: {patientId}</p>
                    <span className="status">
                        <ShieldCheck size={16}/>
                        Active Portal Profile
                    </span>
                </div>
            </div>

            <div className="info-grid">
                <div className="info-card">
                    <Droplets size={22}/>
                    <div>
                        <h4>Blood Type</h4>
                        <p>{bloodType}</p>
                    </div>
                </div>

                <div className="info-card">
                    <Cake size={22}/>
                    <div>
                        <h4>Age</h4>
                        <p>{age}</p>
                    </div>
                </div>

                <div className="info-card">
                    <UserRound size={22}/>
                    <div>
                        <h4>Gender</h4>
                        <p>{gender}</p>
                    </div>
                </div>

                <div className="info-card" style={{ cursor: "pointer" }} onClick={() => navigate("/health")}>
                    <Activity size={22} color="#2563eb" />
                    <div>
                        <h4>Blood Pressure</h4>
                        <p>{bpDisplay}</p>
                    </div>
                </div>

                <div className="info-card" style={{ cursor: "pointer" }} onClick={() => navigate("/profile")}>
                    <Ruler size={22}/>
                    <div>
                        <h4>Height</h4>
                        <p>{height}</p>
                    </div>
                </div>

                <div className="info-card" style={{ cursor: "pointer" }} onClick={() => navigate("/profile")}>
                    <Weight size={22}/>
                    <div>
                        <h4>Weight</h4>
                        <p>{weight}</p>
                    </div>
                </div>

                <div className="info-card">
                    <Phone size={22}/>
                    <div>
                        <h4>Phone</h4>
                        <p>{phone}</p>
                    </div>
                </div>

                <div className="info-card allergy">
                    <TriangleAlert size={22}/>
                    <div>
                        <h4>Allergies</h4>
                        <p>{allergies}</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HealthOverview;