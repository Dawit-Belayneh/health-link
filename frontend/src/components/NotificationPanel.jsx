import { useState, useEffect } from "react";
import "./NotificationPanel.css";
import { useNavigate } from "react-router-dom";
import { getNotifications, toggleNotificationRead } from "../services/patient";
import {
    Bell,
    CalendarDays,
    Pill,
    FileText,
    Building2,
    ChevronRight,
    Check
} from "lucide-react";

function NotificationPanel({ patient, unreadCount }) {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchNotifs = async () => {
            try {
                setLoading(true);
                const data = await getNotifications();
                const list = Array.isArray(data) ? data : (data.results || []);
                setNotifications(list.slice(0, 4));
            } catch (err) {
                console.error("Failed to load notifications for panel:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifs();
    }, []);

    const handleItemClick = async (notif) => {
        if (!notif.is_read) {
            try {
                await toggleNotificationRead(notif.id, true);
                setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, is_read: true } : n));
            } catch (err) {
                console.error(err);
            }
        }
        if (notif.link) {
            navigate(notif.link);
        } else {
            navigate("/notifications");
        }
    };

    const renderIcon = (type) => {
        switch (type) {
            case "appointment": return <CalendarDays size={20} />;
            case "prescription": return <Pill size={20} />;
            case "record": return <FileText size={20} />;
            default: return <Building2 size={20} />;
        }
    };

    const unreadTotal = unreadCount !== undefined
        ? unreadCount
        : notifications.filter(item => !item.is_read).length;

    return (
        <section className="notification-panel">
            <div
                className="notification-header"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/notifications")}
                title="Open All Notifications"
            >
                <div>
                    <h2>Notifications</h2>
                    <p>Stay updated with your healthcare</p>
                </div>

                <div className="notification-count">
                    <Bell size={18} />
                    {unreadTotal}
                </div>
            </div>

            <div className="notification-list">
                {notifications.length === 0 ? (
                    <p style={{ textAlign: "center", color: "#64748b", padding: "20px 0", fontSize: "0.9rem" }}>
                        No notifications at this time.
                    </p>
                ) : (
                    notifications.map((item) => (
                        <div
                            key={item.id}
                            className={`notification-item ${!item.is_read ? "unread" : ""}`}
                            style={{ cursor: "pointer" }}
                            onClick={() => handleItemClick(item)}
                        >
                            <div className="notification-icon">
                                {renderIcon(item.notification_type)}
                            </div>

                            <div className="notification-content">
                                <h4>{item.title}</h4>
                                <p>{item.message}</p>
                                <span>
                                    {item.created_at
                                        ? new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                                        : "Recent"}
                                </span>
                            </div>

                            <ChevronRight size={18}/>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}

export default NotificationPanel;