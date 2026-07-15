import "./NotificationPanel.css";
import {
    Bell,
    CalendarDays,
    Pill,
    TestTube,
    Building2,
    ChevronRight
} from "lucide-react";

function NotificationPanel() {

    const notifications = [

        {
            id: 1,
            icon: <CalendarDays size={20} />,
            title: "Upcoming Appointment",
            message: "You have an appointment tomorrow at 10:30 AM.",
            time: "15 min ago",
            unread: true
        },

        {
            id: 2,
            icon: <Pill size={20} />,
            title: "Prescription Updated",
            message: "Dr. Sarah Johnson updated your medication.",
            time: "2 hours ago",
            unread: true
        },

        {
            id: 3,
            icon: <TestTube size={20} />,
            title: "Lab Results Ready",
            message: "Your blood test results are now available.",
            time: "Yesterday",
            unread: false
        },

        {
            id: 4,
            icon: <Building2 size={20} />,
            title: "Hospital Notice",
            message: "Cardiology department opens at 8:00 AM.",
            time: "2 days ago",
            unread: false
        }

    ];

    return (

        <section className="notification-panel">

            <div className="notification-header">

                <div>

                    <h2>Notifications</h2>

                    <p>
                        Stay updated with your healthcare
                    </p>

                </div>

                <div className="notification-count">

                    <Bell size={18} />

                    {notifications.filter(item => item.unread).length}

                </div>

            </div>

            <div className="notification-list">

                {

                    notifications.map((item)=>(

                        <div
                            key={item.id}
                            className={
                                item.unread
                                    ? "notification-item unread"
                                    : "notification-item"
                            }
                        >

                            <div className="notification-icon">

                                {item.icon}

                            </div>

                            <div className="notification-content">

                                <h4>{item.title}</h4>

                                <p>{item.message}</p>

                                <span>{item.time}</span>

                            </div>

                            <ChevronRight size={18}/>

                        </div>

                    ))

                }

            </div>

        </section>

    );

}

export default NotificationPanel;