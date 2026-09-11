import "./PrescriptionCard.css";
import { useNavigate } from "react-router-dom";
import {
    Pill,
    Clock3,
    CalendarDays,
    UserRound,
    AlertCircle
} from "lucide-react";

function PrescriptionCard({ records = [] }) {
    const navigate = useNavigate();

    const rxRecords = records.filter(r => r.prescription && r.prescription.trim());

    const medicines = rxRecords.map((r, i) => {
        const parts = r.prescription.split("-");
        const name = parts[0]?.trim() || r.prescription;
        const dosage = parts[1]?.trim() || "As directed by physician";
        const docName = r.doctor_name || r.doctor || "Dr. Sarah Johnson";
        const dateStr = r.date || r.visit_date;
        const startDate = dateStr 
            ? new Date(dateStr).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }) 
            : "Active";

        return {
            id: r.id || i,
            name,
            dosage,
            doctor: docName,
            start: startDate,
            end: "30 Days Plan",
            progress: 65,
            refill: false
        };
    });

    return (

        <section className="prescription-card">

            <div
                className="prescription-header"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/medications")}
                title="Open Medications Management"
            >

                <h2>Active Prescriptions</h2>

                <span>{medicines.length} Medicines</span>

            </div>

            {
                medicines.length === 0 ? (
                    <p style={{ color: "#64748b", padding: "20px 0", textAlign: "center" }}>
                        No active prescriptions at this time.
                    </p>
                ) : (
                    medicines.map((medicine)=>(

                    <div
                        className="medicine-card"
                        key={medicine.id}
                    >

                        <div className="medicine-top">

                            <div className="medicine-icon">

                                <Pill size={28}/>

                            </div>

                            <div>

                                <h3>{medicine.name}</h3>

                                <p>{medicine.dosage}</p>

                            </div>

                        </div>

                        <div className="medicine-details">

                            <div>

                                <UserRound size={16}/>

                                <span>{medicine.doctor}</span>

                            </div>

                            <div>

                                <CalendarDays size={16}/>

                                <span>{medicine.start} - {medicine.end}</span>

                            </div>

                            <div>

                                <Clock3 size={16}/>

                                <span>{medicine.progress}% Completed</span>

                            </div>

                        </div>

                        <div className="progress-bar">

                            <div
                                className="progress-fill"
                                style={{
                                    width:`${medicine.progress}%`
                                }}
                            ></div>

                        </div>

                        {

                            medicine.refill &&

                            <div className="refill-warning">

                                <AlertCircle size={18}/>

                                Refill Required Soon

                            </div>

                        }

                    </div>

                ))
            )}

        </section>

    );

}

export default PrescriptionCard;