import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Settings.css";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Footer from "../components/Footer";

import { getPatientProfile } from "../services/patient";
import {
    Settings as SettingsIcon,
    Shield,
    Bell,
    Lock,
    Eye,
    EyeOff,
    CheckCircle2,
    AlertTriangle,
    Save,
    Globe,
    Share2,
    Download,
    Trash2,
    Smartphone,
    Mail,
    MessageSquare,
    X,
    KeyRound
} from "lucide-react";

function Settings() {
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("security"); // "security", "notifications", "privacy", "preferences"

    // Feedback alert
    const [toastMessage, setToastMessage] = useState("");

    // Settings state
    const [settingsState, setSettingsState] = useState(() => {
        const saved = localStorage.getItem("patient_settings");
        if (saved) {
            try { return JSON.parse(saved); } catch (e) {}
        }
        return {
            twoFactorAuth: false,
            emailAlerts: true,
            smsAlerts: true,
            pushAlerts: true,
            refillReminders: true,
            recordsUpdateAlert: true,
            newsletter: false,
            emergencyAccess: true,
            hospitalNetworkSharing: true,
            language: "English",
            timezone: "Africa/Addis_Ababa (EAT)"
        };
    });

    // Password form state
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [passwordMsg, setPasswordMsg] = useState({ type: "", text: "" });

    useEffect(() => {
        const token = localStorage.getItem("access");
        if (!token) {
            navigate("/login");
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await getPatientProfile();
                setPatient(data);
            } catch (err) {
                console.error("Failed to load settings:", err);
                if (err.response && err.response.status === 401) {
                    navigate("/login");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    const handleToggle = (key) => {
        const updated = {
            ...settingsState,
            [key]: !settingsState[key]
        };
        setSettingsState(updated);
        localStorage.setItem("patient_settings", JSON.stringify(updated));
        showToast("Setting preference updated successfully.");
    };

    const handleSelectChange = (key, val) => {
        const updated = {
            ...settingsState,
            [key]: val
        };
        setSettingsState(updated);
        localStorage.setItem("patient_settings", JSON.stringify(updated));
        showToast("Preference saved.");
    };

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(""), 4000);
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        setPasswordMsg({ type: "", text: "" });

        if (!passwordForm.currentPassword) {
            setPasswordMsg({ type: "error", text: "Please enter your current password." });
            return;
        }

        if (passwordForm.newPassword.length < 8) {
            setPasswordMsg({ type: "error", text: "New password must be at least 8 characters long." });
            return;
        }

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPasswordMsg({ type: "error", text: "New passwords do not match." });
            return;
        }

        // Simulate password update
        setPasswordMsg({ type: "success", text: "Password changed successfully!" });
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setTimeout(() => setPasswordMsg({ type: "", text: "" }), 5000);
    };

    const handleExportData = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
            patientProfile: patient,
            exportedAt: new Date().toISOString(),
            platform: "HealthLink Patient Portal"
        }, null, 2));
        const downloadAnchor = document.createElement("a");
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `HealthLink_Medical_Data_${patient?.user_details?.username || "patient"}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        showToast("Personal medical record export downloaded successfully.");
    };

    return (
        <div className="patient-dashboard">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <main className="dashboard-main">
                <Topbar
                    patient={patient}
                    onToggleSidebar={() => setSidebarOpen(prev => !prev)}
                />

                <div className="settings-page-container">
                    {/* Header */}
                    <div className="settings-header">
                        <div className="header-left">
                            <div className="header-badge">
                                <SettingsIcon size={24} className="header-icon" />
                                <h2>Account & System Settings</h2>
                            </div>
                            <p>Configure your account security, notification alerts, privacy preferences, and language options.</p>
                        </div>
                    </div>

                    {/* Toast */}
                    {toastMessage && (
                        <div className="settings-toast">
                            <CheckCircle2 size={20} />
                            <span>{toastMessage}</span>
                            <button onClick={() => setToastMessage("")}>
                                <X size={16} />
                            </button>
                        </div>
                    )}

                    {/* Settings Layout: Left Nav Tabs, Right Section Content */}
                    <div className="settings-layout-grid">
                        {/* Sidebar Tabs */}
                        <div className="settings-nav-card">
                            <button
                                className={`settings-tab-btn ${activeSection === "security" ? "active" : ""}`}
                                onClick={() => setActiveSection("security")}
                            >
                                <Lock size={18} />
                                <span>Security & Login</span>
                            </button>
                            <button
                                className={`settings-tab-btn ${activeSection === "notifications" ? "active" : ""}`}
                                onClick={() => setActiveSection("notifications")}
                            >
                                <Bell size={18} />
                                <span>Notifications & Alerts</span>
                            </button>
                            <button
                                className={`settings-tab-btn ${activeSection === "privacy" ? "active" : ""}`}
                                onClick={() => setActiveSection("privacy")}
                            >
                                <Shield size={18} />
                                <span>Privacy & Data Sharing</span>
                            </button>
                            <button
                                className={`settings-tab-btn ${activeSection === "preferences" ? "active" : ""}`}
                                onClick={() => setActiveSection("preferences")}
                            >
                                <Globe size={18} />
                                <span>Language & Regional</span>
                            </button>
                        </div>

                        {/* Main Settings Panel */}
                        <div className="settings-content-card">
                            {/* 1. SECURITY SECTION */}
                            {activeSection === "security" && (
                                <div className="settings-section">
                                    <div className="sec-header">
                                        <div className="sec-title-wrap">
                                            <KeyRound size={22} className="sec-icon" />
                                            <div>
                                                <h3>Password & Authentication</h3>
                                                <p>Keep your health link portal account safe and secure.</p>
                                            </div>
                                        </div>
                                    </div>

                                    {passwordMsg.text && (
                                        <div className={`password-alert ${passwordMsg.type}`}>
                                            {passwordMsg.type === "success" ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
                                            <span>{passwordMsg.text}</span>
                                        </div>
                                    )}

                                    <form onSubmit={handlePasswordSubmit} className="password-form">
                                        <div className="form-group">
                                            <label>Current Password</label>
                                            <div className="input-with-icon">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    value={passwordForm.currentPassword}
                                                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                                    placeholder="Enter your current password"
                                                />
                                                <button
                                                    type="button"
                                                    className="toggle-pass-btn"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="form-row-two">
                                            <div className="form-group">
                                                <label>New Password</label>
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    value={passwordForm.newPassword}
                                                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                                    placeholder="Minimum 8 characters"
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>Confirm New Password</label>
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    value={passwordForm.confirmPassword}
                                                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                                    placeholder="Re-type new password"
                                                />
                                            </div>
                                        </div>

                                        <div className="form-action-row">
                                            <button type="submit" className="btn-save-settings">
                                                <Save size={16} />
                                                <span>Update Password</span>
                                            </button>
                                        </div>
                                    </form>

                                    <hr className="settings-divider" />

                                    <div className="toggle-setting-row">
                                        <div className="toggle-text">
                                            <h4>Two-Factor Authentication (2FA)</h4>
                                            <p>Add an extra layer of biometric or SMS verification when logging in.</p>
                                        </div>
                                        <button
                                            type="button"
                                            className={`toggle-switch ${settingsState.twoFactorAuth ? "active" : ""}`}
                                            onClick={() => handleToggle("twoFactorAuth")}
                                        >
                                            <div className="toggle-thumb" />
                                        </button>
                                    </div>

                                    <div className="session-info-card">
                                        <Smartphone size={22} color="#2563eb" />
                                        <div>
                                            <h4>Current Active Session</h4>
                                            <p>Logged in via Web Browser • Addis Ababa, Ethiopia</p>
                                        </div>
                                        <span className="active-badge">Active Now</span>
                                    </div>
                                </div>
                            )}

                            {/* 2. NOTIFICATIONS SECTION */}
                            {activeSection === "notifications" && (
                                <div className="settings-section">
                                    <div className="sec-header">
                                        <div className="sec-title-wrap">
                                            <Bell size={22} className="sec-icon" />
                                            <div>
                                                <h3>Notification & Alert Channels</h3>
                                                <p>Choose which notifications you wish to receive and your preferred channels.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="toggles-list">
                                        <div className="toggle-setting-row">
                                            <div className="toggle-text">
                                                <h4>Email Notifications</h4>
                                                <p>Receive appointment confirmations and clinical summaries via {patient?.user_details?.email || "email"}.</p>
                                            </div>
                                            <button
                                                type="button"
                                                className={`toggle-switch ${settingsState.emailAlerts ? "active" : ""}`}
                                                onClick={() => handleToggle("emailAlerts")}
                                            >
                                                <div className="toggle-thumb" />
                                            </button>
                                        </div>

                                        <div className="toggle-setting-row">
                                            <div className="toggle-text">
                                                <h4>SMS Mobile Alerts</h4>
                                                <p>Get instant text reminders 24 hours prior to scheduled physician visits.</p>
                                            </div>
                                            <button
                                                type="button"
                                                className={`toggle-switch ${settingsState.smsAlerts ? "active" : ""}`}
                                                onClick={() => handleToggle("smsAlerts")}
                                            >
                                                <div className="toggle-thumb" />
                                            </button>
                                        </div>

                                        <div className="toggle-setting-row">
                                            <div className="toggle-text">
                                                <h4>Prescription Refill Reminders</h4>
                                                <p>Automated reminders when your ongoing prescriptions have 5 days of dosage remaining.</p>
                                            </div>
                                            <button
                                                type="button"
                                                className={`toggle-switch ${settingsState.refillReminders ? "active" : ""}`}
                                                onClick={() => handleToggle("refillReminders")}
                                            >
                                                <div className="toggle-thumb" />
                                            </button>
                                        </div>

                                        <div className="toggle-setting-row">
                                            <div className="toggle-text">
                                                <h4>Clinical Diagnostic Updates</h4>
                                                <p>Notify me whenever laboratory test results or doctor visit records are added.</p>
                                            </div>
                                            <button
                                                type="button"
                                                className={`toggle-switch ${settingsState.recordsUpdateAlert ? "active" : ""}`}
                                                onClick={() => handleToggle("recordsUpdateAlert")}
                                            >
                                                <div className="toggle-thumb" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 3. PRIVACY & DATA SECTION */}
                            {activeSection === "privacy" && (
                                <div className="settings-section">
                                    <div className="sec-header">
                                        <div className="sec-title-wrap">
                                            <Shield size={22} className="sec-icon" />
                                            <div>
                                                <h3>Privacy & Clinical Data Access</h3>
                                                <p>Manage who can view your health records across partner medical institutions.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="toggles-list">
                                        <div className="toggle-setting-row">
                                            <div className="toggle-text">
                                                <h4>Emergency Medical Access</h4>
                                                <p>Allow accredited emergency room physicians to access your blood type and allergy profile during emergencies.</p>
                                            </div>
                                            <button
                                                type="button"
                                                className={`toggle-switch ${settingsState.emergencyAccess ? "active" : ""}`}
                                                onClick={() => handleToggle("emergencyAccess")}
                                            >
                                                <div className="toggle-thumb" />
                                            </button>
                                        </div>

                                        <div className="toggle-setting-row">
                                            <div className="toggle-text">
                                                <h4>Hospital Network Interoperability</h4>
                                                <p>Enable secure record transfer between HealthLink Central and affiliated regional hospitals.</p>
                                            </div>
                                            <button
                                                type="button"
                                                className={`toggle-switch ${settingsState.hospitalNetworkSharing ? "active" : ""}`}
                                                onClick={() => handleToggle("hospitalNetworkSharing")}
                                            >
                                                <div className="toggle-thumb" />
                                            </button>
                                        </div>
                                    </div>

                                    <hr className="settings-divider" />

                                    <div className="data-export-block">
                                        <div>
                                            <h4>Download Health Record Archive</h4>
                                            <p>Export your complete medical visits, medications, and vitals history in standardized JSON format.</p>
                                        </div>
                                        <button
                                            type="button"
                                            className="btn-export-records"
                                            onClick={handleExportData}
                                        >
                                            <Download size={16} />
                                            <span>Export My Data</span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* 4. PREFERENCES / LOCALIZATION */}
                            {activeSection === "preferences" && (
                                <div className="settings-section">
                                    <div className="sec-header">
                                        <div className="sec-title-wrap">
                                            <Globe size={22} className="sec-icon" />
                                            <div>
                                                <h3>Regional & Language Preferences</h3>
                                                <p>Customize portal display language and time formats.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="preferences-form">
                                        <div className="form-group">
                                            <label>Preferred Portal Language</label>
                                            <select
                                                value={settingsState.language}
                                                onChange={(e) => handleSelectChange("language", e.target.value)}
                                            >
                                                <option value="English">English (US / UK)</option>
                                                <option value="Amharic">Amharic (አማርኛ)</option>
                                                <option value="Oromiffa">Afaan Oromoo</option>
                                                <option value="Tigrinya">Tigrinya (ትግርኛ)</option>
                                                <option value="French">French (Français)</option>
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label>System Timezone</label>
                                            <select
                                                value={settingsState.timezone}
                                                onChange={(e) => handleSelectChange("timezone", e.target.value)}
                                            >
                                                <option value="Africa/Addis_Ababa (EAT)">Africa/Addis Ababa (EAT - UTC+3)</option>
                                                <option value="Africa/Nairobi (EAT)">Africa/Nairobi (EAT - UTC+3)</option>
                                                <option value="UTC">Coordinated Universal Time (UTC)</option>
                                                <option value="America/New_York (EST)">America/New York (EST - UTC-5)</option>
                                            </select>
                                        </div>
                                    </div>

                                    <hr className="settings-divider" />

                                    {/* Danger Zone */}
                                    <div className="danger-zone">
                                        <div className="danger-header">
                                            <AlertTriangle size={20} color="#dc2626" />
                                            <h4>Danger Zone</h4>
                                        </div>
                                        <p>Clearing offline data will reset any cached appointments and custom vitals on this browser device.</p>
                                        <button
                                            type="button"
                                            className="btn-danger-reset"
                                            onClick={() => {
                                                if (window.confirm("Are you sure you want to clear your local portal cache?")) {
                                                    localStorage.removeItem("patient_custom_vitals");
                                                    localStorage.removeItem("daily_taken_doses");
                                                    showToast("Local portal cache cleared.");
                                                }
                                            }}
                                        >
                                            <Trash2 size={16} />
                                            <span>Clear Local Device Cache</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <Footer />
            </main>
        </div>
    );
}

export default Settings;
