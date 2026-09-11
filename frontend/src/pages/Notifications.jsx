import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Notifications.css";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Footer from "../components/Footer";

import { getPatientProfile, getMedicalRecords } from "../services/patient";
import {
    Bell,
    CalendarDays,
    Pill,
    TestTube,
    Building2,
    CheckCheck,
    Trash2,
    ChevronRight,
    CheckCircle2,
    Clock,
    AlertCircle,
    X,
    Filter,
    FileText
} from "lucide-react";

const DEFAULT_NOTIFICATIONS = [
    {
        id: "notif-1",
        type: "appointment",
        title: "Upcoming Appointment Tomorrow",
        message: "You have a consultation with Dr. Sarah Johnson scheduled for tomorrow at 10:30 AM at HealthLink Central.",
        time: "15 min ago",
        date: "Today",
        unread: true,
        link: "/appointments"
    },
    {
        id: "notif-2",
        type: "prescription",
        title: "Medication Refill Reminder",
        message: "Your prescription for Atorvastatin 20mg is down to 5 days remaining. Request a refill to prevent treatment gaps.",
        time: "2 hours ago",
        date: "Today",
        unread: true,
        link: "/medications"
    },
    {
        id: "notif-3",
        type: "record",
        title: "Clinical Record Updated",
        message: "Your doctor has uploaded the clinical summary and prescription notes from your recent consultation.",
        time: "Yesterday, 04:20 PM",
        date: "Yesterday",
        unread: false,
        link: "/medical-records"
    },
    {
        id: "notif-4",
        type: "system",
        title: "HealthLink Clinic Notice",
        message: "The outpatient cardiology wing will open at 08:00 AM on weekdays. Telehealth consultation lines remain 24/7.",
        time: "3 days ago",
        date: "Earlier this week",
        unread: false,
        link: null
    }
];

function Notifications() {
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [filterCategory, setFilterCategory] = useState("all");

    // Notifications state with localStorage persistence
    const [notifications, setNotifications] = useState(() => {
        const saved = localStorage.getItem("patient_notifications");
        if (saved) {
            try { return JSON.parse(saved); } catch (e) {}
        }
        return DEFAULT_NOTIFICATIONS;
    });

    const [toastMessage, setToastMessage] = useState("");

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
                console.error("Failed to load notifications:", err);
                if (err.response && err.response.status === 401) {
                    navigate("/login");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    const saveNotifs = (list) => {
        setNotifications(list);
        localStorage.setItem("patient_notifications", JSON.stringify(list));
    };

    const handleMarkAllRead = () => {
        const updated = notifications.map(n => ({ ...n, unread: false }));
        saveNotifs(updated);
        setToastMessage("All notifications marked as read.");
        setTimeout(() => setToastMessage(""), 4000);
    };

    const handleClearAll = () => {
        if (window.confirm("Are you sure you want to dismiss all notifications?")) {
            saveNotifs([]);
            setToastMessage("All notifications cleared.");
            setTimeout(() => setToastMessage(""), 4000);
        }
    };

    const handleToggleRead = (id) => {
        const updated = notifications.map(n => {
            if (n.id === id) return { ...n, unread: !n.unread };
            return n;
        });
        saveNotifs(updated);
    };

    const handleDelete = (id) => {
        const updated = notifications.filter(n => n.id !== id);
        saveNotifs(updated);
    };

    // Filter notifications
    const filteredList = notifications.filter(item => {
        if (filterCategory === "all") return true;
        if (filterCategory === "unread") return item.unread;
        return item.type === filterCategory;
    });

    const unreadCount = notifications.filter(n => n.unread).length;

    const renderTypeIcon = (type) => {
        switch (type) {
            case "appointment":
                return <CalendarDays size={20} className="icon-calendar" />;
            case "prescription":
                return <Pill size={20} className="icon-pill" />;
            case "record":
                return <FileText size={20} className="icon-record" />;
            default:
                return <Building2 size={20} className="icon-system" />;
        }
    };

    return (
        <div className="patient-dashboard">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <main className="dashboard-main">
                <Topbar
                    patient={patient}
                    onToggleSidebar={() => setSidebarOpen(prev => !prev)}
                />

                <div className="notifs-page-container">
                    {/* Header */}
                    <div className="notifs-header">
                        <div className="header-left">
                            <div className="header-badge">
                                <Bell size={24} className="header-icon" />
                                <h2>Notifications Center</h2>
                                {unreadCount > 0 && (
                                    <span className="header-unread-count">{unreadCount} New</span>
                                )}
                            </div>
                            <p>Stay up to date with consultation schedules, medical reports, and prescription alerts.</p>
                        </div>

                        <div className="header-actions">
                            {notifications.length > 0 && (
                                <>
                                    <button
                                        className="btn-mark-all"
                                        onClick={handleMarkAllRead}
                                        disabled={unreadCount === 0}
                                    >
                                        <CheckCheck size={18} />
                                        <span>Mark All Read</span>
                                    </button>
                                    <button
                                        className="btn-clear-all"
                                        onClick={handleClearAll}
                                    >
                                        <Trash2 size={18} />
                                        <span>Clear All</span>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Toast Notification */}
                    {toastMessage && (
                        <div className="notifs-toast">
                            <CheckCircle2 size={20} />
                            <span>{toastMessage}</span>
                            <button onClick={() => setToastMessage("")}>
                                <X size={16} />
                            </button>
                        </div>
                    )}

                    {/* Filter Tabs Bar */}
                    <div className="notifs-filter-bar">
                        <div className="filter-tabs">
                            <button
                                className={`f-tab ${filterCategory === "all" ? "active" : ""}`}
                                onClick={() => setFilterCategory("all")}
                            >
                                All ({notifications.length})
                            </button>
                            <button
                                className={`f-tab ${filterCategory === "unread" ? "active" : ""}`}
                                onClick={() => setFilterCategory("unread")}
                            >
                                Unread ({unreadCount})
                            </button>
                            <button
                                className={`f-tab ${filterCategory === "appointment" ? "active" : ""}`}
                                onClick={() => setFilterCategory("appointment")}
                            >
                                Appointments
                            </button>
                            <button
                                className={`f-tab ${filterCategory === "prescription" ? "active" : ""}`}
                                onClick={() => setFilterCategory("prescription")}
                            >
                                Prescriptions
                            </button>
                            <button
                                className={`f-tab ${filterCategory === "record" ? "active" : ""}`}
                                onClick={() => setFilterCategory("record")}
                            >
                                Medical Records
                            </button>
                        </div>
                    </div>

                    {/* Notifications List */}
                    <div className="notifs-list-section">
                        {filteredList.length === 0 ? (
                            <div className="no-notifs-card">
                                <div className="no-notif-icon-wrap">
                                    <Bell size={48} />
                                </div>
                                <h3>You're all caught up!</h3>
                                <p>No notifications matching this category. We will notify you when new updates arrive.</p>
                                {filterCategory !== "all" && (
                                    <button
                                        className="btn-reset-notif-filter"
                                        onClick={() => setFilterCategory("all")}
                                    >
                                        View All Notifications
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="notifs-cards">
                                {filteredList.map((item) => (
                                    <div
                                        key={item.id}
                                        className={`notif-card ${item.unread ? "unread" : ""}`}
                                    >
                                        <div className="notif-card-left">
                                            <div className={`notif-icon-box ${item.type}`}>
                                                {renderTypeIcon(item.type)}
                                            </div>

                                            <div className="notif-content-wrap">
                                                <div className="notif-title-row">
                                                    <h4>{item.title}</h4>
                                                    {item.unread && <span className="unread-dot" />}
                                                </div>

                                                <p className="notif-msg">{item.message}</p>

                                                <div className="notif-meta-row">
                                                    <span className="notif-time">
                                                        <Clock size={13} /> {item.time}
                                                    </span>
                                                    <span className="notif-category-badge">
                                                        {item.type.toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="notif-card-right">
                                            {item.link && (
                                                <Link to={item.link} className="notif-action-link">
                                                    <span>View</span>
                                                    <ChevronRight size={16} />
                                                </Link>
                                            )}

                                            <button
                                                className="btn-toggle-read"
                                                onClick={() => handleToggleRead(item.id)}
                                                title={item.unread ? "Mark as Read" : "Mark as Unread"}
                                            >
                                                <CheckCheck size={17} color={item.unread ? "#2563eb" : "#94a3b8"} />
                                            </button>

                                            <button
                                                className="btn-delete-notif"
                                                onClick={() => handleDelete(item.id)}
                                                title="Dismiss notification"
                                            >
                                                <X size={17} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <Footer />
            </main>
        </div>
    );
}

export default Notifications;
