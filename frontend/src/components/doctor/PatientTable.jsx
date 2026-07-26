import "./PatientTable.css";

import {
    Search,
    Eye,
    FileText,
    Phone,
    Droplets
} from "lucide-react";

function PatientTable() {

    const patients = [

        {
            id: 1,
            name: "Dawit Belayneh",
            age: 23,
            blood: "O+",
            phone: "+251 911 123 456",
            lastVisit: "24 Jul 2026",
            status: "Active"
        },

        {
            id: 2,
            name: "Hana Tesfaye",
            age: 35,
            blood: "A+",
            phone: "+251 922 654 321",
            lastVisit: "25 Jul 2026",
            status: "Critical"
        },

        {
            id: 3,
            name: "Samuel Bekele",
            age: 44,
            blood: "B+",
            phone: "+251 933 456 789",
            lastVisit: "20 Jul 2026",
            status: "Recovered"
        },

        {
            id: 4,
            name: "Abel Girma",
            age: 29,
            blood: "AB+",
            phone: "+251 944 555 777",
            lastVisit: "18 Jul 2026",
            status: "Active"
        }

    ];

    return (

        <section className="patient-table">

            <div className="patient-header">

                <div>

                    <h2>My Patients</h2>

                    <p>Manage and review patient information</p>

                </div>

                <div className="patient-search">

                    <Search size={18} />

                    <input
                        type="text"
                        placeholder="Search patient..."
                    />

                </div>

            </div>

            <div className="table-wrapper">

                <table>

                    <thead>

                        <tr>

                            <th>Patient</th>

                            <th>Blood</th>

                            <th>Phone</th>

                            <th>Last Visit</th>

                            <th>Status</th>

                            <th>Actions</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            patients.map((patient)=>(

                                <tr key={patient.id}>

                                    <td>

                                        <div className="patient-info">

                                            <div className="avatar">

                                                {patient.name.charAt(0)}

                                            </div>

                                            <div>

                                                <strong>{patient.name}</strong>

                                                <small>{patient.age} Years</small>

                                            </div>

                                        </div>

                                    </td>

                                    <td>

                                        <div className="cell">

                                            <Droplets size={16}/>

                                            {patient.blood}

                                        </div>

                                    </td>

                                    <td>

                                        <div className="cell">

                                            <Phone size={16}/>

                                            {patient.phone}

                                        </div>

                                    </td>

                                    <td>

                                        {patient.lastVisit}

                                    </td>

                                    <td>

                                        <span
                                            className={`status ${patient.status.toLowerCase()}`}
                                        >

                                            {patient.status}

                                        </span>

                                    </td>

                                    <td>

                                        <div className="actions">

                                            <button className="view-btn">

                                                <Eye size={17}/>

                                            </button>

                                            <button className="record-btn">

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

export default PatientTable;