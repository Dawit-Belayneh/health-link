import "./HospitalDashboard.css";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import WelcomeBanner from "../components/WelcomeBanner";
import Footer from "../components/Footer";

import HospitalStats from "../components/hospital/HospitalStats";
import DoctorManagementTable from "../components/hospital/DoctorManagementTable";
import PatientManagementTable from "../components/hospital/PatientManagementTable";
import HospitalQuickActions from "../components/hospital/HospitalQuickActions";
import NotificationPanel from "../components/NotificationPanel";
import CalendarCard from "../components/CalendarCard";

function HospitalDashboard() {

    return (

        <div className="hospital-dashboard">

            <Sidebar />

            <main className="hospital-main">

                <Topbar />

                <WelcomeBanner />

                <HospitalStats />

                <div className="hospital-grid">

                    <div className="left-column">

                        <DoctorManagementTable />

                        <PatientManagementTable />

                    </div>

                    <div className="right-column">

                        <HospitalQuickActions />

                        <NotificationPanel />

                        <CalendarCard />

                    </div>

                </div>

                <Footer />

            </main>

        </div>

    );

}

export default HospitalDashboard;

