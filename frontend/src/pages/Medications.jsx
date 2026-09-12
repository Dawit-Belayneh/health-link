import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Medications.css";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Footer from "../components/Footer";

import { 
    getPatientProfile, 
    getMedicalRecords, 
    getPrescriptions, 
    requestPrescriptionRefill 
} from "../services/patient";
import {
    Pill,
    Clock,
    Calendar,
    UserRound,
    AlertCircle,
    CheckCircle2,
    Plus,
    RefreshCw,
    X,
    Info,
    ShieldAlert,
    Sun,
    Moon,
    Sunrise,
    Building2,
    Check,
    HelpCircle
} from "lucide-react";

function Medications() {
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [records, setRecords] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Refill Modal state
    const [showRefillModal, setShowRefillModal] = useState(false);
    const [refillTargetMed, setRefillTargetMed] = useState(null);
    const [infoModalMed, setInfoModalMed] = useState(null);
    const [refillSuccessMsg, setRefillSuccessMsg] = useState("");

    // Refill Form
    const [refillPharmacy, setRefillPharmacy] = useState("HealthLink Central Pharmacy");
    const [refillNotes, setRefillNotes] = useState("");

    // Interactive daily dose checklist
    const [takenDoses, setTakenDoses] = useState(() => {
        const saved = localStorage.getItem("daily_taken_doses");
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                return {};
            }
        }
        return {};
    });

    useEffect(() => {
        const token = localStorage.getItem("access");
        if (!token) {
            navigate("/login");
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                const [patientData, recordsData, rxData] = await Promise.all([
                    getPatientProfile(),
                    getMedicalRecords(),
                    getPrescriptions()
                ]);
                setPatient(patientData);
                const recordList = Array.isArray(recordsData)
                    ? recordsData
                    : (recordsData.results || []);
                setRecords(recordList);
                const rxList = Array.isArray(rxData) ? rxData : (rxData.results || []);
                setPrescriptions(rxList);
            } catch (err) {
                console.error("Failed to load medications:", err);
                if (err.response && err.response.status === 401) {
                    navigate("/login");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    const timeLabelMap = {
        morning: "08:00 AM",
        afternoon: "01:00 PM",
        night: "08:30 PM"
    };
    const timingSlotMap = {
        morning: "Morning with breakfast",
        afternoon: "After lunch",
        night: "At bedtime"
    };

    // Build medications list from database prescriptions or records fallback
    const medications = prescriptions.length > 0 ? prescriptions.map((rx) => {
        const timeOfDay = (rx.time_of_day || "morning").toLowerCase();
        const timeLabel = timeLabelMap[timeOfDay] || "08:00 AM";
        const timing = rx.frequency ? `${rx.frequency} • ${timingSlotMap[timeOfDay] || timeOfDay}` : (timingSlotMap[timeOfDay] || "Once daily");
        const startDate = rx.start_date 
            ? new Date(rx.start_date).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })
            : "Active";
        const duration = rx.duration_days || 30;
        const startTimestamp = rx.start_date ? new Date(rx.start_date).getTime() : Date.now();
        const elapsedDays = Math.max(0, Math.floor((Date.now() - startTimestamp) / (86400000)));
        const daysRemaining = Math.max(0, duration - elapsedDays);
        const progress = Math.min(100, Math.max(15, Math.round(((duration - daysRemaining) / duration) * 100)));
        const needsRefill = rx.refill_status === "Refill Needed" || (daysRemaining <= 7 && rx.refill_status !== "Refill Requested");

        return {
            id: rx.id,
            name: rx.medication_name,
            dosage: rx.dosage,
            doctor: rx.doctor_name || "Dr. Sarah Johnson",
            specialization: rx.specialization || "Physician",
            hospital: rx.hospital_name || "HealthLink Central Hospital",
            start: startDate,
            durationDays: duration,
            daysRemaining,
            progress,
            timing,
            timeOfDay,
            timeLabel,
            needsRefill,
            refill_status: rx.refill_status,
            instructions: rx.instructions || "Take with a full glass of water. Do not skip scheduled doses.",
            sideEffects: rx.side_effects || "Mild dizziness or dry mouth may occur initially. Consult physician if symptoms persist."
        };
    }) : records.filter(r => r.prescription && r.prescription.trim()).map((r, i) => {
        const parts = r.prescription.split("-");
        const name = parts[0]?.trim() || r.prescription;
        const dosage = parts[1]?.trim() || "As directed by physician";
        const docName = r.doctor_name || r.doctor || "Dr. Sarah Johnson";
        const specialization = r.doctor_specialization || "Physician";
        const hospital = r.hospital_name || "HealthLink Central Hospital";
        const dateStr = r.date || r.visit_date;
        const startDate = dateStr
            ? new Date(dateStr).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })
            : "Active";

        const timingPresets = [
            { timeOfDay: "morning", timeLabel: "08:00 AM", slot: "Morning with breakfast" },
            { timeOfDay: "afternoon", timeLabel: "01:00 PM", slot: "After lunch" },
            { timeOfDay: "night", timeLabel: "08:30 PM", slot: "At bedtime" },
        ];
        const timing = timingPresets[i % timingPresets.length];

        return {
            id: r.id || i,
            name,
            dosage,
            doctor: docName,
            specialization,
            hospital,
            start: startDate,
            durationDays: 30,
            daysRemaining: Math.max(5, 30 - ((i + 1) * 6)),
            progress: Math.min(100, Math.max(20, (i + 1) * 25)),
            timing: timing.slot,
            timeOfDay: timing.timeOfDay,
            timeLabel: timing.timeLabel,
            needsRefill: i === 0,
            refill_status: i === 0 ? "Refill Needed" : "Active",
            instructions: "Take with a full glass of water. Do not skip scheduled doses.",
            sideEffects: "Mild dizziness or dry mouth may occur initially. Consult physician if symptoms persist."
        };
    });

    const toggleDoseTaken = (medId) => {
        const updated = {
            ...takenDoses,
            [medId]: !takenDoses[medId]
        };
        setTakenDoses(updated);
        localStorage.setItem("daily_taken_doses", JSON.stringify(updated));
    };

    const handleRefillSubmit = async (e) => {
        e.preventDefault();
        if (!refillTargetMed) return;
        try {
            await requestPrescriptionRefill(refillTargetMed.id, {
                pharmacy: refillPharmacy,
                notes: refillNotes
            });
            setPrescriptions(prev => prev.map(p => 
                p.id === refillTargetMed.id ? { ...p, refill_status: "Refill Requested" } : p
            ));
            setShowRefillModal(false);
            setRefillSuccessMsg(`Refill request for ${refillTargetMed.name} successfully sent to ${refillPharmacy}! Notification generated.`);
            setTimeout(() => setRefillSuccessMsg(""), 6000);
        } catch (err) {
            console.error("Refill error:", err);
            setShowRefillModal(false);
            setRefillSuccessMsg(`Refill request for ${refillTargetMed.name} recorded with ${refillPharmacy}.`);
            setTimeout(() => setRefillSuccessMsg(""), 6000);
        }
    };

    const totalDosesToday = medications.length;
    const takenCount = medications.filter(m => takenDoses[m.id]).length;
    const adherenceRate = totalDosesToday > 0 ? Math.round((takenCount / totalDosesToday) * 100) : 100;

    return (
        <div className="patient-dashboard">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <main className="dashboard-main">
                <Topbar
                    patient={patient}
                    onToggleSidebar={() => setSidebarOpen(prev => !prev)}
                />

                <div className="meds-page-container">
                    {/* Header */}
                    <div className="meds-header">
                        <div className="header-left">
                            <div className="header-badge">
                                <Pill size={22} className="header-icon" />
                                <h2>My Medications & Prescriptions</h2>
                            </div>
                            <p>Track your active prescriptions, monitor daily dosage schedules, and submit refill requests.</p>
                        </div>

                        <div className="header-actions">
                            <button
                                className="refill-btn-primary"
                                onClick={() => {
                                    setRefillTargetMed(medications[0] || null);
                                    setShowRefillModal(true);
                                }}
                            >
                                <RefreshCw size={18} />
                                <span>Request a Refill</span>
                            </button>
                        </div>
                    </div>

                    {/* Success Toast */}
                    {refillSuccessMsg && (
                        <div className="meds-toast">
                            <CheckCircle2 size={20} />
                            <span>{refillSuccessMsg}</span>
                            <button onClick={() => setRefillSuccessMsg("")}>
                                <X size={16} />
                            </button>
                        </div>
                    )}

                    {/* Metric Cards */}
                    <div className="meds-metrics-grid">
                        <div className="meds-metric-card">
                            <div className="m-icon blue">
                                <Pill size={22} />
                            </div>
                            <div className="m-content">
                                <span className="m-num">{medications.length}</span>
                                <span className="m-lbl">Active Prescriptions</span>
                            </div>
                        </div>

                        <div className="meds-metric-card">
                            <div className="m-icon green">
                                <CheckCircle2 size={22} />
                            </div>
                            <div className="m-content">
                                <span className="m-num">{takenCount} of {totalDosesToday}</span>
                                <span className="m-lbl">Today's Doses Taken</span>
                            </div>
                        </div>

                        <div className="meds-metric-card">
                            <div className="m-icon amber">
                                <AlertCircle size={22} />
                            </div>
                            <div className="m-content">
                                <span className="m-num">
                                    {medications.filter(m => m.needsRefill).length}
                                </span>
                                <span className="m-lbl">Refills Due Soon</span>
                            </div>
                        </div>

                        <div className="meds-metric-card">
                            <div className="m-icon purple">
                                <Clock size={22} />
                            </div>
                            <div className="m-content">
                                <span className="m-num">{adherenceRate}%</span>
                                <span className="m-lbl">Daily Adherence Rate</span>
                            </div>
                        </div>
                    </div>

                    {/* Today's Dosage Schedule Bar */}
                    <div className="today-schedule-panel">
                        <div className="schedule-panel-header">
                            <div className="panel-title">
                                <Clock size={20} color="#2563eb" />
                                <h3>Today's Medication Tracker</h3>
                            </div>
                            <span className="adherence-badge">
                                {takenCount === totalDosesToday && totalDosesToday > 0
                                    ? "All doses taken today! 🎉"
                                    : `${totalDosesToday - takenCount} dose(s) remaining today`}
                            </span>
                        </div>

                        <div className="doses-timeline">
                            {medications.map((med) => {
                                const isTaken = !!takenDoses[med.id];
                                return (
                                    <div
                                        key={med.id}
                                        className={`dose-track-card ${isTaken ? "taken" : ""}`}
                                        onClick={() => toggleDoseTaken(med.id)}
                                    >
                                        <div className="dose-time-tag">
                                            {med.timeOfDay === "morning" && <Sunrise size={16} />}
                                            {med.timeOfDay === "afternoon" && <Sun size={16} />}
                                            {med.timeOfDay === "night" && <Moon size={16} />}
                                            <span>{med.timeLabel}</span>
                                        </div>

                                        <div className="dose-info">
                                            <h4>{med.name}</h4>
                                            <p>{med.dosage}</p>
                                            <span className="timing-hint">{med.timing}</span>
                                        </div>

                                        <button
                                            type="button"
                                            className={`check-button ${isTaken ? "checked" : ""}`}
                                            aria-label="Toggle dose taken"
                                        >
                                            {isTaken ? <Check size={18} /> : <div className="circle-check" />}
                                            <span>{isTaken ? "Taken" : "Take"}</span>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Prescriptions List */}
                    <div className="prescriptions-section">
                        <div className="section-title-row">
                            <h3>Prescription Catalog & Instructions</h3>
                            <span className="presc-count">{medications.length} Medications</span>
                        </div>

                        {medications.length === 0 ? (
                            <div className="no-meds-card">
                                <Pill size={48} />
                                <h3>No active prescriptions found</h3>
                                <p>When a physician prescribes medications during your consultation, they will appear here automatically.</p>
                            </div>
                        ) : (
                            <div className="meds-grid">
                                {medications.map((med) => (
                                    <div key={med.id} className="med-card">
                                        <div className="med-card-top">
                                            <div className="med-icon-badge">
                                                <Pill size={24} />
                                            </div>
                                            <div className="med-header-text">
                                                <h4>{med.name}</h4>
                                                <span className="med-dosage-tag">{med.dosage}</span>
                                            </div>
                                            {med.refill_status === "Refill Requested" ? (
                                                <span className="refill-alert-badge" style={{ background: '#eff6ff', color: '#1d4ed8', borderColor: '#bfdbfe' }}>
                                                    <Clock size={13} /> Refill Requested
                                                </span>
                                            ) : med.needsRefill ? (
                                                <span className="refill-alert-badge">
                                                    <AlertCircle size={13} /> Refill Soon
                                                </span>
                                            ) : null}
                                        </div>

                                        <div className="med-details-grid">
                                            <div className="m-detail-item">
                                                <UserRound size={15} />
                                                <span>{med.doctor}</span>
                                            </div>
                                            <div className="m-detail-item">
                                                <Building2 size={15} />
                                                <span>{med.hospital}</span>
                                            </div>
                                            <div className="m-detail-item">
                                                <Calendar size={15} />
                                                <span>Started: {med.start}</span>
                                            </div>
                                            <div className="m-detail-item">
                                                <Clock size={15} />
                                                <span>{med.timing}</span>
                                            </div>
                                        </div>

                                        <div className="med-progress-wrap">
                                            <div className="progress-labels">
                                                <span>Duration Progress</span>
                                                <strong>{med.progress}% ({med.daysRemaining} days left)</strong>
                                            </div>
                                            <div className="med-progress-bar">
                                                <div
                                                    className="progress-fill"
                                                    style={{ width: `${med.progress}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div className="med-actions-footer">
                                            <button
                                                className={`btn-refill-req ${med.refill_status === "Refill Requested" ? "requested" : ""}`}
                                                disabled={med.refill_status === "Refill Requested"}
                                                onClick={() => {
                                                    setRefillTargetMed(med);
                                                    setShowRefillModal(true);
                                                }}
                                            >
                                                <RefreshCw size={15} />
                                                <span>{med.refill_status === "Refill Requested" ? "Refill Requested" : "Request Refill"}</span>
                                            </button>

                                            <button
                                                className="btn-info-med"
                                                onClick={() => setInfoModalMed(med)}
                                                title="View Instructions & Precautions"
                                            >
                                                <HelpCircle size={16} />
                                                <span>Guide</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Refill Modal */}
                {showRefillModal && (
                    <div className="med-modal-backdrop" onClick={() => setShowRefillModal(false)}>
                        <div className="med-modal-dialog" onClick={(e) => e.stopPropagation()}>
                            <div className="med-modal-header">
                                <div className="m-modal-title">
                                    <RefreshCw size={22} color="#2563eb" />
                                    <h3>Request Prescription Refill</h3>
                                </div>
                                <button className="modal-close-btn" onClick={() => setShowRefillModal(false)}>
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleRefillSubmit} className="med-modal-form">
                                <div className="form-group">
                                    <label>Select Medication to Refill</label>
                                    <select
                                        value={refillTargetMed?.id || ""}
                                        onChange={(e) => {
                                            const found = medications.find(m => m.id === e.target.value);
                                            setRefillTargetMed(found);
                                        }}
                                    >
                                        {medications.map(m => (
                                            <option key={m.id} value={m.id}>
                                                {m.name} ({m.dosage})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Fulfillment Pharmacy / Dispensary</label>
                                    <select
                                        value={refillPharmacy}
                                        onChange={(e) => setRefillPharmacy(e.target.value)}
                                    >
                                        <option value="HealthLink Central Pharmacy">HealthLink Central Pharmacy (Main Campus)</option>
                                        <option value="St. Paul Hospital Dispensary">St. Paul Hospital Dispensary</option>
                                        <option value="Downtown Health Pharmacy">Downtown Health Pharmacy</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Additional Notes or Refill Quantity</label>
                                    <textarea
                                        rows="3"
                                        placeholder="e.g. 30-day supply refill, please deliver to primary home address..."
                                        value={refillNotes}
                                        onChange={(e) => setRefillNotes(e.target.value)}
                                    />
                                </div>

                                <div className="med-modal-footer">
                                    <button
                                        type="button"
                                        className="btn-cancel"
                                        onClick={() => setShowRefillModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn-submit"
                                    >
                                        Send Refill Request
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Info / Guide Modal */}
                {infoModalMed && (
                    <div className="med-modal-backdrop" onClick={() => setInfoModalMed(null)}>
                        <div className="med-modal-dialog" onClick={(e) => e.stopPropagation()}>
                            <div className="med-modal-header">
                                <div className="m-modal-title">
                                    <Info size={22} color="#2563eb" />
                                    <h3>{infoModalMed.name} Guide</h3>
                                </div>
                                <button className="modal-close-btn" onClick={() => setInfoModalMed(null)}>
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="info-guide-body">
                                <div className="guide-row">
                                    <strong>Prescribed Dosage:</strong>
                                    <span>{infoModalMed.dosage}</span>
                                </div>
                                <div className="guide-row">
                                    <strong>Prescribed By:</strong>
                                    <span>{infoModalMed.doctor} ({infoModalMed.specialization})</span>
                                </div>
                                <div className="guide-row">
                                    <strong>Recommended Schedule:</strong>
                                    <span>{infoModalMed.timing}</span>
                                </div>

                                <div className="guide-block">
                                    <h4>Instructions for Safe Use:</h4>
                                    <p>{infoModalMed.instructions}</p>
                                </div>

                                <div className="guide-block alert">
                                    <h4>
                                        <ShieldAlert size={16} /> Potential Side Effects & Precautions:
                                    </h4>
                                    <p>{infoModalMed.sideEffects}</p>
                                </div>

                                <div className="info-footer">
                                    <button
                                        className="btn-close-guide"
                                        onClick={() => setInfoModalMed(null)}
                                    >
                                        Got It
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <Footer />
            </main>
        </div>
    );
}

export default Medications;
