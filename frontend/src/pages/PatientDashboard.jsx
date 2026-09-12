import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PatientDashboard.css";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import WelcomeBanner from "../components/WelcomeBanner";
import DashboardCards from "../components/DashboardCard";
import HealthOverview from "../components/HealthOverview";
import AppointmentCard from "../components/AppointmentCard";
import MedicalTable from "../components/MedicalTable";
import PrescriptionCard from "../components/PrescriptionCard";
import NotificationPanel from "../components/NotificationPanel";
import EmergencyCard from "../components/EmergencyCard";
import Timeline from "../components/Timeline";
import Footer from "../components/Footer";

import { getDashboardSummary } from "../services/patient";

function PatientDashboard() {
    const navigate = useNavigate();
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("access");
        if (!token) {
            navigate("/login");
            return;
        }

        const userStr = localStorage.getItem("user");
        let user = null;
        try {
            user = userStr ? JSON.parse(userStr) : null;
        } catch {
            user = null;
        }
        if (user && (user.role === "doctor" || user.role === "hospital_staff")) {
            navigate("/doctor/dashboard");
            return;
        }
        if (user && (user.role === "admin" || user.is_admin)) {
            navigate("/hospital/dashboard");
            return;
        }

        const fetchSummary = async () => {
            try {
                setLoading(true);
                setError("");
                const data = await getDashboardSummary();
                setSummary(data);
            } catch (err) {
                console.error("Failed to load patient dashboard summary:", err);
                if (err.response && err.response.status === 401) {
                    navigate("/login");
                } else {
                    setError("Could not load real-time medical data. Please ensure backend server is running.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, [navigate]);

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
                    <h3 style={{ color: "#334155", margin: 0 }}>Loading your live medical dashboard...</h3>
                    <p style={{ color: "#64748b", marginTop: "6px" }}>Connecting to HealthLink real clinical database</p>
                </div>
            </div>
        );
    }

    const patient = summary?.patient || null;
    const records = summary?.recent_records || [];
    const upcomingApt = summary?.upcoming_appointment || null;
    const appointments = summary?.appointments || [];
    const latestVitals = summary?.latest_vitals || null;
    const prescriptions = summary?.prescriptions || [];
    const unreadCount = summary?.unread_notifications_count || 0;

    return (
        <div className="patient-dashboard">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <main className="dashboard-main">
                <Topbar
                    patient={patient}
                    onToggleSidebar={() => setSidebarOpen(prev => !prev)}
                />

                {error && (
                    <div style={{
                        margin: "16px 24px 0",
                        padding: "12px 16px",
                        backgroundColor: "#fee2e2",
                        color: "#b91c1c",
                        borderRadius: "8px",
                        border: "1px solid #fca5a5"
                    }}>
                        {error}
                    </div>
                )}

                <WelcomeBanner
                    patient={patient}
                    records={records}
                    upcomingApt={upcomingApt}
                    latestVitals={latestVitals}
                />

                <DashboardCards
                    patient={patient}
                    records={records}
                    appointments={appointments}
                    prescriptions={prescriptions}
                    latestVitals={latestVitals}
                />

                <div className="dashboard-grid">
                    <div className="left-column">
                        <HealthOverview
                            patient={patient}
                            latestVitals={latestVitals}
                        />
                        <MedicalTable records={records} />
                        <PrescriptionCard
                            prescriptions={prescriptions}
                            records={records}
                        />
                        <Timeline
                            records={records}
                            appointments={appointments}
                            prescriptions={prescriptions}
                        />
                    </div>

                    <div className="right-column">
                        <AppointmentCard
                            appointment={upcomingApt}
                            records={records}
                        />
                        <NotificationPanel
                            patient={patient}
                            unreadCount={unreadCount}
                        />
                        <EmergencyCard
                            patient={patient}
                            prescriptions={prescriptions}
                            records={records}
                        />
                    </div>
                </div>

                <Footer />
            </main>
        </div>
    );
}

export default PatientDashboard;