import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Appointments.css";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Footer from "../components/Footer";

import { getPatientProfile, getMedicalRecords } from "../services/patient";
import {
    CalendarDays,
    Clock,
    UserRound,
    MapPin,
    Phone,
    Video,
    Plus,
    X,
    CheckCircle2,
    Calendar as CalendarIcon,
    AlertCircle,
    ChevronRight,
    Search,
    Filter,
    Building2,
    FileText,
    ArrowRight
} from "lucide-react";

const INITIAL_APPOINTMENTS = [
    {
        id: "apt-101",
        doctor_name: "Dr. Sarah Johnson",
        specialization: "Cardiology Specialist",
        hospital: "HealthLink Central Hospital",
        room: "Room 302, 3rd Floor",
        date: "2026-07-22",
        time: "10:30 AM",
        type: "In-Person",
        status: "Confirmed",
        notes: "Routine quarterly cardiovascular evaluation and ECG check.",
        phone: "+251 115 517 000"
    },
    {
        id: "apt-102",
        doctor_name: "Dr. Michael Chen",
        specialization: "General Medicine",
        hospital: "HealthLink Downtown Clinic",
        room: "Telehealth Room B",
        date: "2026-08-05",
        time: "02:15 PM",
        type: "Telehealth",
        status: "Confirmed",
        notes: "Follow-up consultation on blood pressure management and vitals review.",
        phone: "+251 115 518 111"
    }
];

function Appointments() {
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("upcoming"); // "upcoming", "past", "cancelled"

    // Appointments state from localStorage or initial
    const [appointments, setAppointments] = useState(() => {
        const saved = localStorage.getItem("patient_appointments");
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                return INITIAL_APPOINTMENTS;
            }
        }
        return INITIAL_APPOINTMENTS;
    });

    // Modal state
    const [showBookModal, setShowBookModal] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState("");
    const [selectedAptDetails, setSelectedAptDetails] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        doctor_name: "Dr. Sarah Johnson",
        specialization: "Cardiology Specialist",
        hospital: "HealthLink Central Hospital",
        date: new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0],
        time: "10:00 AM",
        type: "In-Person",
        notes: ""
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
                console.error("Failed to load appointments:", err);
                if (err.response && err.response.status === 401) {
                    navigate("/login");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    const saveAppointments = (newApts) => {
        setAppointments(newApts);
        localStorage.setItem("patient_appointments", JSON.stringify(newApts));
    };

    const handleBookAppointment = (e) => {
        e.preventDefault();
        const newApt = {
            id: `apt-${Date.now()}`,
            doctor_name: formData.doctor_name,
            specialization: formData.specialization,
            hospital: formData.hospital,
            room: formData.type === "In-Person" ? "Room 204 • Outpatient Ward" : "HealthLink Telehealth Portal",
            date: formData.date,
            time: formData.time,
            type: formData.type,
            status: "Confirmed",
            notes: formData.notes || "General medical consultation and clinical assessment.",
            phone: "+251 115 517 000"
        };

        const updated = [newApt, ...appointments];
        saveAppointments(updated);
        setShowBookModal(false);
        setShowSuccessToast(`Appointment with ${formData.doctor_name} scheduled for ${formData.date} at ${formData.time}!`);

        setTimeout(() => {
            setShowSuccessToast("");
        }, 5000);
    };

    const handleCancelAppointment = (aptId) => {
        if (window.confirm("Are you sure you want to cancel this appointment?")) {
            const updated = appointments.map(apt => {
                if (apt.id === aptId) {
                    return { ...apt, status: "Cancelled" };
                }
                return apt;
            });
            saveAppointments(updated);
        }
    };

    // Filter appointments
    const upcomingApts = appointments.filter(a => a.status !== "Cancelled");
    const cancelledApts = appointments.filter(a => a.status === "Cancelled");

    // Convert backend records to past appointments
    const pastVisits = records.map((rec) => ({
        id: `past-${rec.id}`,
        doctor_name: rec.doctor_name || "Dr. HealthLink",
        specialization: rec.doctor_specialization || "General Medicine",
        hospital: rec.hospital_name || "HealthLink Central Hospital",
        date: rec.date ? rec.date.split("T")[0] : rec.visit_date?.split("T")[0] || "Past",
        time: "Completed",
        type: "In-Person",
        status: "Completed",
        notes: rec.diagnosis,
        treatment: rec.treatment
    }));

    const formatDateStr = (dateStr) => {
        if (!dateStr) return "N/A";
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return d.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    };

    return (
        <div className="patient-dashboard">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <main className="dashboard-main">
                <Topbar
                    patient={patient}
                    onToggleSidebar={() => setSidebarOpen(prev => !prev)}
                />

                <div className="appointments-page-container">
                    {/* Header */}
                    <div className="appointments-header">
                        <div className="header-left">
                            <div className="header-badge">
                                <CalendarDays size={22} className="header-icon" />
                                <h2>Appointments & Consultations</h2>
                            </div>
                            <p>Manage upcoming doctor visits, schedule new appointments, or review past consultations.</p>
                        </div>

                        <div className="header-actions">
                            <button
                                className="book-new-btn"
                                onClick={() => setShowBookModal(true)}
                            >
                                <Plus size={18} />
                                <span>Book New Appointment</span>
                            </button>
                        </div>
                    </div>

                    {/* Success Toast */}
                    {showSuccessToast && (
                        <div className="appointment-toast">
                            <CheckCircle2 size={20} />
                            <span>{showSuccessToast}</span>
                            <button onClick={() => setShowSuccessToast("")}>
                                <X size={16} />
                            </button>
                        </div>
                    )}

                    {/* Summary Metric Cards */}
                    <div className="apt-metrics-grid">
                        <div className="apt-metric-card">
                            <div className="metric-icon blue">
                                <CalendarDays size={22} />
                            </div>
                            <div className="metric-text">
                                <span className="metric-num">{upcomingApts.length}</span>
                                <span className="metric-lbl">Upcoming Visits</span>
                            </div>
                        </div>

                        <div className="apt-metric-card">
                            <div className="metric-icon green">
                                <CheckCircle2 size={22} />
                            </div>
                            <div className="metric-text">
                                <span className="metric-num">{pastVisits.length}</span>
                                <span className="metric-lbl">Completed Visits</span>
                            </div>
                        </div>

                        <div className="apt-metric-card">
                            <div className="metric-icon purple">
                                <Building2 size={22} />
                            </div>
                            <div className="metric-text">
                                <span className="metric-num">HealthLink Central</span>
                                <span className="metric-lbl">Primary Clinic</span>
                            </div>
                        </div>

                        <div className="apt-metric-card">
                            <div className="metric-icon amber">
                                <Video size={22} />
                            </div>
                            <div className="metric-text">
                                <span className="metric-num">Available</span>
                                <span className="metric-lbl">Telehealth Support</span>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="apt-tabs-bar">
                        <div className="apt-tabs">
                            <button
                                className={`apt-tab ${activeTab === "upcoming" ? "active" : ""}`}
                                onClick={() => setActiveTab("upcoming")}
                            >
                                <CalendarDays size={18} />
                                <span>Upcoming ({upcomingApts.length})</span>
                            </button>
                            <button
                                className={`apt-tab ${activeTab === "past" ? "active" : ""}`}
                                onClick={() => setActiveTab("past")}
                            >
                                <Clock size={18} />
                                <span>Past Consultations ({pastVisits.length})</span>
                            </button>
                            <button
                                className={`apt-tab ${activeTab === "cancelled" ? "active" : ""}`}
                                onClick={() => setActiveTab("cancelled")}
                            >
                                <AlertCircle size={18} />
                                <span>Cancelled ({cancelledApts.length})</span>
                            </button>
                        </div>
                    </div>

                    {/* Active Tab Content */}
                    {activeTab === "upcoming" && (
                        <div className="apt-cards-list">
                            {upcomingApts.length === 0 ? (
                                <div className="no-apts-card">
                                    <CalendarDays size={48} />
                                    <h3>No upcoming appointments scheduled</h3>
                                    <p>Stay ahead of your health checkups by scheduling a consultation with a certified physician.</p>
                                    <button
                                        className="book-new-btn"
                                        onClick={() => setShowBookModal(true)}
                                    >
                                        <Plus size={16} /> Book an Appointment
                                    </button>
                                </div>
                            ) : (
                                upcomingApts.map((apt) => (
                                    <div key={apt.id} className="apt-card">
                                        <div className="apt-card-main">
                                            <div className="apt-doctor-info">
                                                <img
                                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(apt.doctor_name)}&background=2563eb&color=fff&size=64`}
                                                    alt={apt.doctor_name}
                                                    className="apt-avatar"
                                                />
                                                <div>
                                                    <div className="apt-doctor-title">
                                                        <h3>{apt.doctor_name}</h3>
                                                        <span className="status-badge confirmed">
                                                            <CheckCircle2 size={13} /> {apt.status}
                                                        </span>
                                                    </div>
                                                    <p className="apt-spec">{apt.specialization}</p>
                                                    <p className="apt-hosp">
                                                        <Building2 size={14} /> {apt.hospital}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="apt-schedule-badge">
                                                <div className="schedule-item">
                                                    <CalendarDays size={18} className="icon-blue" />
                                                    <div>
                                                        <span className="sched-lbl">Date</span>
                                                        <strong>{formatDateStr(apt.date)}</strong>
                                                    </div>
                                                </div>
                                                <div className="schedule-item">
                                                    <Clock size={18} className="icon-blue" />
                                                    <div>
                                                        <span className="sched-lbl">Time</span>
                                                        <strong>{apt.time}</strong>
                                                    </div>
                                                </div>
                                                <div className="schedule-item">
                                                    {apt.type === "Telehealth" ? (
                                                        <Video size={18} className="icon-purple" />
                                                    ) : (
                                                        <MapPin size={18} className="icon-blue" />
                                                    )}
                                                    <div>
                                                        <span className="sched-lbl">Type / Room</span>
                                                        <strong>{apt.room}</strong>
                                                    </div>
                                                </div>
                                            </div>

                                            {apt.notes && (
                                                <div className="apt-notes-box">
                                                    <strong>Consultation Reason:</strong> {apt.notes}
                                                </div>
                                            )}
                                        </div>

                                        <div className="apt-card-actions">
                                            <button
                                                className="btn-action-primary"
                                                onClick={() => setSelectedAptDetails(apt)}
                                            >
                                                <FileText size={16} />
                                                <span>View Details</span>
                                            </button>

                                            <button
                                                className="btn-action-cancel"
                                                onClick={() => handleCancelAppointment(apt.id)}
                                            >
                                                <X size={16} />
                                                <span>Cancel</span>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === "past" && (
                        <div className="apt-cards-list">
                            {pastVisits.length === 0 ? (
                                <div className="no-apts-card">
                                    <Clock size={48} />
                                    <h3>No past consultations recorded</h3>
                                    <p>Past completed appointments and clinic encounters will show here.</p>
                                </div>
                            ) : (
                                pastVisits.map((apt) => (
                                    <div key={apt.id} className="apt-card past">
                                        <div className="apt-card-main">
                                            <div className="apt-doctor-info">
                                                <img
                                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(apt.doctor_name)}&background=10b981&color=fff&size=64`}
                                                    alt={apt.doctor_name}
                                                    className="apt-avatar"
                                                />
                                                <div>
                                                    <div className="apt-doctor-title">
                                                        <h3>{apt.doctor_name}</h3>
                                                        <span className="status-badge completed">
                                                            <CheckCircle2 size={13} /> Completed Visit
                                                        </span>
                                                    </div>
                                                    <p className="apt-spec">{apt.specialization}</p>
                                                    <p className="apt-hosp">
                                                        <Building2 size={14} /> {apt.hospital}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="apt-schedule-badge past">
                                                <div className="schedule-item">
                                                    <CalendarDays size={18} />
                                                    <div>
                                                        <span className="sched-lbl">Visit Date</span>
                                                        <strong>{formatDateStr(apt.date)}</strong>
                                                    </div>
                                                </div>
                                                <div className="schedule-item">
                                                    <FileText size={18} />
                                                    <div>
                                                        <span className="sched-lbl">Diagnosis</span>
                                                        <strong>{apt.notes}</strong>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="apt-card-actions">
                                            <button
                                                className="btn-action-primary"
                                                onClick={() => navigate("/medical-records")}
                                            >
                                                <FileText size={16} />
                                                <span>Open Clinical Record</span>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === "cancelled" && (
                        <div className="apt-cards-list">
                            {cancelledApts.length === 0 ? (
                                <div className="no-apts-card">
                                    <CheckCircle2 size={48} color="#10b981" />
                                    <h3>No cancelled appointments</h3>
                                    <p>All your scheduled visits are active and on schedule.</p>
                                </div>
                            ) : (
                                cancelledApts.map((apt) => (
                                    <div key={apt.id} className="apt-card cancelled">
                                        <div className="apt-card-main">
                                            <div className="apt-doctor-info">
                                                <img
                                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(apt.doctor_name)}&background=94a3b8&color=fff&size=64`}
                                                    alt={apt.doctor_name}
                                                    className="apt-avatar"
                                                />
                                                <div>
                                                    <div className="apt-doctor-title">
                                                        <h3>{apt.doctor_name}</h3>
                                                        <span className="status-badge cancelled">
                                                            <X size={13} /> Cancelled
                                                        </span>
                                                    </div>
                                                    <p className="apt-spec">{apt.specialization}</p>
                                                </div>
                                            </div>

                                            <div className="apt-schedule-badge">
                                                <div className="schedule-item">
                                                    <CalendarDays size={18} />
                                                    <div>
                                                        <span className="sched-lbl">Original Date</span>
                                                        <strong>{formatDateStr(apt.date)}</strong>
                                                    </div>
                                                </div>
                                                <div className="schedule-item">
                                                    <Clock size={18} />
                                                    <div>
                                                        <span className="sched-lbl">Time</span>
                                                        <strong>{apt.time}</strong>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="apt-card-actions">
                                            <button
                                                className="btn-action-primary"
                                                onClick={() => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        doctor_name: apt.doctor_name,
                                                        specialization: apt.specialization
                                                    }));
                                                    setShowBookModal(true);
                                                }}
                                            >
                                                <Plus size={16} />
                                                <span>Rebook Appointment</span>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* Booking Modal */}
                {showBookModal && (
                    <div className="apt-modal-backdrop" onClick={() => setShowBookModal(false)}>
                        <div className="apt-modal-dialog" onClick={(e) => e.stopPropagation()}>
                            <div className="apt-modal-header">
                                <div className="modal-title-row">
                                    <CalendarDays size={22} color="#2563eb" />
                                    <h3>Book New Medical Appointment</h3>
                                </div>
                                <button className="modal-close-btn" onClick={() => setShowBookModal(false)}>
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleBookAppointment} className="apt-form-body">
                                <div className="form-group">
                                    <label>Medical Specialty / Department</label>
                                    <select
                                        value={formData.specialization}
                                        onChange={(e) => {
                                            const spec = e.target.value;
                                            let doc = "Dr. Sarah Johnson";
                                            if (spec === "Cardiology Specialist") doc = "Dr. Sarah Johnson";
                                            else if (spec === "Dermatology Specialist") doc = "Dr. Michael Chen";
                                            else if (spec === "General Medicine") doc = "Dr. Dawit Abebe";
                                            else if (spec === "Orthopedics") doc = "Dr. Emily Vance";
                                            setFormData({ ...formData, specialization: spec, doctor_name: doc });
                                        }}
                                    >
                                        <option value="Cardiology Specialist">Cardiology Specialist</option>
                                        <option value="General Medicine">General Medicine & Family Health</option>
                                        <option value="Dermatology Specialist">Dermatology & Skin Care</option>
                                        <option value="Orthopedics">Orthopedics & Joint Care</option>
                                        <option value="Pediatrics">Pediatrics & Child Care</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Attending Physician</label>
                                    <input
                                        type="text"
                                        value={formData.doctor_name}
                                        onChange={(e) => setFormData({ ...formData, doctor_name: e.target.value })}
                                        placeholder="Doctor's name"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Hospital / Clinic Center</label>
                                    <select
                                        value={formData.hospital}
                                        onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                                    >
                                        <option value="HealthLink Central Hospital">HealthLink Central Hospital</option>
                                        <option value="HealthLink Downtown Clinic">HealthLink Downtown Clinic</option>
                                        <option value="St. Paul Specialty Hospital">St. Paul Specialty Hospital</option>
                                        <option value="Tikur Anbessa Specialized Hospital">Tikur Anbessa Specialized Hospital</option>
                                    </select>
                                </div>

                                <div className="form-row-two">
                                    <div className="form-group">
                                        <label>Preferred Date</label>
                                        <input
                                            type="date"
                                            value={formData.date}
                                            min={new Date().toISOString().split("T")[0]}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Available Time Slot</label>
                                        <select
                                            value={formData.time}
                                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                        >
                                            <option value="09:00 AM">09:00 AM - Morning</option>
                                            <option value="10:00 AM">10:00 AM - Morning</option>
                                            <option value="11:30 AM">11:30 AM - Morning</option>
                                            <option value="02:00 PM">02:00 PM - Afternoon</option>
                                            <option value="03:30 PM">03:30 PM - Afternoon</option>
                                            <option value="05:00 PM">05:00 PM - Evening</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Consultation Format</label>
                                    <div className="radio-pills-row">
                                        <label className={`radio-pill ${formData.type === "In-Person" ? "active" : ""}`}>
                                            <input
                                                type="radio"
                                                name="type"
                                                value="In-Person"
                                                checked={formData.type === "In-Person"}
                                                onChange={() => setFormData({ ...formData, type: "In-Person" })}
                                            />
                                            <Building2 size={16} />
                                            <span>In-Person Hospital Visit</span>
                                        </label>
                                        <label className={`radio-pill ${formData.type === "Telehealth" ? "active" : ""}`}>
                                            <input
                                                type="radio"
                                                name="type"
                                                value="Telehealth"
                                                checked={formData.type === "Telehealth"}
                                                onChange={() => setFormData({ ...formData, type: "Telehealth" })}
                                            />
                                            <Video size={16} />
                                            <span>Virtual Telehealth Call</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Reason for Visit / Symptoms (Optional)</label>
                                    <textarea
                                        rows="3"
                                        placeholder="Describe your health concern, symptoms or questions for the doctor..."
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    />
                                </div>

                                <div className="apt-form-footer">
                                    <button
                                        type="button"
                                        className="btn-cancel"
                                        onClick={() => setShowBookModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn-submit"
                                    >
                                        Confirm Appointment
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Appointment Detail Modal */}
                {selectedAptDetails && (
                    <div className="apt-modal-backdrop" onClick={() => setSelectedAptDetails(null)}>
                        <div className="apt-modal-dialog" onClick={(e) => e.stopPropagation()}>
                            <div className="apt-modal-header">
                                <div className="modal-title-row">
                                    <CalendarDays size={22} color="#2563eb" />
                                    <h3>Appointment Details</h3>
                                </div>
                                <button className="modal-close-btn" onClick={() => setSelectedAptDetails(null)}>
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="apt-details-body">
                                <div className="detail-hero">
                                    <img
                                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedAptDetails.doctor_name)}&background=2563eb&color=fff&size=80`}
                                        alt={selectedAptDetails.doctor_name}
                                    />
                                    <div>
                                        <h4>{selectedAptDetails.doctor_name}</h4>
                                        <p>{selectedAptDetails.specialization}</p>
                                        <span className="status-badge confirmed">
                                            <CheckCircle2 size={13} /> {selectedAptDetails.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="detail-grid">
                                    <div className="detail-item">
                                        <span className="d-lbl">Scheduled Date</span>
                                        <strong>{formatDateStr(selectedAptDetails.date)}</strong>
                                    </div>
                                    <div className="detail-item">
                                        <span className="d-lbl">Appointment Time</span>
                                        <strong>{selectedAptDetails.time}</strong>
                                    </div>
                                    <div className="detail-item">
                                        <span className="d-lbl">Facility / Hospital</span>
                                        <strong>{selectedAptDetails.hospital}</strong>
                                    </div>
                                    <div className="detail-item">
                                        <span className="d-lbl">Location / Room</span>
                                        <strong>{selectedAptDetails.room}</strong>
                                    </div>
                                </div>

                                <div className="detail-notes-card">
                                    <span className="d-lbl">Patient Notes & Instructions:</span>
                                    <p>{selectedAptDetails.notes}</p>
                                    <p className="arrival-notice">
                                        * Please arrive 15 minutes prior to your designated slot with your national ID or HealthLink patient card.
                                    </p>
                                </div>

                                <div className="detail-actions-footer">
                                    <button
                                        className="btn-call"
                                        onClick={() => alert(`Calling clinic reception at: ${selectedAptDetails.phone || "+251 115 517 000"}`)}
                                    >
                                        <Phone size={16} />
                                        <span>Call Clinic</span>
                                    </button>
                                    <button
                                        className="btn-close-modal"
                                        onClick={() => setSelectedAptDetails(null)}
                                    >
                                        Done
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

export default Appointments;
