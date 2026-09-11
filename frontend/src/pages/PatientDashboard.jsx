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

import { getPatientProfile, getMedicalRecords } from "../services/patient";

function PatientDashboard() {
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("access");
        if (!token) {
            navigate("/login");
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                setError("");
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
                console.error("Failed to load patient dashboard data:", err);
                if (err.response && err.response.status === 401) {
                    navigate("/login");
                } else {
                    setError("Could not load medical data. Please ensure backend server is running.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
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
                    <h3 style={{ color: "#334155", margin: 0 }}>Loading your medical profile...</h3>
                    <p style={{ color: "#64748b", marginTop: "6px" }}>Connecting to HealthLink secure database</p>
                </div>
            </div>
        );
    }

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

                <WelcomeBanner patient={patient} records={records} />

                <DashboardCards patient={patient} records={records} />

                <div className="dashboard-grid">
                    <div className="left-column">
                        <HealthOverview patient={patient} />
                        <MedicalTable records={records} />
                        <Timeline records={records} />
                    </div>

                    <div className="right-column">
                        <AppointmentCard records={records} />
                        <PrescriptionCard records={records} />
                        <NotificationPanel patient={patient} />
                        <EmergencyCard patient={patient} records={records} />
                    </div>
                </div>

                <Footer />
            </main>
        </div>
    );
}

export default PatientDashboard;