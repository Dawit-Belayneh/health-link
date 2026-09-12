import { useState, useEffect } from "react";
import "./MedicalRecordTable.css";
import {
    Search,
    FileText,
    Eye,
    CalendarDays,
    X,
    User,
    Pill
} from "lucide-react";
import api from "../../utils/axios";

function MedicalRecordTable() {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRecord, setSelectedRecord] = useState(null);

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                setLoading(true);
                const res = await api.get("medical_record/");
                setRecords(Array.isArray(res.data) ? res.data : (res.data.results || []));
            } catch (err) {
                console.error("Failed to load doctor medical records:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchRecords();
    }, []);

    const filtered = records.filter((rec) => {
        const pName = rec.patient_name || "";
        const diag = rec.diagnosis || "";
        const treat = rec.treatment || "";
        const q = searchTerm.toLowerCase();
        return pName.toLowerCase().includes(q) || diag.toLowerCase().includes(q) || treat.toLowerCase().includes(q);
    });

    return (
        <section className="medical-record-table">
            <div className="medical-header">
                <div>
                    <h2>Doctor Clinical Records</h2>
                    <p>Diagnosis and treatment history for authorized patients</p>
                </div>

                <div className="medical-search">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search records..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Patient</th>
                            <th>Diagnosis</th>
                            <th>Treatment</th>
                            <th>Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="5" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                                    Loading clinical records...
                                </td>
                            </tr>
                        ) : filtered.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                                    {searchTerm ? "No records matching query." : "No clinical records found."}
                                </td>
                            </tr>
                        ) : (
                            filtered.map((record) => {
                                const patientName = record.patient_name || "Patient";
                                const dateStr = record.date ? new Date(record.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recent";

                                return (
                                    <tr key={record.id}>
                                        <td>
                                            <div className="patient-name">
                                                <div className="avatar">
                                                    {patientName.charAt(0)}
                                                </div>
                                                <div>
                                                    <strong>{patientName}</strong>
                                                </div>
                                            </div>
                                        </td>

                                        <td>
                                            <strong style={{ color: "#1e293b" }}>{record.diagnosis}</strong>
                                        </td>

                                        <td>{record.treatment}</td>

                                        <td>
                                            <div className="date-cell">
                                                <CalendarDays size={16} />
                                                {dateStr}
                                            </div>
                                        </td>

                                        <td>
                                            <div className="actions">
                                                <button
                                                    className="view-btn"
                                                    title="View Full Record"
                                                    onClick={() => setSelectedRecord(record)}
                                                >
                                                    <Eye size={17} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* --- RECORD DETAIL MODAL --- */}
            {selectedRecord && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(15, 23, 42, 0.6)",
                    backdropFilter: "blur(4px)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 9999,
                    padding: "20px"
                }}>
                    <div style={{
                        background: "#ffffff",
                        borderRadius: "16px",
                        width: "100%",
                        maxWidth: "500px",
                        padding: "26px",
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <FileText size={22} color="#2563eb" />
                                <h3 style={{ margin: 0, color: "#0f172a" }}>Clinical Consultation Record</h3>
                            </div>
                            <button onClick={() => setSelectedRecord(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}>
                                <X size={20} />
                            </button>
                        </div>

                        <div style={{ padding: "12px 16px", background: "#f8fafc", borderRadius: "10px", marginBottom: "16px" }}>
                            <div style={{ fontSize: "0.85rem", color: "#64748b" }}>Patient:</div>
                            <strong style={{ fontSize: "1.1rem", color: "#0f172a" }}>{selectedRecord.patient_name}</strong>
                            <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "4px" }}>
                                Recorded on {new Date(selectedRecord.date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                            </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "14px", fontSize: "0.92rem", marginBottom: "20px" }}>
                            <div>
                                <span style={{ color: "#64748b", fontSize: "0.82rem", fontWeight: "600" }}>DIAGNOSIS</span>
                                <div style={{ color: "#0f172a", fontWeight: "600", fontSize: "1.05rem", marginTop: "2px" }}>
                                    {selectedRecord.diagnosis}
                                </div>
                            </div>

                            <div>
                                <span style={{ color: "#64748b", fontSize: "0.82rem", fontWeight: "600" }}>TREATMENT PLAN</span>
                                <div style={{ color: "#334155", marginTop: "2px", lineHeight: "1.5" }}>
                                    {selectedRecord.treatment}
                                </div>
                            </div>

                            {selectedRecord.prescription && (
                                <div style={{ padding: "10px 14px", background: "#eff6ff", borderRadius: "8px", border: "1px solid #bfdbfe" }}>
                                    <span style={{ color: "#1e40af", fontSize: "0.82rem", fontWeight: "600", display: "flex", alignItems: "center", gap: "4px" }}>
                                        <Pill size={15} /> PRESCRIPTION (Rx)
                                    </span>
                                    <div style={{ color: "#1e3a8a", fontWeight: "600", marginTop: "4px" }}>
                                        {selectedRecord.prescription}
                                    </div>
                                </div>
                            )}

                            {selectedRecord.notes && (
                                <div>
                                    <span style={{ color: "#64748b", fontSize: "0.82rem", fontWeight: "600" }}>CLINICAL NOTES</span>
                                    <div style={{ color: "#475569", fontStyle: "italic", marginTop: "2px", lineHeight: "1.4" }}>
                                        {selectedRecord.notes}
                                    </div>
                                </div>
                            )}

                            <div style={{ fontSize: "0.8rem", color: "#94a3b8", borderTop: "1px solid #f1f5f9", paddingTop: "10px" }}>
                                Attending Physician: {selectedRecord.doctor_name} ({selectedRecord.doctor_specialization || "Physician"}) • {selectedRecord.hospital_name}
                            </div>
                        </div>

                        <button
                            onClick={() => setSelectedRecord(null)}
                            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "#f8fafc", fontWeight: "600", cursor: "pointer" }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}

export default MedicalRecordTable;