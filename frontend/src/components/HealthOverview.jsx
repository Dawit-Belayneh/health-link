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
    TriangleAlert
} from "lucide-react";

function HealthOverview({ patient }) {
    const navigate = useNavigate();

    const fullName = patient?.user_details?.full_name || patient?.user_details?.username || "Patient";
    const patientId = patient?.id ? `HL-2026-${String(patient.id).padStart(5, "0")}` : "HL-2026-00001";
    const bloodType = patient?.blood_type || "O+";
    const gender = patient?.gender || "Male";
    const height = patient?.height ? `${patient.height} cm` : "178 cm";
    const weight = patient?.weight ? `${patient.weight} kg` : "72 kg";
    const phone = patient?.phone_number || "+251 900 000 000";
    const email = patient?.user_details?.email || "patient@healthlink.com";
    const allergies = patient?.allergies || "None reported";

    let age = "25 Years";
    if (patient?.date_of_birth) {
        const birth = new Date(patient.date_of_birth);
        const diff = Date.now() - birth.getTime();
        const ageDate = new Date(diff);
        const calculatedAge = Math.abs(ageDate.getUTCFullYear() - 1970);
        if (!isNaN(calculatedAge)) {
            age = `${calculatedAge} Years`;
        }
    }

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

                    <p>Patient ID : {patientId}</p>

                    <span className="status">
                        <ShieldCheck size={16}/>
                        Active
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

                <div className="info-card">

                    <Ruler size={22}/>

                    <div>

                        <h4>Height</h4>

                        <p>{height}</p>

                    </div>

                </div>

                <div className="info-card">

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

                <div className="info-card">

                    <Mail size={22}/>

                    <div>

                        <h4>Email</h4>

                        <p>{email}</p>

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