import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./DoctorDashboard.css";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import WelcomeBanner from "../components/WelcomeBanner";
import DoctorStats from "../components/doctor/DoctorStats";
import AppointmentTable from "../components/doctor/AppointmentTable";
import PatientTable from "../components/doctor/PatientTable";
import MedicalRecordTable from "../components/doctor/MedicalRecordTable";
import QuickActions from "../components/doctor/QuickActions";
import NotificationPanel from "../components/NotificationPanel";
import CalendarCard from "../components/CalendarCard";
import Footer from "../components/Footer";

function DoctorDashboard() {
    const navigate = useNavigate();
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

        if (user && user.role !== "doctor" && user.role !== "hospital_staff") {
            if (user.role === "admin" || user.is_admin) {
                navigate("/hospital/dashboard");
            } else {
                navigate("/patient/dashboard");
            }
            return;
        }
    }, [navigate]);

    return (
        <div className="doctor-dashboard">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <main className="doctor-main">
                <Topbar onToggleSidebar={() => setSidebarOpen(prev => !prev)} />

                <WelcomeBanner />

                <DoctorStats />

                <div className="doctor-grid">

                    <div className="left-column">

                        <AppointmentTable />

                        <PatientTable />

                        <MedicalRecordTable />

                    </div>

                    <div className="right-column">

                        <QuickActions />

                        <NotificationPanel />

                        <CalendarCard />

                    </div>

                </div>

                <Footer />

            </main>

        </div>

    );

}

export default DoctorDashboard;