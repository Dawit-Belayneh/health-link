import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Notifications.css";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Footer from "../components/Footer";

import { 
    getPatientProfile, 
    getNotifications, 
    toggleNotificationRead, 
    markAllNotificationsRead, 
    deleteNotification, 
    clearAllNotifications,
    getAccessRequests,
    respondToAccessRequest
} from "../services/patient";
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
    FileText,
    ShieldCheck,
    UserCheck,
    UserX,
    Stethoscope
} from "lucide-react";

function Notifications() {
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [filterCategory, setFilterCategory] = useState("all");

    // Notifications state from real database API
    const [notifications, setNotifications] = useState([]);
    const [accessRequests, setAccessRequests] = useState([]);
    const [toastMessage, setToastMessage] = useState("");

    const formatTimeAgo = (dateStr) => {
        if (!dateStr) return "Just now";
        const date = new Date(dateStr);
        const now = new Date();
        const diffSec = Math.floor((now - date) / 1000);
        if (diffSec < 60) return "Just now";
        const diffMin = Math.floor(diffSec / 60);
        if (diffMin < 60) return `${diffMin} min ago`;
        const diffHours = Math.floor(diffMin / 60);
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        const diffDays = Math.floor(diffHours / 24);
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    };

    useEffect(() => {
        const token = localStorage.getItem("access");
        if (!token) {
            navigate("/login");
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                const [patientData, notifsData, reqsData] = await Promise.all([
                    getPatientProfile(),
                    getNotifications(),
                    getAccessRequests()
                ]);
                setPatient(patientData);
                const notifList = Array.isArray(notifsData)
                    ? notifsData
                    : (notifsData.results || []);
                setNotifications(notifList);
                setAccessRequests(Array.isArray(reqsData) ? reqsData : (reqsData.results || []));
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

    const handleAccessAction = async (requestId, action) => {
        try {
            const updated = await respondToAccessRequest(requestId, action);
            setAccessRequests(prev => prev.map(r => r.id === requestId ? updated : r));
            if (action === "approve") {
                setToastMessage(`Permission granted! Dr. ${updated.doctor_details?.name || "Doctor"} can now review your health records.`);
            } else if (action === "reject") {
                setToastMessage("Access request declined.");
            } else if (action === "revoke") {
                setToastMessage("Access permission revoked.");
            }
            setTimeout(() => setToastMessage(""), 5000);
        } catch (err) {
            console.error(`Failed to ${action} access request:`, err);
            alert(`Unable to ${action} access request. Please try again.`);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await markAllNotificationsRead();
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
            setToastMessage("All notifications marked as read.");
            setTimeout(() => setToastMessage(""), 4000);
        } catch (err) {
            console.error("Failed to mark all as read:", err);
        }
    };

    const handleClearAll = async () => {
        if (window.confirm("Are you sure you want to dismiss all notifications?")) {
            try {
                await clearAllNotifications();
                setNotifications([]);
                setToastMessage("All notifications cleared.");
                setTimeout(() => setToastMessage(""), 4000);
            } catch (err) {
                console.error("Failed to clear notifications:", err);
            }
        }
    };

    const handleToggleRead = async (id) => {
        const target = notifications.find(n => n.id === id);
        if (!target) return;
        const nextState = !target.is_read;
        try {
            await toggleNotificationRead(id, nextState);
            setNotifications(prev => prev.map(n => {
                if (n.id === id) return { ...n, is_read: nextState };
                return n;
            }));
        } catch (err) {
            console.error("Failed to toggle notification:", err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteNotification(id);
            setNotifications(prev => prev.filter(n => n.id !== id));
        } catch (err) {
            console.error("Failed to delete notification:", err);
        }
    };

    // Filter notifications
    const filteredList = notifications.filter(item => {
        const itemType = item.notification_type || item.type || "system";
        const isUnread = !item.is_read;
        if (filterCategory === "all") return true;
        if (filterCategory === "unread") return isUnread;
        return itemType === filterCategory;
    });

    const unreadCount = notifications.filter(n => !n.is_read).length;

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

                    {/* Pending Doctor Access Requests Alert Section */}
                    {accessRequests.filter(r => r.status === "pending").length > 0 && (
                        <div className="pending-doctor-requests-section">
                            <div className="pdr-header">
                                <ShieldCheck size={22} className="pdr-icon" />
                                <div>
                                    <h3>Doctor Access Requests Awaiting Your Permission</h3>
                                    <p>The following healthcare providers have requested permission to view your medical records and vitals. Only approve providers you trust.</p>
                                </div>
                            </div>
                            <div className="pdr-list">
                                {accessRequests.filter(r => r.status === "pending").map((req) => (
                                    <div key={req.id} className="pdr-card">
                                        <div className="pdr-card-info">
                                            <div className="pdr-avatar">
                                                <Stethoscope size={24} />
                                            </div>
                                            <div className="pdr-details">
                                                <h4>Dr. {req.doctor_details?.name || "Doctor"}</h4>
                                                <div className="pdr-meta">
                                                    <span className="pdr-badge-spec">{req.doctor_details?.specialization || "General Practice"}</span>
                                                    <span className="pdr-hospital">{req.doctor_details?.hospital_name || "Hospital Partner"}</span>
                                                    <span className="pdr-date"><Clock size={12} /> {formatTimeAgo(req.requested_at)}</span>
                                                </div>
                                                {req.notes && (
                                                    <div className="pdr-reason">
                                                        <strong>Reason:</strong> "{req.notes}"
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="pdr-actions">
                                            <button 
                                                className="btn-pdr-approve"
                                                onClick={() => handleAccessAction(req.id, "approve")}
                                            >
                                                <UserCheck size={16} />
                                                <span>Allow Permission</span>
                                            </button>
                                            <button 
                                                className="btn-pdr-reject"
                                                onClick={() => handleAccessAction(req.id, "reject")}
                                            >
                                                <UserX size={16} />
                                                <span>Decline</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
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
                                className={`f-tab ${filterCategory === "doctor_permissions" ? "active" : ""}`}
                                onClick={() => setFilterCategory("doctor_permissions")}
                            >
                                <ShieldCheck size={15} />
                                Doctor Permissions ({accessRequests.filter(r => r.status === "approved").length} Active)
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

                    {/* Notifications / Permissions List */}
                    <div className="notifs-list-section">
                        {filterCategory === "doctor_permissions" ? (
                            <div className="permissions-manager-view">
                                <div className="pm-intro">
                                    <h3>Healthcare Provider Access Authorizations</h3>
                                    <p>Doctors can only review your personal medical records, health vitals, appointments, and prescriptions if you give explicit permission. You can revoke access at any time.</p>
                                </div>
                                {accessRequests.length === 0 ? (
                                    <div className="no-notifs-card">
                                        <div className="no-notif-icon-wrap">
                                            <ShieldCheck size={48} />
                                        </div>
                                        <h3>No Doctor Permissions on File</h3>
                                        <p>No healthcare providers have requested or been granted access to your medical records yet.</p>
                                    </div>
                                ) : (
                                    <div className="permissions-cards-grid">
                                        {accessRequests.map((req) => (
                                            <div key={req.id} className={`perm-card status-${req.status}`}>
                                                <div className="perm-card-head">
                                                    <div className="perm-doc-avatar">
                                                        <Stethoscope size={22} />
                                                    </div>
                                                    <div className="perm-doc-meta">
                                                        <h4>Dr. {req.doctor_details?.name || "Doctor"}</h4>
                                                        <span className="perm-doc-spec">{req.doctor_details?.specialization || "General Medicine"}</span>
                                                        <span className="perm-doc-hosp">{req.doctor_details?.hospital_name || "Hospital Partner"}</span>
                                                    </div>
                                                    <div className={`perm-status-pill ${req.status}`}>
                                                        {req.status === "approved" && "Active Access"}
                                                        {req.status === "pending" && "Pending Approval"}
                                                        {req.status === "rejected" && "Declined"}
                                                        {req.status === "revoked" && "Revoked"}
                                                    </div>
                                                </div>
                                                <div className="perm-card-body">
                                                    {req.notes && (
                                                        <p className="perm-reason"><strong>Reason for Request:</strong> "{req.notes}"</p>
                                                    )}
                                                    <div className="perm-timestamps">
                                                        <span>Requested: {new Date(req.requested_at).toLocaleDateString()}</span>
                                                        {req.responded_at && (
                                                            <span>Responded: {new Date(req.responded_at).toLocaleDateString()}</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="perm-card-actions">
                                                    {req.status === "approved" && (
                                                        <button 
                                                            className="btn-perm-revoke"
                                                            onClick={() => handleAccessAction(req.id, "revoke")}
                                                        >
                                                            <UserX size={15} />
                                                            <span>Revoke Access</span>
                                                        </button>
                                                    )}
                                                    {req.status === "pending" && (
                                                        <>
                                                            <button 
                                                                className="btn-pdr-approve"
                                                                onClick={() => handleAccessAction(req.id, "approve")}
                                                            >
                                                                <UserCheck size={15} />
                                                                <span>Allow Permission</span>
                                                            </button>
                                                            <button 
                                                                className="btn-pdr-reject"
                                                                onClick={() => handleAccessAction(req.id, "reject")}
                                                            >
                                                                <UserX size={15} />
                                                                <span>Decline</span>
                                                            </button>
                                                        </>
                                                    )}
                                                    {(req.status === "rejected" || req.status === "revoked") && (
                                                        <button 
                                                            className="btn-pdr-reapprove"
                                                            onClick={() => handleAccessAction(req.id, "approve")}
                                                        >
                                                            <UserCheck size={15} />
                                                            <span>Re-Authorize Access</span>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : filteredList.length === 0 ? (
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
                                {filteredList.map((item) => {
                                    const isUnread = !item.is_read;
                                    const itemType = item.notification_type || item.type || "system";
                                    const timeDisplay = formatTimeAgo(item.created_at);

                                    return (
                                        <div
                                            key={item.id}
                                            className={`notif-card ${isUnread ? "unread" : ""}`}
                                        >
                                            <div className="notif-card-left">
                                                <div className={`notif-icon-box ${itemType}`}>
                                                    {renderTypeIcon(itemType)}
                                                </div>

                                                <div className="notif-content-wrap">
                                                    <div className="notif-title-row">
                                                        <h4>{item.title}</h4>
                                                        {isUnread && <span className="unread-dot" />}
                                                    </div>

                                                    <p className="notif-msg">{item.message}</p>

                                                    <div className="notif-meta-row">
                                                        <span className="notif-time">
                                                            <Clock size={13} /> {timeDisplay}
                                                        </span>
                                                        <span className="notif-category-badge">
                                                            {itemType.toUpperCase()}
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
                                                    title={isUnread ? "Mark as Read" : "Mark as Unread"}
                                                >
                                                    <CheckCheck size={17} color={isUnread ? "#2563eb" : "#94a3b8"} />
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
                                    );
                                })}
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
