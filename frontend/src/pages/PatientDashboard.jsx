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

function PatientDashboard() {
    return (
        <div className="patient-dashboard">

            <Sidebar />

            <main className="dashboard-main">

                <Topbar />

                <WelcomeBanner />

                <DashboardCards />

                <div className="dashboard-grid">

                    <div className="left-column">

                        <HealthOverview />

                        <MedicalTable />

                        <Timeline />

                    </div>

                    <div className="right-column">

                        <AppointmentCard />

                        <PrescriptionCard />

                        <NotificationPanel />

                        <EmergencyCard />

                    </div>

                </div>

                <Footer />

            </main>

        </div>
    );
}

export default PatientDashboard;