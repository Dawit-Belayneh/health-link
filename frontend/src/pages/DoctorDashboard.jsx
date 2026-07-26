import "./DoctorDashboard.css";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import WelcomeBanner from "../components/WelcomeBanner";
import DoctorStats from "../components/doctor/DoctorStats";
import AppointmentTable from "../components/doctor/AppointmentTable";
import PatientTable from "../components/doctor/PatientTable";
import MedicalRecordTable from "../components/doctor/MedicalRecordTable";
import QuickActions from "../components/doctor/QuickActions";
import NotificationPanel from "../components/doctor/NotificationPanel";
import CalendarCard from "../components/CalendarCard";

function DoctorDashboard() {

    return (

        <div className="doctor-dashboard">

            <Sidebar />

            <main className="doctor-main">

                <Topbar />

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

            </main>

        </div>

    );

}

export default DoctorDashboard;