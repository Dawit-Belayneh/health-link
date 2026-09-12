import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./MedicalRecords.css";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Footer from "../components/Footer";

import { getPatientProfile, getMedicalRecords } from "../services/patient";
import {
    FileText,
    Search,
    Calendar,
    Stethoscope,
    Building2,
    Pill,
    Eye,
    Printer,
    Download,
    Filter,
    LayoutGrid,
    List,
    Clock,
    Activity,
    CheckCircle2,
    X,
    ArrowLeft,
    AlertCircle
} from "lucide-react";

function MedicalRecords() {
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDept, setSelectedDept] = useState("All");
    const [viewMode, setViewMode] = useState("grid"); // "grid" or "table"
    const [selectedRecord, setSelectedRecord] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("access");
        if (!token) {
            navigate("/login");
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                const [patientData, recordsData] = await Promise.all([
                    getPatientProfile(),
                    getMedicalRecords()
                ]);
                setPatient(patientData);
                const recordList = Array.isArray(recordsData)
                    ? recordsData
                    : (recordsData.results || []);
                setRecords(recordList);
            } catch (err) {
                console.error("Failed to load medical records:", err);
                if (err.response && err.response.status === 401) {
                    navigate("/login");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    // Extract unique departments/specializations
    const departments = ["All", ...new Set(records.map(r => r.doctor_specialization || "General Medicine"))];

    // Filter records
    const filteredRecords = records.filter(record => {
        const term = searchTerm.toLowerCase();
        const docName = (record.doctor_name || "").toLowerCase();
        const specialization = (record.doctor_specialization || "").toLowerCase();
        const diagnosis = (record.diagnosis || "").toLowerCase();
        const treatment = (record.treatment || "").toLowerCase();
        const prescription = (record.prescription || "").toLowerCase();
        const hospital = (record.hospital_name || "").toLowerCase();

        const matchesSearch = docName.includes(term) ||
            specialization.includes(term) ||
            diagnosis.includes(term) ||
            treatment.includes(term) ||
            prescription.includes(term) ||
            hospital.includes(term);

        const matchesDept = selectedDept === "All" ||
            (record.doctor_specialization || "General Medicine") === selectedDept;

        return matchesSearch && matchesDept;
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

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="patient-dashboard" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#f8fafc" }}>
                <div style={{ textAlign: "center" }}>
                    <div style={{
                        width: "48px",
                        height: "48px",
                        border: "4px solid #e2e8f0",
                        borderTop: "4px solid #2563eb",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                        margin: "0 auto 16px"
                    }} />
                    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                    <h3 style={{ color: "#334155" }}>Loading medical records...</h3>
                </div>
            </div>
        );
    }

    return (
        <div className="patient-dashboard">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <main className="dashboard-main">
                <Topbar
                    patient={patient}
                    onToggleSidebar={() => setSidebarOpen(prev => !prev)}
                />

                <div className="records-page-container">
                    {/* Page Header */}
                    <div className="records-header">
                        <div className="header-left">
                            <div className="header-title-badge">
                                <FileText size={22} className="header-icon" />
                                <h2>Medical Records & History</h2>
                            </div>
                            <p>Complete clinical records, diagnostic summaries, and physician reports.</p>
                            <div style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                marginTop: "8px",
                                padding: "4px 10px",
                                background: "#f0fdf4",
                                border: "1px solid #bbf7d0",
                                borderRadius: "20px",
                                color: "#166534",
                                fontSize: "0.78rem",
                                fontWeight: "600"
                            }}>
                                <CheckCircle2 size={13} />
                                <span>Certified Clinical Records (Permanently archived & protected from modification)</span>
                            </div>
                        </div>

                        <div className="header-actions">
                            <button className="export-all-btn" onClick={handlePrint}>
                                <Printer size={18} />
                                <span>Print Records</span>
                            </button>
                        </div>
                    </div>

                    {/* Stats Summary Bar */}
                    <div className="records-stats-grid">
                        <div className="records-stat-card">
                            <div className="stat-icon-wrap blue">
                                <FileText size={22} />
                            </div>
                            <div className="stat-content">
                                <span className="stat-num">{records.length}</span>
                                <span className="stat-lbl">Total Encounters</span>
                            </div>
                        </div>

                        <div className="records-stat-card">
                            <div className="stat-icon-wrap green">
                                <Stethoscope size={22} />
                            </div>
                            <div className="stat-content">
                                <span className="stat-num">
                                    {new Set(records.map(r => r.doctor_name)).size}
                                </span>
                                <span className="stat-lbl">Attending Doctors</span>
                            </div>
                        </div>

                        <div className="records-stat-card">
                            <div className="stat-icon-wrap purple">
                                <Pill size={22} />
                            </div>
                            <div className="stat-content">
                                <span className="stat-num">
                                    {records.filter(r => r.prescription && r.prescription.trim()).length}
                                </span>
                                <span className="stat-lbl">Prescriptions</span>
                            </div>
                        </div>

                        <div className="records-stat-card">
                            <div className="stat-icon-wrap amber">
                                <Clock size={22} />
                            </div>
                            <div className="stat-content">
                                <span className="stat-num">
                                    {records.length > 0 ? formatDate(records[0].date || records[0].visit_date) : "None"}
                                </span>
                                <span className="stat-lbl">Most Recent Visit</span>
                            </div>
                        </div>
                    </div>

                    {/* Filter & Controls Toolbar */}
                    <div className="records-toolbar">
                        <div className="search-box">
                            <Search size={18} />
                            <input
                                type="text"
                                placeholder="Search by diagnosis, doctor, clinic, medicine..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <button className="clear-search" onClick={() => setSearchTerm("")}>
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        <div className="toolbar-right">
                            <div className="dept-filter">
                                <Filter size={16} />
                                <select
                                    value={selectedDept}
                                    onChange={(e) => setSelectedDept(e.target.value)}
                                >
                                    {departments.map((dept) => (
                                        <option key={dept} value={dept}>
                                            {dept}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="view-toggle">
                                <button
                                    className={`toggle-btn ${viewMode === "grid" ? "active" : ""}`}
                                    onClick={() => setViewMode("grid")}
                                    title="Card View"
                                >
                                    <LayoutGrid size={18} />
                                </button>
                                <button
                                    className={`toggle-btn ${viewMode === "table" ? "active" : ""}`}
                                    onClick={() => setViewMode("table")}
                                    title="Table View"
                                >
                                    <List size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    {filteredRecords.length === 0 ? (
                        <div className="empty-records-card">
                            <AlertCircle size={44} />
                            <h3>No medical records found</h3>
                            <p>No records match your search criteria or filter selections.</p>
                            {(searchTerm || selectedDept !== "All") && (
                                <button
                                    className="reset-filter-btn"
                                    onClick={() => {
                                        setSearchTerm("");
                                        setSelectedDept("All");
                                    }}
                                >
                                    Reset Filters
                                </button>
                            )}
                        </div>
                    ) : viewMode === "grid" ? (
                        /* Grid View */
                        <div className="records-cards-grid">
                            {filteredRecords.map((record) => {
                                const docName = record.doctor_name || "Physician";
                                const dept = record.doctor_specialization || "General Medicine";
                                const hospital = record.hospital_name || "HealthLink Hospital";
                                const visitDate = formatDate(record.date || record.visit_date);

                                return (
                                    <div key={record.id} className="record-card">
                                        <div className="record-card-top">
                                            <div className="record-date-badge">
                                                <Calendar size={14} />
                                                <span>{visitDate}</span>
                                            </div>
                                            <span className="record-status-badge">
                                                <CheckCircle2 size={13} /> Completed
                                            </span>
                                        </div>

                                        <div className="record-doctor-row">
                                            <img
                                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(docName)}&background=2563eb&color=fff&size=64`}
                                                alt={docName}
                                                className="doctor-avatar"
                                            />
                                            <div className="doctor-meta">
                                                <h4>{docName}</h4>
                                                <span className="dept-tag">{dept}</span>
                                                <p className="hospital-tag">
                                                    <Building2 size={13} /> {hospital}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="record-body">
                                            <div className="record-field">
                                                <span className="field-label">Primary Diagnosis</span>
                                                <p className="diagnosis-text">{record.diagnosis}</p>
                                            </div>

                                            <div className="record-field">
                                                <span className="field-label">Treatment Plan</span>
                                                <p className="treatment-text">{record.treatment || "Standard therapeutic monitoring."}</p>
                                            </div>

                                            {record.prescription && (
                                                <div className="record-field prescription-field">
                                                    <span className="field-label">
                                                        <Pill size={13} /> Prescribed Medication
                                                    </span>
                                                    <p className="prescription-text">{record.prescription}</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="record-card-footer">
                                            <button
                                                className="view-details-btn"
                                                onClick={() => setSelectedRecord(record)}
                                            >
                                                <Eye size={16} />
                                                <span>View Full Details</span>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        /* Table View */
                        <div className="records-table-container">
                            <table className="custom-records-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Physician</th>
                                        <th>Specialty</th>
                                        <th>Hospital</th>
                                        <th>Diagnosis</th>
                                        <th>Prescription</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRecords.map((record) => {
                                        const docName = record.doctor_name || "Physician";
                                        const dept = record.doctor_specialization || "General Medicine";
                                        const hospital = record.hospital_name || "HealthLink Hospital";
                                        const visitDate = formatDate(record.date || record.visit_date);

                                        return (
                                            <tr key={record.id}>
                                                <td className="date-cell">
                                                    <Calendar size={14} />
                                                    <span>{visitDate}</span>
                                                </td>
                                                <td className="doc-cell">
                                                    <strong>{docName}</strong>
                                                </td>
                                                <td>
                                                    <span className="dept-pill">{dept}</span>
                                                </td>
                                                <td className="hospital-cell">{hospital}</td>
                                                <td className="diag-cell">{record.diagnosis}</td>
                                                <td className="rx-cell">
                                                    {record.prescription ? (
                                                        <span className="rx-pill">
                                                            <Pill size={12} /> {record.prescription}
                                                        </span>
                                                    ) : (
                                                        <span className="no-rx">None</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <button
                                                        className="table-view-btn"
                                                        onClick={() => setSelectedRecord(record)}
                                                    >
                                                        <Eye size={15} /> View
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Detail Inspection Modal */}
                {selectedRecord && (
                    <div className="record-modal-backdrop" onClick={() => setSelectedRecord(null)}>
                        <div className="record-modal-dialog" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <div className="modal-title-wrap">
                                    <FileText size={22} color="#2563eb" />
                                    <h3>Clinical Record #{selectedRecord.id}</h3>
                                </div>
                                <button className="modal-close-btn" onClick={() => setSelectedRecord(null)}>
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="modal-body print-section">
                                <div className="modal-meta-grid">
                                    <div className="meta-item">
                                        <span className="meta-label">Patient Name</span>
                                        <strong>{patient?.user_details?.full_name || patient?.user_details?.username || "Patient"}</strong>
                                    </div>
                                    <div className="meta-item">
                                        <span className="meta-label">Visit Date</span>
                                        <strong>{formatDate(selectedRecord.date || selectedRecord.visit_date)}</strong>
                                    </div>
                                    <div className="meta-item">
                                        <span className="meta-label">Attending Doctor</span>
                                        <strong>{selectedRecord.doctor_name}</strong>
                                    </div>
                                    <div className="meta-item">
                                        <span className="meta-label">Department</span>
                                        <strong>{selectedRecord.doctor_specialization || "General Medicine"}</strong>
                                    </div>
                                    <div className="meta-item full">
                                        <span className="meta-label">Medical Facility</span>
                                        <strong>{selectedRecord.hospital_name || "HealthLink Central Hospital"}</strong>
                                    </div>
                                </div>

                                <div className="modal-section">
                                    <h4>Clinical Diagnosis</h4>
                                    <div className="section-content highlight">
                                        {selectedRecord.diagnosis}
                                    </div>
                                </div>

                                <div className="modal-section">
                                    <h4>Administered Treatment & Recommendations</h4>
                                    <div className="section-content">
                                        {selectedRecord.treatment || "Standard clinical care and observation."}
                                    </div>
                                </div>

                                {selectedRecord.prescription && (
                                    <div className="modal-section">
                                        <h4>Prescription & Dosage Details</h4>
                                        <div className="section-content rx">
                                            <Pill size={16} />
                                            <span>{selectedRecord.prescription}</span>
                                        </div>
                                    </div>
                                )}

                                {selectedRecord.notes && (
                                    <div className="modal-section">
                                        <h4>Physician Notes</h4>
                                        <div className="section-content notes">
                                            {selectedRecord.notes}
                                        </div>
                                    </div>
                                )}

                                <div style={{
                                    marginTop: "16px",
                                    padding: "10px 14px",
                                    background: "#f8fafc",
                                    border: "1px solid #e2e8f0",
                                    borderRadius: "8px",
                                    fontSize: "0.78rem",
                                    color: "#64748b",
                                    lineHeight: "1.4"
                                }}>
                                    🔒 <strong>Official Clinical Record:</strong> Certified by {selectedRecord.doctor_name || "attending physician"}. In accordance with healthcare standards, clinical medical records cannot be deleted or modified by patients or administrative staff.
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button className="modal-print-btn" onClick={handlePrint}>
                                    <Printer size={16} /> Print Report
                                </button>
                                <button className="modal-close-action" onClick={() => setSelectedRecord(null)}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <Footer />
            </main>
        </div>
    );
}

export default MedicalRecords;
