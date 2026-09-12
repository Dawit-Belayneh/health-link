import "./PrescriptionCard.css";
import { useNavigate, Link } from "react-router-dom";
import {
    Pill,
    Clock3,
    CalendarDays,
    UserRound,
    AlertCircle,
    ChevronRight
} from "lucide-react";

function PrescriptionCard({ prescriptions = [], records = [] }) {
    const navigate = useNavigate();

    // Prefer real prescriptions from database, fallback to parsed records
    let medicineList = [];
    if (prescriptions && prescriptions.length > 0) {
        medicineList = prescriptions.map((p) => ({
            id: p.id,
            name: p.medication_name,
            dosage: p.dosage,
            doctor: p.doctor_name || "Dr. Sarah Johnson",
            start: p.start_date || "Active",
            end: `${p.duration_days || 30} Days Supply`,
            progress: 65,
            refill: p.refill_status === "Refill Needed" || p.refill_status === "Refill Requested"
        }));
    } else {
        const rxRecords = records.filter(r => r.prescription && r.prescription.trim());
        medicineList = rxRecords.map((r, i) => {
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
                end: "30 Days Supply",
                progress: 65,
                refill: false
            };
        });
    }

    const DISPLAY_LIMIT = 2;
    const visibleMedicines = medicineList.slice(0, DISPLAY_LIMIT);

    return (
        <section className="prescription-card">
            <div className="prescription-header">
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <h2>Active Prescriptions</h2>
                    <Link
                        to="/medications"
                        style={{
                            fontSize: "0.82rem",
                            color: "#2563eb",
                            fontWeight: "600",
                            textDecoration: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "2px"
                        }}
                    >
                        <span>View All ({medicineList.length})</span>
                        <ChevronRight size={14} />
                    </Link>
                </div>
                <span className="prescription-badge">{medicineList.length} Active</span>
            </div>

            {medicineList.length === 0 ? (
                <p style={{ color: "#64748b", padding: "20px 0", textAlign: "center" }}>
                    No active prescriptions at this time.
                </p>
            ) : (
                visibleMedicines.map((medicine) => (
                    <div
                        className="medicine-card"
                        key={medicine.id}
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate("/medications")}
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
                                <span>Daily Prescription</span>
                            </div>
                        </div>

                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${medicine.progress}%` }}
                            />
                        </div>

                        {medicine.refill && (
                            <div className="refill-warning">
                                <AlertCircle size={18}/>
                                Refill Required Soon
                            </div>
                        )}
                    </div>
                ))
            )}

            {medicineList.length > 0 && (
                <div className="prescription-footer-bar">
                    <span className="prescription-count-info">
                        Showing {visibleMedicines.length} of {medicineList.length} {medicineList.length === 1 ? 'medication' : 'medications'}
                    </span>
                    <Link to="/medications" className="prescription-more-link-btn">
                        <span>Show More Medications</span>
                        <ChevronRight size={16} />
                    </Link>
                </div>
            )}
        </section>
    );
}

export default PrescriptionCard;