import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import DashboardCard from "../components/DashboardCard";
import "./PatientDashboard.css";

function PatientDashboard() {

    const cards = [
        {
            title: "Medical Records",
            value: "12",
            icon: "📄"
        },
        {
            title: "Doctors Visited",
            value: "5",
            icon: "👨‍⚕️"
        },
        {
            title: "Medications",
            value: "3",
            icon: "💊"
        },
        {
            title: "Appointments",
            value: "2",
            icon: "📅"
        }
    ];

    return (
        <div className="dashboard">

            <Sidebar />

            <div className="dashboard-content">

                <Topbar />

                <div className="cards">

                    {cards.map((card, index) => (
                        <DashboardCard
                            key={index}
                            title={card.title}
                            value={card.value}
                            icon={card.icon}
                        />
                    ))}

                </div>

                <div className="dashboard-grid">

                    <div className="profile-card">

                        <h2>Patient Information</h2>

                        <p><strong>Name:</strong> Dawit Belayneh</p>

                        <p><strong>Blood Type:</strong> O+</p>

                        <p><strong>Phone:</strong> +251900000000</p>

                        <p><strong>Email:</strong> dawit@gmail.com</p>

                        <p><strong>Allergies:</strong> Penicillin</p>

                    </div>

                    <div className="emergency-card">

                        <h2>Emergency Contact</h2>

                        <p><strong>Name:</strong> Abebe</p>

                        <p><strong>Relationship:</strong> Brother</p>

                        <p><strong>Phone:</strong> +251911111111</p>

                    </div>

                </div>

                <div className="records">

                    <h2>Recent Medical Records</h2>

                    <table>

                        <thead>

                            <tr>

                                <th>Date</th>

                                <th>Doctor</th>

                                <th>Diagnosis</th>

                            </tr>

                        </thead>

                        <tbody>

                            <tr>

                                <td>10 Jul 2026</td>

                                <td>Dr. Abel</td>

                                <td>Malaria</td>

                            </tr>

                            <tr>

                                <td>15 Jun 2026</td>

                                <td>Dr. Hana</td>

                                <td>Flu</td>

                            </tr>

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );

}

export default PatientDashboard;