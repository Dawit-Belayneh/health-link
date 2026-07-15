import "./MedicalTable.css";
import {
    Search,
    Eye,
    CalendarDays,
    Stethoscope
} from "lucide-react";

function MedicalTable() {

    const records = [

        {
            id: 1,
            date: "12 Jul 2026",
            doctor: "Dr. Sarah Johnson",
            department: "Cardiology",
            diagnosis: "High Blood Pressure",
            status: "Completed"
        },

        {
            id: 2,
            date: "03 Jul 2026",
            doctor: "Dr. Michael Lee",
            department: "Dermatology",
            diagnosis: "Skin Allergy",
            status: "Completed"
        },

        {
            id: 3,
            date: "18 Jun 2026",
            doctor: "Dr. Emily Brown",
            department: "General Medicine",
            diagnosis: "Routine Checkup",
            status: "Completed"
        },

        {
            id: 4,
            date: "10 Jun 2026",
            doctor: "Dr. David Smith",
            department: "Orthopedics",
            diagnosis: "Knee Pain",
            status: "Follow-up"
        }

    ];

    return (

        <section className="medical-table">

            <div className="table-header">

                <h2>Recent Medical Records</h2>

                <div className="table-search">

                    <Search size={18} />

                    <input
                        type="text"
                        placeholder="Search records..."
                    />

                </div>

            </div>

            <div className="table-wrapper">

                <table>

                    <thead>

                        <tr>

                            <th>Date</th>

                            <th>Doctor</th>

                            <th>Department</th>

                            <th>Diagnosis</th>

                            <th>Status</th>

                            <th>Action</th>

                        </tr>

                    </thead>

                    <tbody>

                        {records.map((record) => (

                            <tr key={record.id}>

                                <td>

                                    <div className="cell">

                                        <CalendarDays size={16} />

                                        {record.date}

                                    </div>

                                </td>

                                <td>{record.doctor}</td>

                                <td>

                                    <div className="cell">

                                        <Stethoscope size={16} />

                                        {record.department}

                                    </div>

                                </td>

                                <td>{record.diagnosis}</td>

                                <td>

                                    <span
                                        className={
                                            record.status === "Completed"
                                                ? "status completed"
                                                : "status followup"
                                        }
                                    >

                                        {record.status}

                                    </span>

                                </td>

                                <td>

                                    <button className="view-btn">

                                        <Eye size={17} />

                                        View

                                    </button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </section>

    );

}

export default MedicalTable;