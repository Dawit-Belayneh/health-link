import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import "./PatientTable.css";
import {
    Search,
    Eye,
    FileText,
    Phone,
    Droplets,
    ShieldCheck,
    Lock,
    Clock,
    UserPlus,
    X,
    CheckCircle2,
    AlertCircle,
    AlertTriangle,
    Activity,
    HeartPulse,
    Calendar,
    Pill,
    FilePlus2,
    Thermometer,
    RefreshCw,
    Users,
    Siren
} from "lucide-react";
import {
    getDoctorPatients,
    getPatientHealthData,
    sendAccessRequest,
    requestEmergencyAccess,
    createDoctorMedicalRecord,
    createDoctorPrescription
} from "../../services/doctor";

function PatientTable() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState("my_patients"); // "my_patients" or "all"

    // Request Access Modal
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [targetPatient, setTargetPatient] = useState(null);
    const [requestNotes, setRequestNotes] = useState("");
    const [requestSubmitting, setRequestSubmitting] = useState(false);

    // Emergency Access Modal
    const [showEmergencyModal, setShowEmergencyModal] = useState(false);
    const [emergencyTargetPatient, setEmergencyTargetPatient] = useState(null);
    const [emergencyReason, setEmergencyReason] = useState("");
    const [emergencyContactName, setEmergencyContactName] = useState("");
    const [emergencyContactPhone, setEmergencyContactPhone] = useState("");
    const [emergencySubmitting, setEmergencySubmitting] = useState(false);
    const [emergencyError, setEmergencyError] = useState("");

    // Health Records Modal
    const [showHealthModal, setShowHealthModal] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [healthData, setHealthData] = useState(null);
    const [healthLoading, setHealthLoading] = useState(false);
    const [healthTab, setHealthTab] = useState("vitals");

    // Add Medical Record Modal
    const [showRecordModal, setShowRecordModal] = useState(false);
    const [recordForm, setRecordForm] = useState({
        diagnosis: "",
        treatment: "",
        prescription: "",
        notes: ""
    });
    const [recordSubmitting, setRecordSubmitting] = useState(false);

    // Toast
    const [toast, setToast] = useState({ message: "", type: "success" });

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast({ message: "", type: "success" }), 4500);
    };

    const fetchPatients = async () => {
        try {
            setLoading(true);
            const data = await getDoctorPatients(searchTerm, activeFilter);
            setPatients(Array.isArray(data) ? data : (data.results || []));
        } catch (err) {
            console.error("Failed to load doctor patients:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, [searchTerm, activeFilter]);

    useEffect(() => {
        if (showRequestModal || showEmergencyModal || showHealthModal || showRecordModal) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [showRequestModal, showEmergencyModal, showHealthModal, showRecordModal]);

    // Handle Open Request Modal
    const handleOpenRequestModal = (patient) => {
        setTargetPatient(patient);
        setRequestNotes("Clinical consultation, diagnosis review, and ongoing vitals tracking.");
        setShowRequestModal(true);
    };

    // Handle Open Emergency Access Modal
    const handleOpenEmergencyModal = (patient) => {
        setEmergencyTargetPatient(patient);
        setEmergencyReason("Acute medical emergency: Immediate clinical evaluation and biomarker tracking required.");
        setEmergencyContactName(patient.emergency_contact_name || "");
        setEmergencyContactPhone(patient.emergency_contact_phone || "");
        setEmergencyError("");
        setShowEmergencyModal(true);
    };

    // Handle Emergency Verification & Grant
    const handleEmergencySubmit = async (e) => {
        e.preventDefault();
        if (!emergencyTargetPatient) return;
        setEmergencySubmitting(true);
        setEmergencyError("");

        try {
            await requestEmergencyAccess(
                emergencyTargetPatient.id,
                emergencyReason,
                emergencyContactName,
                emergencyContactPhone
            );
            showToast(`Emergency clinical access verified & granted for ${emergencyTargetPatient.name}!`, "success");
            setShowEmergencyModal(false);

            // Update patient locally
            setPatients(prev => prev.map(p => {
                if (p.id === emergencyTargetPatient.id) {
                    return {
                        ...p,
                        permission_status: "approved",
                        status: "Active",
                        has_permission: true,
                        is_emergency_approved: true
                    };
                }
                return p;
            }));

            // Automatically open health viewer for urgent clinical treatment
            handleViewHealthData({
                ...emergencyTargetPatient,
                permission_status: "approved",
                has_permission: true
            });
        } catch (err) {
            console.error("Emergency access request failed:", err);
            const msg = err.response?.data?.detail || "Emergency contact verification failed. Please ensure the emergency contact name or phone matches the patient's record.";
            setEmergencyError(msg);
        } finally {
            setEmergencySubmitting(false);
        }
    };

    // Handle Submit Access Request
    const handleSendRequest = async (e) => {
        e.preventDefault();
        if (!targetPatient) return;
        setRequestSubmitting(true);

        try {
            await sendAccessRequest(targetPatient.id, requestNotes);
            showToast(`Access permission request sent to ${targetPatient.name}. Waiting for patient approval.`);
            setShowRequestModal(false);
            // Update patient locally
            setPatients(prev => prev.map(p => {
                if (p.id === targetPatient.id) {
                    return { ...p, permission_status: "pending", status: "Pending" };
                }
                return p;
            }));
        } catch (err) {
            console.error("Send access request error:", err);
            const msg = err.response?.data?.detail || "Failed to send access request.";
            showToast(msg, "error");
        } finally {
            setRequestSubmitting(false);
        }
    };

    // Handle Open Health Viewer Modal (Only if permitted)
    const handleViewHealthData = async (patient) => {
        setSelectedPatient(patient);
        setShowHealthModal(true);
        setHealthLoading(true);
        setHealthTab("vitals");

        try {
            const data = await getPatientHealthData(patient.id);
            setHealthData(data);
        } catch (err) {
            console.error("Load health data error:", err);
            if (err.response && err.response.status === 403) {
                showToast("Access denied: Patient has not granted permission.", "error");
                setShowHealthModal(false);
            } else {
                showToast("Failed to load patient health records.", "error");
            }
        } finally {
            setHealthLoading(false);
        }
    };

    // Handle Add Medical Record Submit
    const handleRecordSubmit = async (e) => {
        e.preventDefault();
        if (!selectedPatient) return;
        setRecordSubmitting(true);

        try {
            await createDoctorMedicalRecord({
                patient: selectedPatient.id,
                diagnosis: recordForm.diagnosis,
                treatment: recordForm.treatment,
                prescription: recordForm.prescription,
                notes: recordForm.notes
            });
            showToast(`Consultation record added for ${selectedPatient.name}!`);
            setShowRecordModal(false);
            setRecordForm({ diagnosis: "", treatment: "", prescription: "", notes: "" });
            
            // Refresh health modal data
            const updated = await getPatientHealthData(selectedPatient.id);
            setHealthData(updated);
        } catch (err) {
            console.error("Failed to add medical record:", err);
            showToast(err.response?.data?.detail || "Failed to record consultation.", "error");
        } finally {
            setRecordSubmitting(false);
        }
    };

    return (
        <section className="patient-table">
            <div className="patient-header">
                <div>
                    <h2>Patient Health Directory & Permissions</h2>
                    <p>Access patient clinical records with explicit patient permission</p>
                </div>

                <div className="patient-tools-wrapper" style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <div className="patient-search">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search patient by name, phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={fetchPatients}
                        style={{
                            padding: "10px 14px",
                            background: "#eff6ff",
                            color: "#2563eb",
                            border: "1px solid #bfdbfe",
                            borderRadius: "12px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px"
                        }}
                        title="Refresh Directory"
                    >
                        <RefreshCw size={16} />
                        <span>Refresh</span>
                    </button>
                </div>
            </div>

            {/* Filter Toggle: My Patients (Caseload) vs All Patients */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                <button
                    onClick={() => setActiveFilter("my_patients")}
                    style={{
                        padding: "8px 18px",
                        borderRadius: "24px",
                        border: activeFilter === "my_patients" ? "2px solid #2563eb" : "1px solid #cbd5e1",
                        background: activeFilter === "my_patients" ? "#eff6ff" : "#ffffff",
                        color: activeFilter === "my_patients" ? "#1d4ed8" : "#64748b",
                        fontWeight: "600",
                        fontSize: "0.88rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        transition: "all 0.2s"
                    }}
                >
                    <Users size={16} />
                    <span>My Patients (Active Caseload)</span>
                </button>

                <button
                    onClick={() => setActiveFilter("all")}
                    style={{
                        padding: "8px 18px",
                        borderRadius: "24px",
                        border: activeFilter === "all" ? "2px solid #2563eb" : "1px solid #cbd5e1",
                        background: activeFilter === "all" ? "#eff6ff" : "#ffffff",
                        color: activeFilter === "all" ? "#1d4ed8" : "#64748b",
                        fontWeight: "600",
                        fontSize: "0.88rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        transition: "all 0.2s"
                    }}
                >
                    <Search size={16} />
                    <span>Find New Patient / Hospital Registry</span>
                </button>
            </div>

            {toast.message && (
                <div style={{
                    padding: "12px 16px",
                    backgroundColor: toast.type === "error" ? "#fef2f2" : "#dcfce7",
                    color: toast.type === "error" ? "#b91c1c" : "#15803d",
                    border: `1px solid ${toast.type === "error" ? "#fecaca" : "#bbf7d0"}`,
                    borderRadius: "10px",
                    marginBottom: "20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px"
                }}>
                    {toast.type === "error" ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
                    <span>{toast.message}</span>
                </div>
            )}

            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Patient</th>
                            <th>Blood</th>
                            <th>Phone</th>
                            <th>Last Activity</th>
                            <th>Access Permission</th>
                            <th>Clinical Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                                    Loading patient registry...
                                </td>
                            </tr>
                        ) : patients.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                                    {searchTerm
                                        ? "No patients match your search term."
                                        : activeFilter === "my_patients"
                                        ? "No active patients in your caseload. Switch to 'Find New Patient / Hospital Registry' to search and request access."
                                        : "No registered patients found."}
                                </td>
                            </tr>
                        ) : (
                            patients.map((patient) => {
                                const isApproved = patient.permission_status === "approved" || patient.has_permission;
                                const isPending = patient.permission_status === "pending";

                                return (
                                    <tr key={patient.id}>
                                        <td>
                                            <div className="patient-info">
                                                <div className="avatar">
                                                    {patient.name?.charAt(0) || "P"}
                                                </div>
                                                <div>
                                                    <strong>{patient.name}</strong>
                                                    <small>{patient.age} Yrs • {patient.gender}</small>
                                                </div>
                                            </div>
                                        </td>

                                        <td>
                                            <div className="cell">
                                                <Droplets size={16} color="#ef4444" />
                                                {patient.blood}
                                            </div>
                                        </td>

                                        <td>
                                            <div className="cell">
                                                <Phone size={16} />
                                                {patient.phone}
                                            </div>
                                        </td>

                                        <td>
                                            {patient.lastVisit}
                                        </td>

                                        <td>
                                            {isApproved ? (
                                                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                                    <span style={{
                                                        display: "inline-flex",
                                                        alignItems: "center",
                                                        gap: "6px",
                                                        padding: "6px 12px",
                                                        borderRadius: "20px",
                                                        fontSize: "0.82rem",
                                                        fontWeight: "600",
                                                        backgroundColor: patient.is_emergency_approved ? "#fee2e2" : "#dcfce7",
                                                        color: patient.is_emergency_approved ? "#b91c1c" : "#15803d"
                                                    }}>
                                                        {patient.is_emergency_approved ? <AlertTriangle size={15} /> : <ShieldCheck size={16} />}
                                                        {patient.is_emergency_approved ? "Emergency Override" : "Permission Granted"}
                                                    </span>
                                                    {patient.is_emergency_approved && (
                                                        <span style={{ fontSize: "0.72rem", color: "#b91c1c", fontWeight: "500", paddingLeft: "4px" }}>
                                                            Verified via Emergency Contact
                                                        </span>
                                                    )}
                                                </div>
                                            ) : isPending ? (
                                                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                                    <span style={{
                                                        display: "inline-flex",
                                                        alignItems: "center",
                                                        gap: "6px",
                                                        padding: "6px 12px",
                                                        borderRadius: "20px",
                                                        fontSize: "0.82rem",
                                                        fontWeight: "600",
                                                        backgroundColor: "#fef9c3",
                                                        color: "#854d0e"
                                                    }}>
                                                        <Clock size={16} />
                                                        Request Pending
                                                    </span>
                                                    <span style={{ fontSize: "0.72rem", color: "#64748b", paddingLeft: "4px" }}>
                                                        Awaiting patient response
                                                    </span>
                                                </div>
                                            ) : (
                                                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                                    <span style={{
                                                        display: "inline-flex",
                                                        alignItems: "center",
                                                        gap: "6px",
                                                        padding: "6px 12px",
                                                        borderRadius: "20px",
                                                        fontSize: "0.82rem",
                                                        fontWeight: "600",
                                                        backgroundColor: "#f1f5f9",
                                                        color: "#64748b"
                                                    }}>
                                                        <Lock size={15} />
                                                        No Permission
                                                    </span>
                                                    {patient.has_emergency_contact && (
                                                        <span style={{ fontSize: "0.72rem", color: "#0284c7", fontWeight: "500", paddingLeft: "4px" }}>
                                                            Emergency contact on file
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </td>

                                        <td>
                                            <div className="actions" style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                                {isApproved ? (
                                                    <>
                                                        <button
                                                            className="view-btn"
                                                            title="Inspect Full Health Data (Vitals, Records, Meds)"
                                                            onClick={() => handleViewHealthData(patient)}
                                                            style={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: "6px",
                                                                padding: "8px 14px",
                                                                width: "auto",
                                                                borderRadius: "8px",
                                                                background: "#2563eb",
                                                                color: "#ffffff",
                                                                border: "none",
                                                                fontWeight: "600",
                                                                fontSize: "0.82rem",
                                                                cursor: "pointer"
                                                            }}
                                                        >
                                                            <Eye size={16} />
                                                            <span>View Data</span>
                                                        </button>

                                                        <button
                                                            className="record-btn"
                                                            title="Add Medical Consultation Record"
                                                            onClick={() => {
                                                                setSelectedPatient(patient);
                                                                setShowRecordModal(true);
                                                            }}
                                                            style={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                padding: "8px",
                                                                borderRadius: "8px",
                                                                background: "#eff6ff",
                                                                color: "#2563eb",
                                                                border: "1px solid #bfdbfe",
                                                                cursor: "pointer"
                                                            }}
                                                        >
                                                            <FilePlus2 size={16} />
                                                        </button>
                                                    </>
                                                ) : isPending ? (
                                                    <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                                                        <button
                                                            disabled
                                                            style={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: "4px",
                                                                padding: "8px 10px",
                                                                borderRadius: "8px",
                                                                background: "#f8fafc",
                                                                color: "#94a3b8",
                                                                border: "1px solid #e2e8f0",
                                                                fontSize: "0.8rem",
                                                                cursor: "not-allowed"
                                                            }}
                                                        >
                                                            <Clock size={14} />
                                                            <span>Pending</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleOpenEmergencyModal(patient)}
                                                            title="Emergency override verified via patient emergency contact"
                                                            style={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: "4px",
                                                                padding: "8px 10px",
                                                                borderRadius: "8px",
                                                                background: "#fef2f2",
                                                                color: "#dc2626",
                                                                border: "1px solid #fecaca",
                                                                fontWeight: "600",
                                                                fontSize: "0.8rem",
                                                                cursor: "pointer"
                                                            }}
                                                        >
                                                            <AlertTriangle size={14} />
                                                            <span>Emergency</span>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                                                        <button
                                                            onClick={() => handleOpenRequestModal(patient)}
                                                            style={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: "4px",
                                                                padding: "8px 12px",
                                                                borderRadius: "8px",
                                                                background: "#0284c7",
                                                                color: "#ffffff",
                                                                border: "none",
                                                                fontWeight: "600",
                                                                fontSize: "0.82rem",
                                                                cursor: "pointer"
                                                            }}
                                                            title="Send permission request to patient"
                                                        >
                                                            <UserPlus size={15} />
                                                            <span>Request Access</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleOpenEmergencyModal(patient)}
                                                            style={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: "4px",
                                                                padding: "8px 10px",
                                                                borderRadius: "8px",
                                                                background: "#dc2626",
                                                                color: "#ffffff",
                                                                border: "none",
                                                                fontWeight: "600",
                                                                fontSize: "0.8rem",
                                                                cursor: "pointer"
                                                            }}
                                                            title="Emergency override verified via patient emergency contact"
                                                        >
                                                            <AlertTriangle size={14} />
                                                            <span>Emergency</span>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* --- REQUEST ACCESS MODAL --- */}
            {showRequestModal && targetPatient && createPortal(
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    backgroundColor: "rgba(15, 23, 42, 0.6)",
                    backdropFilter: "blur(4px)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 99999,
                    padding: "20px"
                }}>
                    <div style={{
                        background: "#ffffff",
                        borderRadius: "16px",
                        width: "100%",
                        maxWidth: "480px",
                        padding: "26px",
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "#e0f2fe", color: "#0284c7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <UserPlus size={22} />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, color: "#0f172a", fontSize: "1.15rem" }}>Request Patient Permission</h3>
                                    <p style={{ margin: 0, color: "#64748b", fontSize: "0.85rem" }}>Ask patient for consent to view health data</p>
                                </div>
                            </div>
                            <button onClick={() => setShowRequestModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}>
                                <X size={20} />
                            </button>
                        </div>

                        <div style={{
                            padding: "12px 16px",
                            backgroundColor: "#f8fafc",
                            border: "1px solid #e2e8f0",
                            borderRadius: "10px",
                            marginBottom: "18px"
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                                <span style={{ color: "#64748b", fontSize: "0.85rem" }}>Target Patient:</span>
                                <strong style={{ color: "#0f172a" }}>{targetPatient.name}</strong>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ color: "#64748b", fontSize: "0.85rem" }}>Demographics:</span>
                                <span style={{ color: "#334155", fontSize: "0.85rem" }}>{targetPatient.age} Yrs • Blood: {targetPatient.blood}</span>
                            </div>
                        </div>

                        <div style={{
                            padding: "10px 14px",
                            backgroundColor: "#eff6ff",
                            border: "1px solid #bfdbfe",
                            borderRadius: "8px",
                            color: "#1e40af",
                            fontSize: "0.82rem",
                            marginBottom: "16px"
                        }}>
                            ℹ️ Under privacy regulations, patient health data is protected. Once you submit, the patient will receive an authorization prompt in their portal to approve or decline access.
                        </div>

                        <form onSubmit={handleSendRequest}>
                            <div style={{ marginBottom: "18px" }}>
                                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
                                    Clinical Reason / Consultation Notes
                                </label>
                                <textarea
                                    rows="3"
                                    value={requestNotes}
                                    onChange={(e) => setRequestNotes(e.target.value)}
                                    placeholder="Explain the medical purpose for requesting access to this patient's records..."
                                    required
                                    style={{
                                        width: "100%",
                                        padding: "10px 12px",
                                        borderRadius: "8px",
                                        border: "1px solid #cbd5e1",
                                        fontSize: "0.9rem",
                                        fontFamily: "inherit",
                                        boxSizing: "border-box"
                                    }}
                                />
                            </div>

                            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                                <button
                                    type="button"
                                    onClick={() => setShowRequestModal(false)}
                                    style={{
                                        padding: "10px 16px",
                                        borderRadius: "8px",
                                        border: "1px solid #cbd5e1",
                                        background: "#f8fafc",
                                        color: "#475569",
                                        fontWeight: "600",
                                        cursor: "pointer"
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={requestSubmitting}
                                    style={{
                                        padding: "10px 20px",
                                        borderRadius: "8px",
                                        border: "none",
                                        background: "#0284c7",
                                        color: "#ffffff",
                                        fontWeight: "600",
                                        cursor: requestSubmitting ? "not-allowed" : "pointer"
                                    }}
                                >
                                    {requestSubmitting ? "Sending..." : "Send Permission Request"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}

            {/* --- EMERGENCY ACCESS MODAL --- */}
            {showEmergencyModal && emergencyTargetPatient && createPortal(
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    backgroundColor: "rgba(15, 23, 42, 0.65)",
                    backdropFilter: "blur(4px)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 99999,
                    padding: "20px"
                }}>
                    <div style={{
                        background: "#ffffff",
                        borderRadius: "16px",
                        width: "100%",
                        maxWidth: "520px",
                        maxHeight: "92vh",
                        overflowY: "auto",
                        padding: "26px",
                        boxShadow: "0 20px 25px -5px rgba(220, 38, 38, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#fee2e2", color: "#dc2626", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <AlertTriangle size={22} />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, color: "#991b1b", fontSize: "1.15rem" }}>Emergency Access Protocol</h3>
                                    <p style={{ margin: 0, color: "#64748b", fontSize: "0.82rem" }}>Verify via Patient's Emergency Contact</p>
                                </div>
                            </div>
                            <button onClick={() => setShowEmergencyModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}>
                                <X size={20} />
                            </button>
                        </div>

                        {/* Warning Banner */}
                        <div style={{
                            padding: "12px 14px",
                            backgroundColor: "#fff1f2",
                            border: "1px solid #fecdd3",
                            borderRadius: "10px",
                            color: "#9f1239",
                            fontSize: "0.82rem",
                            marginBottom: "16px",
                            lineHeight: "1.45"
                        }}>
                            <strong>⚠️ Emergency Clinical Override:</strong> When a patient cannot provide direct authorization due to an acute emergency, clinical access can be granted by verifying the patient's registered <strong>Emergency Contact</strong>. All emergency overrides are permanently logged and notify the patient.
                        </div>

                        {/* Target Patient Summary */}
                        <div style={{
                            padding: "12px 16px",
                            backgroundColor: "#f8fafc",
                            border: "1px solid #e2e8f0",
                            borderRadius: "10px",
                            marginBottom: "16px"
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                                <span style={{ color: "#64748b", fontSize: "0.85rem" }}>Patient:</span>
                                <strong style={{ color: "#0f172a" }}>{emergencyTargetPatient.name}</strong>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                                <span style={{ color: "#64748b", fontSize: "0.85rem" }}>Demographics:</span>
                                <span style={{ color: "#334155", fontSize: "0.85rem" }}>{emergencyTargetPatient.age} Yrs • Blood: {emergencyTargetPatient.blood}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ color: "#64748b", fontSize: "0.85rem" }}>Emergency Contact Relationship:</span>
                                <span style={{ color: "#0f172a", fontWeight: "600", fontSize: "0.85rem" }}>
                                    {emergencyTargetPatient.emergency_contact_relationship || "Family / Next of Kin"}
                                </span>
                            </div>
                        </div>

                        {emergencyError && (
                            <div style={{
                                padding: "10px 14px",
                                backgroundColor: "#fef2f2",
                                border: "1px solid #fecaca",
                                borderRadius: "8px",
                                color: "#b91c1c",
                                fontSize: "0.85rem",
                                marginBottom: "14px"
                            }}>
                                {emergencyError}
                            </div>
                        )}

                        <form onSubmit={handleEmergencySubmit}>
                            <div style={{ marginBottom: "14px" }}>
                                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
                                    Medical Emergency Reason *
                                </label>
                                <textarea
                                    rows="2"
                                    value={emergencyReason}
                                    onChange={(e) => setEmergencyReason(e.target.value)}
                                    placeholder="e.g. Unconscious acute trauma, sudden cardiac event in emergency ward..."
                                    required
                                    style={{
                                        width: "100%",
                                        padding: "10px 12px",
                                        borderRadius: "8px",
                                        border: "1px solid #cbd5e1",
                                        fontSize: "0.88rem",
                                        boxSizing: "border-box",
                                        fontFamily: "inherit"
                                    }}
                                />
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                                <div>
                                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
                                        Emergency Contact Name
                                    </label>
                                    <input
                                        type="text"
                                        value={emergencyContactName}
                                        onChange={(e) => setEmergencyContactName(e.target.value)}
                                        placeholder="e.g. Next-of-kin name"
                                        style={{
                                            width: "100%",
                                            padding: "10px 12px",
                                            borderRadius: "8px",
                                            border: "1px solid #cbd5e1",
                                            fontSize: "0.88rem",
                                            boxSizing: "border-box"
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
                                        Emergency Contact Phone
                                    </label>
                                    <input
                                        type="text"
                                        value={emergencyContactPhone}
                                        onChange={(e) => setEmergencyContactPhone(e.target.value)}
                                        placeholder="e.g. +251 911 000000"
                                        style={{
                                            width: "100%",
                                            padding: "10px 12px",
                                            borderRadius: "8px",
                                            border: "1px solid #cbd5e1",
                                            fontSize: "0.88rem",
                                            boxSizing: "border-box"
                                        }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                                <button
                                    type="button"
                                    onClick={() => setShowEmergencyModal(false)}
                                    style={{
                                        padding: "10px 16px",
                                        borderRadius: "8px",
                                        border: "1px solid #cbd5e1",
                                        background: "#f8fafc",
                                        color: "#475569",
                                        fontWeight: "600",
                                        cursor: "pointer"
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={emergencySubmitting}
                                    style={{
                                        padding: "10px 20px",
                                        borderRadius: "8px",
                                        border: "none",
                                        background: "#dc2626",
                                        color: "#ffffff",
                                        fontWeight: "600",
                                        cursor: emergencySubmitting ? "not-allowed" : "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "6px"
                                    }}
                                >
                                    <AlertTriangle size={16} />
                                    {emergencySubmitting ? "Verifying Contact..." : "Verify & Unlock Access"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}

            {/* --- FULL CLINICAL HEALTH VIEWER MODAL --- */}
            {showHealthModal && selectedPatient && createPortal(
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    backgroundColor: "rgba(15, 23, 42, 0.65)",
                    backdropFilter: "blur(4px)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 99999,
                    padding: "20px"
                }}>
                    <div style={{
                        background: "#ffffff",
                        borderRadius: "20px",
                        width: "100%",
                        maxWidth: "850px",
                        maxHeight: "92vh",
                        display: "flex",
                        flexDirection: "column",
                        boxShadow: "0 25px 30px -5px rgba(0, 0, 0, 0.2)",
                        overflow: "hidden"
                    }}>
                        {/* Modal Header */}
                        <div style={{
                            padding: "20px 26px",
                            backgroundColor: "#0f172a",
                            color: "#ffffff",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}>
                            <div>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <h3 style={{ margin: 0, fontSize: "1.3rem" }}>{selectedPatient.name}</h3>
                                    <span style={{
                                        backgroundColor: "#166534",
                                        color: "#bbf7d0",
                                        padding: "3px 10px",
                                        borderRadius: "12px",
                                        fontSize: "0.75rem",
                                        fontWeight: "600",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "4px"
                                    }}>
                                        <ShieldCheck size={14} /> Verified Permission
                                    </span>
                                </div>
                                <p style={{ margin: "4px 0 0", color: "#94a3b8", fontSize: "0.85rem" }}>
                                    {selectedPatient.age} Yrs • {selectedPatient.gender} • Blood Type: <strong>{selectedPatient.blood}</strong> • Phone: {selectedPatient.phone}
                                </p>
                            </div>

                            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                <button
                                    onClick={() => setShowRecordModal(true)}
                                    style={{
                                        padding: "8px 14px",
                                        background: "#2563eb",
                                        color: "#ffffff",
                                        border: "none",
                                        borderRadius: "8px",
                                        fontSize: "0.85rem",
                                        fontWeight: "600",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "6px"
                                    }}
                                >
                                    <FilePlus2 size={16} />
                                    <span>Add Consultation</span>
                                </button>
                                <button
                                    onClick={() => setShowHealthModal(false)}
                                    style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", padding: "6px" }}
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Modal Navigation Tabs */}
                        <div style={{
                            display: "flex",
                            borderBottom: "1px solid #e2e8f0",
                            backgroundColor: "#f8fafc",
                            padding: "0 26px"
                        }}>
                            <button
                                onClick={() => setHealthTab("vitals")}
                                style={{
                                    padding: "14px 18px",
                                    border: "none",
                                    background: "none",
                                    fontWeight: "600",
                                    fontSize: "0.9rem",
                                    cursor: "pointer",
                                    color: healthTab === "vitals" ? "#2563eb" : "#64748b",
                                    borderBottom: healthTab === "vitals" ? "2px solid #2563eb" : "2px solid transparent",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px"
                                }}
                            >
                                <HeartPulse size={18} />
                                <span>Vitals & Biomarkers ({healthData?.vitals?.length || 0})</span>
                            </button>

                            <button
                                onClick={() => setHealthTab("records")}
                                style={{
                                    padding: "14px 18px",
                                    border: "none",
                                    background: "none",
                                    fontWeight: "600",
                                    fontSize: "0.9rem",
                                    cursor: "pointer",
                                    color: healthTab === "records" ? "#2563eb" : "#64748b",
                                    borderBottom: healthTab === "records" ? "2px solid #2563eb" : "2px solid transparent",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px"
                                }}
                            >
                                <FileText size={18} />
                                <span>Clinical Records ({healthData?.medical_records?.length || 0})</span>
                            </button>

                            <button
                                onClick={() => setHealthTab("medications")}
                                style={{
                                    padding: "14px 18px",
                                    border: "none",
                                    background: "none",
                                    fontWeight: "600",
                                    fontSize: "0.9rem",
                                    cursor: "pointer",
                                    color: healthTab === "medications" ? "#2563eb" : "#64748b",
                                    borderBottom: healthTab === "medications" ? "2px solid #2563eb" : "2px solid transparent",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px"
                                }}
                            >
                                <Pill size={18} />
                                <span>Prescriptions ({healthData?.prescriptions?.length || 0})</span>
                            </button>

                            <button
                                onClick={() => setHealthTab("appointments")}
                                style={{
                                    padding: "14px 18px",
                                    border: "none",
                                    background: "none",
                                    fontWeight: "600",
                                    fontSize: "0.9rem",
                                    cursor: "pointer",
                                    color: healthTab === "appointments" ? "#2563eb" : "#64748b",
                                    borderBottom: healthTab === "appointments" ? "2px solid #2563eb" : "2px solid transparent",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px"
                                }}
                            >
                                <Calendar size={18} />
                                <span>Appointments ({healthData?.appointments?.length || 0})</span>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div style={{ padding: "26px", overflowY: "auto", flex: 1 }}>
                            {healthLoading ? (
                                <div style={{ textAlign: "center", padding: "60px", color: "#64748b" }}>
                                    Loading live clinical file...
                                </div>
                            ) : !healthData ? (
                                <div style={{ textAlign: "center", padding: "60px", color: "#64748b" }}>
                                    Unable to load health file.
                                </div>
                            ) : (
                                <>
                                    {/* --- VITALS TAB --- */}
                                    {healthTab === "vitals" && (
                                        <div>
                                            {/* Latest Vitals Hero Cards */}
                                            {healthData.latest_vitals ? (
                                                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "24px" }}>
                                                    <div style={{ padding: "16px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "12px" }}>
                                                        <span style={{ color: "#166534", fontSize: "0.8rem", fontWeight: "600" }}>BLOOD PRESSURE</span>
                                                        <h3 style={{ margin: "6px 0 0", color: "#14532d", fontSize: "1.4rem" }}>
                                                            {healthData.latest_vitals.systolic}/{healthData.latest_vitals.diastolic} <span style={{ fontSize: "0.85rem", fontWeight: "normal" }}>mmHg</span>
                                                        </h3>
                                                    </div>
                                                    <div style={{ padding: "16px", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "12px" }}>
                                                        <span style={{ color: "#1e40af", fontSize: "0.8rem", fontWeight: "600" }}>HEART RATE</span>
                                                        <h3 style={{ margin: "6px 0 0", color: "#1e3a8a", fontSize: "1.4rem" }}>
                                                            {healthData.latest_vitals.heart_rate} <span style={{ fontSize: "0.85rem", fontWeight: "normal" }}>BPM</span>
                                                        </h3>
                                                    </div>
                                                    <div style={{ padding: "16px", background: "#faf5ff", border: "1px solid #e9d5ff", borderRadius: "12px" }}>
                                                        <span style={{ color: "#6b21a8", fontSize: "0.8rem", fontWeight: "600" }}>OXYGEN LEVEL</span>
                                                        <h3 style={{ margin: "6px 0 0", color: "#581c87", fontSize: "1.4rem" }}>
                                                            {healthData.latest_vitals.oxygen_level}%
                                                        </h3>
                                                    </div>
                                                    <div style={{ padding: "16px", background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: "12px" }}>
                                                        <span style={{ color: "#9a3412", fontSize: "0.8rem", fontWeight: "600" }}>BLOOD GLUCOSE</span>
                                                        <h3 style={{ margin: "6px 0 0", color: "#7c2d12", fontSize: "1.4rem" }}>
                                                            {healthData.latest_vitals.blood_glucose} <span style={{ fontSize: "0.85rem", fontWeight: "normal" }}>mg/dL</span>
                                                        </h3>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p style={{ color: "#64748b", fontStyle: "italic", marginBottom: "20px" }}>No vitals measurements recorded yet.</p>
                                            )}

                                            <h4 style={{ color: "#0f172a", marginBottom: "12px" }}>Recorded Vitals Timeline</h4>
                                            <div style={{ border: "1px solid #e2e8f0", borderRadius: "12px", overflow: "hidden" }}>
                                                <table style={{ width: "100%", fontSize: "0.88rem" }}>
                                                    <thead>
                                                        <tr style={{ background: "#f8fafc" }}>
                                                            <th>Date & Time</th>
                                                            <th>BP (mmHg)</th>
                                                            <th>Pulse (BPM)</th>
                                                            <th>SpO2</th>
                                                            <th>Temp (°C)</th>
                                                            <th>Glucose</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {healthData.vitals?.map((v) => (
                                                            <tr key={v.id} style={{ borderTop: "1px solid #f1f5f9" }}>
                                                                <td>{new Date(v.recorded_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</td>
                                                                <td><strong>{v.systolic}/{v.diastolic}</strong></td>
                                                                <td>{v.heart_rate}</td>
                                                                <td>{v.oxygen_level}%</td>
                                                                <td>{v.temperature}°C</td>
                                                                <td>{v.blood_glucose} mg/dL</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}

                                    {/* --- MEDICAL RECORDS TAB --- */}
                                    {healthTab === "records" && (
                                        <div>
                                            {healthData.medical_records?.length === 0 ? (
                                                <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                                                    No clinical records found. Click 'Add Consultation' to create the first record.
                                                </div>
                                            ) : (
                                                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                                    {healthData.medical_records?.map((rec) => (
                                                        <div key={rec.id} style={{
                                                            padding: "18px",
                                                            border: "1px solid #e2e8f0",
                                                            borderRadius: "12px",
                                                            background: "#ffffff",
                                                            boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
                                                        }}>
                                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                                                                <h4 style={{ margin: 0, color: "#1e293b", fontSize: "1.1rem" }}>{rec.diagnosis}</h4>
                                                                <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                                                                    {new Date(rec.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                                                </span>
                                                            </div>
                                                            <p style={{ margin: "0 0 10px", color: "#334155", fontSize: "0.9rem" }}>
                                                                <strong>Treatment:</strong> {rec.treatment}
                                                            </p>
                                                            {rec.prescription && (
                                                                <p style={{ margin: "0 0 10px", color: "#2563eb", fontSize: "0.85rem", background: "#eff6ff", padding: "6px 10px", borderRadius: "6px" }}>
                                                                    <strong>Rx:</strong> {rec.prescription}
                                                                </p>
                                                            )}
                                                            {rec.notes && (
                                                                <p style={{ margin: "0 0 10px", color: "#64748b", fontSize: "0.85rem" }}>
                                                                    <em>Notes:</em> {rec.notes}
                                                                </p>
                                                            )}
                                                            <div style={{ fontSize: "0.78rem", color: "#94a3b8" }}>
                                                                Physician: {rec.doctor_name} • {rec.hospital_name}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* --- MEDICATIONS TAB --- */}
                                    {healthTab === "medications" && (
                                        <div>
                                            {healthData.prescriptions?.length === 0 ? (
                                                <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                                                    No active medications prescribed yet.
                                                </div>
                                            ) : (
                                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                                                    {healthData.prescriptions?.map((med) => (
                                                        <div key={med.id} style={{
                                                            padding: "16px",
                                                            border: "1px solid #e2e8f0",
                                                            borderRadius: "12px",
                                                            background: "#f8fafc"
                                                        }}>
                                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                                                                <strong style={{ color: "#0f172a", fontSize: "1rem" }}>{med.medication_name}</strong>
                                                                <span style={{
                                                                    padding: "3px 8px",
                                                                    borderRadius: "12px",
                                                                    fontSize: "0.75rem",
                                                                    fontWeight: "600",
                                                                    backgroundColor: med.refill_status === "Active" ? "#dcfce7" : "#fef9c3",
                                                                    color: med.refill_status === "Active" ? "#166534" : "#854d0e"
                                                                }}>
                                                                    {med.refill_status}
                                                                </span>
                                                            </div>
                                                            <div style={{ color: "#2563eb", fontSize: "0.88rem", fontWeight: "600", marginBottom: "4px" }}>
                                                                {med.dosage} • {med.frequency}
                                                            </div>
                                                            <p style={{ margin: "4px 0", color: "#64748b", fontSize: "0.82rem" }}>
                                                                {med.instructions || "Take as clinically directed."}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* --- APPOINTMENTS TAB --- */}
                                    {healthTab === "appointments" && (
                                        <div>
                                            {healthData.appointments?.length === 0 ? (
                                                <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                                                    No appointment history recorded.
                                                </div>
                                            ) : (
                                                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                                    {healthData.appointments?.map((apt) => (
                                                        <div key={apt.id} style={{
                                                            display: "flex",
                                                            justifyContent: "space-between",
                                                            alignItems: "center",
                                                            padding: "14px 18px",
                                                            border: "1px solid #e2e8f0",
                                                            borderRadius: "10px",
                                                            background: "#ffffff"
                                                        }}>
                                                            <div>
                                                                <strong style={{ color: "#0f172a" }}>{apt.appointment_type} Consultation</strong>
                                                                <p style={{ margin: "3px 0 0", color: "#64748b", fontSize: "0.82rem" }}>
                                                                    Physician: {apt.doctor_name || "Doctor"} • Room: {apt.room || "Room 101"}
                                                                </p>
                                                            </div>
                                                            <div style={{ textAlign: "right" }}>
                                                                <div style={{ fontWeight: "600", color: "#1e293b", fontSize: "0.9rem" }}>
                                                                    {apt.date} at {apt.time}
                                                                </div>
                                                                <span style={{ fontSize: "0.78rem", color: apt.status === "Confirmed" ? "#16a34a" : "#64748b" }}>
                                                                    {apt.status}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div style={{
                            padding: "16px 26px",
                            backgroundColor: "#f8fafc",
                            borderTop: "1px solid #e2e8f0",
                            display: "flex",
                            justifyContent: "flex-end"
                        }}>
                            <button
                                onClick={() => setShowHealthModal(false)}
                                style={{
                                    padding: "10px 20px",
                                    borderRadius: "8px",
                                    border: "1px solid #cbd5e1",
                                    background: "#ffffff",
                                    color: "#334155",
                                    fontWeight: "600",
                                    cursor: "pointer"
                                }}
                            >
                                Close File
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* --- ADD MEDICAL RECORD MODAL --- */}
            {showRecordModal && selectedPatient && createPortal(
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    backgroundColor: "rgba(15, 23, 42, 0.6)",
                    backdropFilter: "blur(4px)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 99999,
                    padding: "20px"
                }}>
                    <div style={{
                        background: "#ffffff",
                        borderRadius: "16px",
                        width: "100%",
                        maxWidth: "540px",
                        padding: "26px",
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "#eff6ff", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <FilePlus2 size={22} />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, color: "#0f172a" }}>Record Medical Consultation</h3>
                                    <p style={{ margin: 0, color: "#64748b", fontSize: "0.85rem" }}>For {selectedPatient.name}</p>
                                </div>
                            </div>
                            <button onClick={() => setShowRecordModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleRecordSubmit}>
                            <div style={{ marginBottom: "14px" }}>
                                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>Diagnosis *</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Acute Bronchitis / Hypertension Stage 1"
                                    value={recordForm.diagnosis}
                                    onChange={(e) => setRecordForm({ ...recordForm, diagnosis: e.target.value })}
                                    required
                                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.9rem", boxSizing: "border-box" }}
                                />
                            </div>

                            <div style={{ marginBottom: "14px" }}>
                                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>Clinical Treatment *</label>
                                <textarea
                                    rows="2"
                                    placeholder="Clinical interventions, recommended rest, lifestyle changes..."
                                    value={recordForm.treatment}
                                    onChange={(e) => setRecordForm({ ...recordForm, treatment: e.target.value })}
                                    required
                                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.9rem", boxSizing: "border-box", fontFamily: "inherit" }}
                                />
                            </div>

                            <div style={{ marginBottom: "14px" }}>
                                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>Prescription (Medication & Dosage)</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Amoxicillin - 500mg (3 times daily for 7 days)"
                                    value={recordForm.prescription}
                                    onChange={(e) => setRecordForm({ ...recordForm, prescription: e.target.value })}
                                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.9rem", boxSizing: "border-box" }}
                                />
                            </div>

                            <div style={{ marginBottom: "20px" }}>
                                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>Clinical Notes / Follow-up Advice</label>
                                <textarea
                                    rows="2"
                                    placeholder="Optional notes for the patient or future clinical reference..."
                                    value={recordForm.notes}
                                    onChange={(e) => setRecordForm({ ...recordForm, notes: e.target.value })}
                                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.9rem", boxSizing: "border-box", fontFamily: "inherit" }}
                                />
                            </div>

                            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                                <button
                                    type="button"
                                    onClick={() => setShowRecordModal(false)}
                                    style={{ padding: "10px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "#f8fafc", color: "#475569", fontWeight: "600", cursor: "pointer" }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={recordSubmitting}
                                    style={{ padding: "10px 22px", borderRadius: "8px", border: "none", background: "#2563eb", color: "#ffffff", fontWeight: "600", cursor: recordSubmitting ? "not-allowed" : "pointer" }}
                                >
                                    {recordSubmitting ? "Saving Record..." : "Save Record"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}
        </section>
    );
}

export default PatientTable;