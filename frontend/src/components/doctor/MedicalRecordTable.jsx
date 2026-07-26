import "./MedicalRecordTable.css";

import {
    Search,
    FileText,
    SquarePen,
    Eye,
    CalendarDays
} from "lucide-react";

function MedicalRecordTable() {

    const records = [

        {
            id: 1,
            patient: "Dawit Belayneh",
            diagnosis: "Hypertension",
            treatment: "Lifestyle changes + Amlodipine",
            date: "26 Jul 2026",
            status: "Follow-up"
        },

        {
            id: 2,
            patient: "Hana Tesfaye",
            diagnosis: "Type 2 Diabetes",
            treatment: "Metformin 500mg",
            date: "25 Jul 2026",
            status: "Stable"
        },

        {
            id: 3,
            patient: "Samuel Bekele",
            diagnosis: "Skin Allergy",
            treatment: "Antihistamine",
            date: "24 Jul 2026",
            status: "Recovered"
        },

        {
            id: 4,
            patient: "Abel Girma",
            diagnosis: "Common Cold",
            treatment: "Rest & Hydration",
            date: "23 Jul 2026",
            status: "Completed"
        }

    ];

    return (

        <section className="medical-record-table">

            <div className="medical-header">

                <div>

                    <h2>Recent Medical Records</h2>

                    <p>Patient diagnosis and treatment history</p>

                </div>

                <div className="medical-search">

                    <Search size={18}/>

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

                            <th>Patient</th>

                            <th>Diagnosis</th>

                            <th>Treatment</th>

                            <th>Date</th>

                            <th>Status</th>

                            <th>Action</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            records.map((record)=>(

                                <tr key={record.id}>

                                    <td>

                                        <div className="patient-name">

                                            <div className="avatar">

                                                {record.patient.charAt(0)}

                                            </div>

                                            {record.patient}

                                        </div>

                                    </td>

                                    <td>{record.diagnosis}</td>

                                    <td>{record.treatment}</td>

                                    <td>

                                        <div className="date-cell">

                                            <CalendarDays size={16}/>

                                            {record.date}

                                        </div>

                                    </td>

                                    <td>

                                        <span
                                            className={`status ${record.status.toLowerCase().replace(" ","-")}`}
                                        >

                                            {record.status}

                                        </span>

                                    </td>

                                    <td>

                                        <div className="actions">

                                            <button className="view-btn">

                                                <Eye size={17}/>

                                            </button>

                                            <button className="edit-btn">

                                                <SquarePen size={17}/>

                                            </button>

                                            <button className="file-btn">

                                                <FileText size={17}/>

                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ))

                        }

                    </tbody>

                </table>

            </div>

        </section>

    );

}

export default MedicalRecordTable;