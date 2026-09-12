import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./HospitalDashboard.css";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import WelcomeBanner from "../components/WelcomeBanner";
import Footer from "../components/Footer";

import HospitalStats from "../components/hospital/HospitalStats";
import DoctorManagementTable from "../components/hospital/DoctorManagementTable";
import PatientManagementTable from "../components/hospital/PatientManagementTable";
import HospitalQuickActions from "../components/hospital/HospitalQuickActions";
import HospitalActivity from "../components/hospital/HospitalActivity";
import HospitalCalendar from "../components/hospital/HospitalCalendar";
import DepartmentCard from "../components/hospital/DepartmentCard";
import RevenueCard from "../components/hospital/RevenueCard";

function HospitalDashboard() {
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

        if (user && user.role !== "admin" && !user.is_admin) {
            if (user.role === "doctor" || user.role === "hospital_staff") {
                navigate("/doctor/dashboard");
            } else {
                navigate("/patient/dashboard");
            }
            return;
        }
    }, [navigate]);

    return (
        <div className="hospital-dashboard">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <main className="hospital-main">
                <Topbar onToggleSidebar={() => setSidebarOpen(prev => !prev)} />

                <WelcomeBanner />

                <HospitalStats />

                {/* Revenue */}
                <RevenueCard />

                {/* Department Overview */}
                <DepartmentCard />

                <div className="hospital-grid">

                    <div className="left-column">

                        <DoctorManagementTable />

                        <PatientManagementTable />

                        <HospitalActivity />

                    </div>

                    <div className="right-column">

                        <HospitalQuickActions />

                        <HospitalCalendar />

                    </div>

                </div>

                <Footer />

            </main>

        </div>

    );

}

export default HospitalDashboard;