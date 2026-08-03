import "./PatientManagementTable.css";

import {
    Search,
    Eye,
    SquarePen,
    Trash2,
    User,
    Mail,
    Phone,
    HeartPulse
} from "lucide-react";

function PatientManagementTable() {

    const patients = [

        {
            id: 1,
            name: "Abebe Kebede",
            gender: "Male",
            email: "abebe@gmail.com",
            phone: "+251 911 123456",
            blood: "O+",
            status: "Active"
        },

        {
            id: 2,
            name: "Sara Tesfaye",
            gender: "Female",
            email: "sara@gmail.com",
            phone: "+251 922 456789",
            blood: "A+",
            status: "Active"
        },

        {
            id: 3,
            name: "Daniel Bekele",
            gender: "Male",
            email: "daniel@gmail.com",
            phone: "+251 933 741852",
            blood: "B-",
            status: "Inactive"
        },

        {
            id: 4,
            name: "Meron Alemu",
            gender: "Female",
            email: "meron@gmail.com",
            phone: "+251 944 852963",
            blood: "AB+",
            status: "Active"
        },

        {
            id: 5,
            name: "Yonas Tadesse",
            gender: "Male",
            email: "yonas@gmail.com",
            phone: "+251 955 654321",
            blood: "O-",
            status: "Active"
        }

    ];

    return (

        <section className="patient-management">

            <div className="patient-header">

                <div>

                    <h2>Patient Management</h2>

                    <p>Manage registered patients</p>

                </div>

                <div className="patient-search">

                    <Search size={18} />

                    <input
                        type="text"
                        placeholder="Search patient..."
                    />

                </div>

            </div>

            <div className="patient-table-wrapper">

                <table>

                    <thead>

                        <tr>

                            <th>Patient</th>

                            <th>Gender</th>

                            <th>Email</th>

                            <th>Phone</th>

                            <th>Blood</th>

                            <th>Status</th>

                            <th>Action</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            patients.map((patient) => (

                                <tr key={patient.id}>

                                    <td>

                                        <div className="patient-info">

                                            <div className="patient-avatar">

                                                <User size={22} />

                                            </div>

                                            {patient.name}

                                        </div>

                                    </td>

                                    <td>{patient.gender}</td>

                                    <td>

                                        <div className="icon-text">

                                            <Mail size={15} />

                                            {patient.email}

                                        </div>

                                    </td>

                                    <td>

                                        <div className="icon-text">

                                            <Phone size={15} />

                                            {patient.phone}

                                        </div>

                                    </td>

                                    <td>

                                        <div className="blood-group">

                                            <HeartPulse size={15} />

                                            {patient.blood}

                                        </div>

                                    </td>

                                    <td>

                                        <span className={patient.status === "Active" ? "status active" : "status inactive"}>

                                            {patient.status}

                                        </span>

                                    </td>

                                    <td>

                                        <div className="actions">

                                            <button className="view">

                                                <Eye size={17} />

                                            </button>

                                            <button className="edit">

                                                <SquarePen size={17} />

                                            </button>

                                            <button className="delete">

                                                <Trash2 size={17} />

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

export default PatientManagementTable;