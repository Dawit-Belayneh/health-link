import "./DoctorDashboard.css";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import WelcomeBanner from "../components/WelcomeBanner";
// import DoctorStats from "../components/DoctorStats";
// import AppointmentTable from "../components/AppointmentTable";
// import PatientTable from "../components/PatientTable";
// import MedicalRecordTable from "../components/MedicalRecordTable";
// import QuickActions from "../components/QuickActions";
// import NotificationPanel from "../components/NotificationPanel";
// import CalendarCard from "../components/CalendarCard";

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