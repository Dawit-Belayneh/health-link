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

    return (

        <div className="hospital-dashboard">

            <Sidebar />

            <main className="hospital-main">

                <Topbar />

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