import { useState } from "react";
import { Link } from "react-router-dom";
import "./MedicalTable.css";
import {
    Search,
    Eye,
    CalendarDays,
    Stethoscope,
    FileText,
    ChevronRight,
    X
} from "lucide-react";

function MedicalTable({ records = [] }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRecord, setSelectedRecord] = useState(null);

    const filteredRecords = records.filter((r) => {
        const term = searchTerm.toLowerCase();
        const doc = (r.doctor_name || r.doctor || "").toLowerCase();
        const dept = (r.doctor_specialization || r.department || "").toLowerCase();
        const diag = (r.diagnosis || "").toLowerCase();
        return doc.includes(term) || dept.includes(term) || diag.includes(term);
    });

    const formatDate = (dateStr) => {
        if (!dateStr) return "N/A";
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return d.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    };

    return (
        <section className="medical-table">
            <div className="table-header">
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <h2>Recent Medical Records</h2>
                    <Link
                        to="/medical-records"
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
                        <span>View All</span>
                        <ChevronRight size={14} />
                    </Link>
                </div>

                <div className="table-search">
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
                            <th>Date</th>
                            <th>Doctor</th>
                            <th>Department</th>
                            <th>Diagnosis</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredRecords.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                                    No medical records found.
                                </td>
                            </tr>
                        ) : (
                            filteredRecords.map((record) => {
                                const docName = record.doctor_name || record.doctor || "Dr. HealthLink";
                                const dept = record.doctor_specialization || record.department || "General Practice";
                                const formattedDate = formatDate(record.date || record.visit_date);

                                return (
                                    <tr key={record.id}>
                                        <td>
                                            <div className="cell">
                                                <CalendarDays size={16} />
                                                {formattedDate}
                                            </div>
                                        </td>

                                        <td>{docName}</td>

                                        <td>
                                            <div className="cell">
                                                <Stethoscope size={16} />
                                                {dept}
                                            </div>
                                        </td>

                                        <td>{record.diagnosis}</td>

                                        <td>
                                            <span className="status completed">
                                                Completed
                                            </span>
                                        </td>

                                        <td>
                                            <button
                                                className="view-btn"
                                                onClick={() => setSelectedRecord(record)}
                                            >
                                                <Eye size={17} />
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {selectedRecord && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 9999,
                    padding: "20px"
                }}>
                    <div style={{
                        background: "#fff",
                        borderRadius: "16px",
                        maxWidth: "540px",
                        width: "100%",
                        padding: "24px",
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0", paddingBottom: "12px", marginBottom: "16px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <FileText size={22} color="#2563eb" />
                                <h3 style={{ margin: 0, fontSize: "1.2rem", color: "#1e293b" }}>Medical Record Details</h3>
                            </div>
                            <button
                                onClick={() => setSelectedRecord(null)}
                                style={{ background: "transparent", border: "none", cursor: "pointer", color: "#64748b" }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "12px", color: "#334155", fontSize: "0.95rem" }}>
                            <div>
                                <strong>Date: </strong> {formatDate(selectedRecord.date || selectedRecord.visit_date)}
                            </div>
                            <div>
                                <strong>Attending Doctor: </strong> {selectedRecord.doctor_name || selectedRecord.doctor} ({selectedRecord.doctor_specialization || selectedRecord.department})
                            </div>
                            <div>
                                <strong>Hospital: </strong> {selectedRecord.hospital_name || "HealthLink Central Hospital"}
                            </div>
                            <div>
                                <strong>Diagnosis: </strong>
                                <p style={{ margin: "4px 0", padding: "8px 12px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                                    {selectedRecord.diagnosis}
                                </p>
                            </div>
                            <div>
                                <strong>Treatment: </strong>
                                <p style={{ margin: "4px 0", padding: "8px 12px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                                    {selectedRecord.treatment || "Standard care & monitoring."}
                                </p>
                            </div>
                            {selectedRecord.prescription && (
                                <div>
                                    <strong>Prescription: </strong>
                                    <p style={{ margin: "4px 0", padding: "8px 12px", background: "#eff6ff", borderRadius: "8px", border: "1px solid #bfdbfe", color: "#1d4ed8" }}>
                                        {selectedRecord.prescription}
                                    </p>
                                </div>
                            )}
                            {selectedRecord.notes && (
                                <div>
                                    <strong>Clinical Notes: </strong>
                                    <p style={{ margin: "4px 0", padding: "8px 12px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                                        {selectedRecord.notes}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div style={{ marginTop: "20px", textAlign: "right" }}>
                            <button
                                onClick={() => setSelectedRecord(null)}
                                style={{
                                    padding: "8px 18px",
                                    backgroundColor: "#2563eb",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    fontWeight: "500"
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

export default MedicalTable;