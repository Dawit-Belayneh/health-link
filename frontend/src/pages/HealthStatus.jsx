import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./HealthStatus.css";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Footer from "../components/Footer";

import { getPatientProfile, getMedicalRecords, getVitals, logVitals, updatePatientProfile } from "../services/patient";
import {
    HeartPulse,
    Activity,
    Droplets,
    Ruler,
    Weight,
    Thermometer,
    Wind,
    Plus,
    CheckCircle2,
    AlertTriangle,
    ShieldCheck,
    Calendar,
    X,
    TrendingUp,
    Info,
    Sparkles
} from "lucide-react";

function HealthStatus() {
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [records, setRecords] = useState([]);
    const [vitalsHistory, setVitalsHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Vitals State loaded from database
    const [vitals, setVitals] = useState({
        systolic: 120,
        diastolic: 80,
        heartRate: 72,
        oxygen: 98,
        temperature: 36.6,
        glucose: 94,
        recordedAt: "Today, 09:30 AM"
    });

    const [showLogModal, setShowLogModal] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    // Log Vitals Form State
    const [logForm, setLogForm] = useState({
        systolic: 120,
        diastolic: 80,
        heartRate: 72,
        oxygen: 98,
        temperature: 36.6,
        glucose: 94,
        height: "",
        weight: ""
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
                const [patientData, recordsData, vitalsData] = await Promise.all([
                    getPatientProfile(),
                    getMedicalRecords(),
                    getVitals()
                ]);
                setPatient(patientData);
                const recordList = Array.isArray(recordsData)
                    ? recordsData
                    : (recordsData.results || []);
                setRecords(recordList);

                const vList = Array.isArray(vitalsData) ? vitalsData : (vitalsData.results || []);
                setVitalsHistory(vList);
                if (vList.length > 0) {
                    const latest = vList[0];
                    setVitals({
                        systolic: latest.systolic,
                        diastolic: latest.diastolic,
                        heartRate: latest.heart_rate,
                        oxygen: latest.oxygen_level,
                        temperature: parseFloat(latest.temperature),
                        glucose: latest.blood_glucose,
                        recordedAt: latest.recorded_at 
                            ? new Date(latest.recorded_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
                            : "Recent assessment"
                    });
                }

                // Populate log form height and weight
                setLogForm(prev => ({
                    ...prev,
                    height: patientData.height || "",
                    weight: patientData.weight || ""
                }));
            } catch (err) {
                console.error("Failed to load health status:", err);
                if (err.response && err.response.status === 401) {
                    navigate("/login");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    const handleSaveVitals = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                systolic: Number(logForm.systolic),
                diastolic: Number(logForm.diastolic),
                heart_rate: Number(logForm.heartRate),
                oxygen_level: Number(logForm.oxygen),
                temperature: Number(logForm.temperature),
                blood_glucose: Number(logForm.glucose),
                height: logForm.height ? parseFloat(logForm.height) : undefined,
                weight: logForm.weight ? parseFloat(logForm.weight) : undefined,
                notes: "Patient logged vitals from portal"
            };

            const saved = await logVitals(payload);
            setVitalsHistory(prev => [saved, ...prev]);
            setVitals({
                systolic: saved.systolic,
                diastolic: saved.diastolic,
                heartRate: saved.heart_rate,
                oxygen: saved.oxygen_level,
                temperature: parseFloat(saved.temperature),
                glucose: saved.blood_glucose,
                recordedAt: "Just now"
            });

            if (logForm.height || logForm.weight) {
                setPatient(prev => ({
                    ...prev,
                    height: logForm.height ? parseFloat(logForm.height) : prev?.height,
                    weight: logForm.weight ? parseFloat(logForm.weight) : prev?.weight
                }));
            }

            setShowLogModal(false);
            setToastMessage("Vitals successfully saved to database and clinical profile updated!");
            setTimeout(() => setToastMessage(""), 5000);
        } catch (err) {
            console.error("Failed to log vitals:", err);
            alert("Failed to save vitals. Please check values.");
        }
    };

    // Calculate BMI
    const currentHeight = patient?.height || 178;
    const currentWeight = patient?.weight || 72;
    const hM = Number(currentHeight) / 100;
    const wKg = Number(currentWeight);
    const bmiVal = (wKg / (hM * hM)).toFixed(1);

    let bmiCategory = "Normal";
    let bmiColor = "#10b981";
    if (bmiVal < 18.5) {
        bmiCategory = "Underweight";
        bmiColor = "#f59e0b";
    } else if (bmiVal < 25) {
        bmiCategory = "Normal Weight";
        bmiColor = "#10b981";
    } else if (bmiVal < 30) {
        bmiCategory = "Overweight";
        bmiColor = "#f97316";
    } else {
        bmiCategory = "Obese";
        bmiColor = "#ef4444";
    }

    // Health score calculation
    let healthScore = 92;
    if (vitals.systolic > 135 || vitals.diastolic > 88) healthScore -= 8;
    if (vitals.heartRate > 90 || vitals.heartRate < 55) healthScore -= 6;
    if (vitals.oxygen < 95) healthScore -= 10;
    if (bmiVal > 28 || bmiVal < 18) healthScore -= 5;

    return (
        <div className="patient-dashboard">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <main className="dashboard-main">
                <Topbar
                    patient={patient}
                    onToggleSidebar={() => setSidebarOpen(prev => !prev)}
                />

                <div className="health-page-container">
                    {/* Header */}
                    <div className="health-header">
                        <div className="header-left">
                            <div className="header-badge">
                                <HeartPulse size={24} className="header-icon" />
                                <h2>Health Status & Vital Signs</h2>
                            </div>
                            <p>Real-time biometric telemetry, baseline clinical metrics, and diagnostic indicators.</p>
                        </div>

                        <div className="header-actions">
                            <button
                                className="log-vitals-btn"
                                onClick={() => setShowLogModal(true)}
                            >
                                <Plus size={18} />
                                <span>Log New Vitals</span>
                            </button>
                        </div>
                    </div>

                    {/* Toast */}
                    {toastMessage && (
                        <div className="health-toast">
                            <CheckCircle2 size={20} />
                            <span>{toastMessage}</span>
                            <button onClick={() => setToastMessage("")}>
                                <X size={16} />
                            </button>
                        </div>
                    )}

                    {/* Hero Health Score Card */}
                    <div className="health-score-hero">
                        <div className="score-circle-wrap">
                            <div className="score-ring">
                                <span className="score-number">{healthScore}</span>
                                <span className="score-total">/ 100</span>
                            </div>
                        </div>

                        <div className="score-details">
                            <div className="score-title-row">
                                <h3>Overall Health Index</h3>
                                <span className="score-badge">
                                    <Sparkles size={15} /> Optimal Condition
                                </span>
                            </div>
                            <p className="score-desc">
                                Your vitals indicate stable physiological cardiovascular metrics and optimal blood oxygen saturation.
                                Last measured: <strong>{vitals.recordedAt}</strong>.
                            </p>

                            <div className="score-checks">
                                <div className="score-check-item">
                                    <CheckCircle2 size={16} color="#10b981" />
                                    <span>Blood Pressure in Normal Range</span>
                                </div>
                                <div className="score-check-item">
                                    <CheckCircle2 size={16} color="#10b981" />
                                    <span>Healthy Resting Heart Rhythm</span>
                                </div>
                                <div className="score-check-item">
                                    <CheckCircle2 size={16} color="#10b981" />
                                    <span>Normal Blood Oxygen Levels</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 6 Core Vitals Cards Grid */}
                    <div className="vitals-grid">
                        {/* 1. Blood Pressure */}
                        <div className="vital-card">
                            <div className="vital-header">
                                <div className="vital-icon red">
                                    <Activity size={22} />
                                </div>
                                <span className="vital-status normal">Normal</span>
                            </div>
                            <div className="vital-body">
                                <span className="vital-label">Blood Pressure</span>
                                <div className="vital-value-row">
                                    <span className="vital-number">{vitals.systolic}/{vitals.diastolic}</span>
                                    <span className="vital-unit">mmHg</span>
                                </div>
                                <p className="vital-hint">Systolic / Diastolic resting</p>
                            </div>
                            <div className="vital-range-bar">
                                <div className="range-indicator" style={{ width: "65%", background: "#10b981" }} />
                            </div>
                        </div>

                        {/* 2. Heart Rate */}
                        <div className="vital-card">
                            <div className="vital-header">
                                <div className="vital-icon pink pulse">
                                    <HeartPulse size={22} />
                                </div>
                                <span className="vital-status normal">Resting</span>
                            </div>
                            <div className="vital-body">
                                <span className="vital-label">Heart Rate</span>
                                <div className="vital-value-row">
                                    <span className="vital-number">{vitals.heartRate}</span>
                                    <span className="vital-unit">BPM</span>
                                </div>
                                <p className="vital-hint">Standard healthy range: 60-100</p>
                            </div>
                            <div className="vital-range-bar">
                                <div className="range-indicator" style={{ width: "55%", background: "#ec4899" }} />
                            </div>
                        </div>

                        {/* 3. SpO2 Oxygen */}
                        <div className="vital-card">
                            <div className="vital-header">
                                <div className="vital-icon blue">
                                    <Wind size={22} />
                                </div>
                                <span className="vital-status normal">Optimal</span>
                            </div>
                            <div className="vital-body">
                                <span className="vital-label">Blood Oxygen (SpO2)</span>
                                <div className="vital-value-row">
                                    <span className="vital-number">{vitals.oxygen}%</span>
                                    <span className="vital-unit">Saturation</span>
                                </div>
                                <p className="vital-hint">Standard: 95% - 100%</p>
                            </div>
                            <div className="vital-range-bar">
                                <div className="range-indicator" style={{ width: `${vitals.oxygen}%`, background: "#2563eb" }} />
                            </div>
                        </div>

                        {/* 4. Body Temperature */}
                        <div className="vital-card">
                            <div className="vital-header">
                                <div className="vital-icon amber">
                                    <Thermometer size={22} />
                                </div>
                                <span className="vital-status normal">Normal</span>
                            </div>
                            <div className="vital-body">
                                <span className="vital-label">Body Temperature</span>
                                <div className="vital-value-row">
                                    <span className="vital-number">{vitals.temperature}</span>
                                    <span className="vital-unit">°C</span>
                                </div>
                                <p className="vital-hint">Equivalent to {(vitals.temperature * 1.8 + 32).toFixed(1)}°F</p>
                            </div>
                            <div className="vital-range-bar">
                                <div className="range-indicator" style={{ width: "50%", background: "#f59e0b" }} />
                            </div>
                        </div>

                        {/* 5. Blood Glucose */}
                        <div className="vital-card">
                            <div className="vital-header">
                                <div className="vital-icon purple">
                                    <Droplets size={22} />
                                </div>
                                <span className="vital-status normal">Fasting</span>
                            </div>
                            <div className="vital-body">
                                <span className="vital-label">Blood Glucose</span>
                                <div className="vital-value-row">
                                    <span className="vital-number">{vitals.glucose}</span>
                                    <span className="vital-unit">mg/dL</span>
                                </div>
                                <p className="vital-hint">Normal fasting range: 70-99</p>
                            </div>
                            <div className="vital-range-bar">
                                <div className="range-indicator" style={{ width: "48%", background: "#8b5cf6" }} />
                            </div>
                        </div>

                        {/* 6. BMI */}
                        <div className="vital-card">
                            <div className="vital-header">
                                <div className="vital-icon green">
                                    <Weight size={22} />
                                </div>
                                <span className="vital-status" style={{ color: bmiColor, background: "#f0fdf4" }}>
                                    {bmiCategory}
                                </span>
                            </div>
                            <div className="vital-body">
                                <span className="vital-label">Body Mass Index (BMI)</span>
                                <div className="vital-value-row">
                                    <span className="vital-number">{bmiVal}</span>
                                    <span className="vital-unit">kg/m²</span>
                                </div>
                                <p className="vital-hint">{currentHeight} cm • {currentWeight} kg</p>
                            </div>
                            <div className="vital-range-bar">
                                <div className="range-indicator" style={{ width: `${Math.min(100, (bmiVal / 40) * 100)}%`, background: bmiColor }} />
                            </div>
                        </div>
                    </div>

                    {/* Vitals History & Trends */}
                    <div className="vitals-trends-panel">
                        <div className="panel-header-row">
                            <div>
                                <h3>Biometric Trends (Past Visits)</h3>
                                <p>Recorded telemetry across clinical consultations</p>
                            </div>
                            <span className="trend-badge">
                                <TrendingUp size={16} /> All Parameters Stable
                            </span>
                        </div>

                        <div className="trends-chart-mock">
                            <div className="chart-bars-wrap">
                                {(vitalsHistory.length > 0 
                                    ? [...vitalsHistory].reverse().slice(-5)
                                    : [
                                        { recorded_at: new Date().toISOString(), systolic: vitals.systolic, diastolic: vitals.diastolic, heart_rate: vitals.heartRate }
                                    ]
                                ).map((v, idx) => {
                                    const d = v.recorded_at ? new Date(v.recorded_at) : new Date();
                                    const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                                    const bpStr = `${v.systolic}/${v.diastolic}`;
                                    const sysVal = v.systolic || 120;
                                    const hrVal = v.heart_rate || 72;
                                    return (
                                        <div key={idx} className="chart-column">
                                            <div className="bar-group">
                                                <div
                                                    className="bar-bp"
                                                    style={{ height: `${(sysVal / 160) * 140}px` }}
                                                    title={`BP: ${bpStr} mmHg`}
                                                >
                                                    <span className="bar-tooltip">{bpStr}</span>
                                                </div>
                                                <div
                                                    className="bar-hr"
                                                    style={{ height: `${(hrVal / 120) * 120}px` }}
                                                    title={`Heart Rate: ${hrVal} bpm`}
                                                >
                                                    <span className="bar-tooltip">{hrVal} bpm</span>
                                                </div>
                                            </div>
                                            <span className="col-date">{dateStr}</span>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="chart-legend">
                                <div className="legend-item">
                                    <div className="legend-box bp" />
                                    <span>Systolic BP (mmHg)</span>
                                </div>
                                <div className="legend-item">
                                    <div className="legend-box hr" />
                                    <span>Heart Rate (bpm)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Medical Baseline Profile */}
                    <div className="baseline-profile-grid">
                        <div className="baseline-card">
                            <div className="baseline-icon blue">
                                <Droplets size={24} />
                            </div>
                            <div>
                                <h4>Blood Profile</h4>
                                <p>Type: <strong>{patient?.blood_type || "O+"}</strong></p>
                                <span className="sub-hint">Compatible with standard emergency reserves</span>
                            </div>
                        </div>

                        <div className="baseline-card">
                            <div className="baseline-icon red">
                                <AlertTriangle size={24} />
                            </div>
                            <div>
                                <h4>Known Allergies</h4>
                                <p><strong>{patient?.allergies || "None reported"}</strong></p>
                                <span className="sub-hint">Documented in electronic health records</span>
                            </div>
                        </div>

                        <div className="baseline-card">
                            <div className="baseline-icon green">
                                <ShieldCheck size={24} />
                            </div>
                            <div>
                                <h4>Emergency Contact</h4>
                                <p><strong>{patient?.emergency_contact_name || "None designated"}</strong></p>
                                <span className="sub-hint">
                                    {patient?.emergency_contact_phone
                                        ? `${patient.emergency_contact_relationship ? patient.emergency_contact_relationship + ' • ' : ''}${patient.emergency_contact_phone}`
                                        : "No emergency contact phone"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Log Vitals Modal */}
                {showLogModal && (
                    <div className="health-modal-backdrop" onClick={() => setShowLogModal(false)}>
                        <div className="health-modal-dialog" onClick={(e) => e.stopPropagation()}>
                            <div className="health-modal-header">
                                <div className="h-modal-title">
                                    <HeartPulse size={22} color="#2563eb" />
                                    <h3>Log New Vital Signs</h3>
                                </div>
                                <button className="modal-close-btn" onClick={() => setShowLogModal(false)}>
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSaveVitals} className="health-modal-form">
                                <div className="form-row-two">
                                    <div className="form-group">
                                        <label>Systolic Pressure (mmHg)</label>
                                        <input
                                            type="number"
                                            value={logForm.systolic}
                                            onChange={(e) => setLogForm({ ...logForm, systolic: e.target.value })}
                                            placeholder="e.g. 120"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Diastolic Pressure (mmHg)</label>
                                        <input
                                            type="number"
                                            value={logForm.diastolic}
                                            onChange={(e) => setLogForm({ ...logForm, diastolic: e.target.value })}
                                            placeholder="e.g. 80"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-row-two">
                                    <div className="form-group">
                                        <label>Heart Rate (BPM)</label>
                                        <input
                                            type="number"
                                            value={logForm.heartRate}
                                            onChange={(e) => setLogForm({ ...logForm, heartRate: e.target.value })}
                                            placeholder="e.g. 72"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Blood Oxygen (SpO2 %)</label>
                                        <input
                                            type="number"
                                            value={logForm.oxygen}
                                            onChange={(e) => setLogForm({ ...logForm, oxygen: e.target.value })}
                                            placeholder="e.g. 98"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-row-two">
                                    <div className="form-group">
                                        <label>Body Temperature (°C)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={logForm.temperature}
                                            onChange={(e) => setLogForm({ ...logForm, temperature: e.target.value })}
                                            placeholder="e.g. 36.6"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Fasting Blood Glucose (mg/dL)</label>
                                        <input
                                            type="number"
                                            value={logForm.glucose}
                                            onChange={(e) => setLogForm({ ...logForm, glucose: e.target.value })}
                                            placeholder="e.g. 94"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-row-two">
                                    <div className="form-group">
                                        <label>Height (cm)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={logForm.height}
                                            onChange={(e) => setLogForm({ ...logForm, height: e.target.value })}
                                            placeholder="e.g. 178"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Weight (kg)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={logForm.weight}
                                            onChange={(e) => setLogForm({ ...logForm, weight: e.target.value })}
                                            placeholder="e.g. 72"
                                        />
                                    </div>
                                </div>

                                <div className="health-modal-footer">
                                    <button
                                        type="button"
                                        className="btn-cancel"
                                        onClick={() => setShowLogModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn-submit"
                                    >
                                        Save & Update Metrics
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <Footer />
            </main>
        </div>
    );
}

export default HealthStatus;
