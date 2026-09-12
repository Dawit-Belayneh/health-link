import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import "./PatientManagementTable.css";
import {
    Search,
    Eye,
    User,
    Mail,
    Phone,
    HeartPulse,
    Shield,
    X,
    ShieldCheck
} from "lucide-react";

function PatientManagementTable() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPatient, setSelectedPatient] = useState(null);

    useEffect(() => {
        if (selectedPatient) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [selectedPatient]);

    const patients = [
        {
            id: 1,
            name: "Abebe Kebede",
            gender: "Male",
            age: 38,
            email: "abebe@gmail.com",
            phone: "+251 911 123456",
            blood: "O+",
            emergency_contact: "Tigist Kebede (Spouse, +251 911 888999)",
            status: "Active"
        },
        {
            id: 2,
            name: "Sara Tesfaye",
            gender: "Female",
            age: 29,
            email: "sara@gmail.com",
            phone: "+251 922 456789",
            blood: "A+",
            emergency_contact: "Mulugeta Tesfaye (Father, +251 922 111222)",
            status: "Active"
        },
        {
            id: 3,
            name: "Daniel Bekele",
            gender: "Male",
            age: 45,
            email: "daniel@gmail.com",
            phone: "+251 933 741852",
            blood: "B-",
            emergency_contact: "Hellen Bekele (Sister, +251 933 000111)",
            status: "Active"
        },
        {
            id: 4,
            name: "Meron Alemu",
            gender: "Female",
            age: 33,
            email: "meron@gmail.com",
            phone: "+251 944 852963",
            blood: "AB+",
            emergency_contact: "Bereket Alemu (Brother, +251 944 555666)",
            status: "Active"
        },
        {
            id: 5,
            name: "Yonas Tadesse",
            gender: "Male",
            age: 52,
            email: "yonas@gmail.com",
            phone: "+251 955 654321",
            blood: "O-",
            emergency_contact: "Almaz Tadesse (Spouse, +251 955 999888)",
            status: "Active"
        }
    ];

    const filtered = patients.filter((p) => {
        const q = searchTerm.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q) || p.phone.includes(q);
    });

    return (
        <section className="patient-management">
            <div className="patient-header">
                <div>
                    <h2>Hospital Patient Registry</h2>
                    <p>Read-only clinical patient records registered with your hospital</p>
                </div>

                <div className="patient-search">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search patient..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div style={{
                padding: "10px 16px",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
                fontSize: "0.82rem",
                color: "#64748b",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
            }}>
                <Shield size={16} color="#0284c7" />
                <span>
                    <strong>Compliance Notice:</strong> Patient clinical records and medical history are protected under healthcare regulations and cannot be modified or deleted by hospital administrative personnel.
                </span>
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
                        {filtered.map((patient) => (
                            <tr key={patient.id}>
                                <td>
                                    <div className="patient-info">
                                        <div className="patient-avatar">
                                            <User size={22} />
                                        </div>
                                        <div>
                                            <strong>{patient.name}</strong>
                                            <small style={{ color: "#64748b", fontSize: "0.78rem" }}>{patient.age} Yrs</small>
                                        </div>
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
                                        <button
                                            className="view"
                                            title="View Protected Patient Info"
                                            onClick={() => setSelectedPatient(patient)}
                                            style={{
                                                width: "36px",
                                                height: "36px",
                                                borderRadius: "8px",
                                                border: "1px solid #e2e8f0",
                                                background: "#f1f5f9",
                                                color: "#334155",
                                                cursor: "pointer",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center"
                                            }}
                                        >
                                            <Eye size={17} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* View Patient Details Modal */}
            {selectedPatient && createPortal(
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    backgroundColor: "rgba(15, 23, 42, 0.6)",
                    backdropFilter: "blur(4px)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 99999,
                    padding: "20px"
                }}>
                    <div style={{
                        background: "#ffffff",
                        borderRadius: "16px",
                        width: "100%",
                        maxWidth: "460px",
                        padding: "24px",
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#eff6ff", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <User size={20} />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, color: "#0f172a", fontSize: "1.15rem" }}>{selectedPatient.name}</h3>
                                    <span style={{ color: "#64748b", fontSize: "0.82rem" }}>Registered Hospital Patient</span>
                                </div>
                            </div>
                            <button onClick={() => setSelectedPatient(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}>
                                <X size={20} />
                            </button>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.88rem", padding: "12px 0", borderTop: "1px solid #f1f5f9", borderBottom: "1px solid #f1f5f9" }}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ color: "#64748b" }}>Age / Gender:</span>
                                <strong>{selectedPatient.age} Yrs • {selectedPatient.gender}</strong>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ color: "#64748b" }}>Blood Type:</span>
                                <strong style={{ color: "#dc2626" }}>{selectedPatient.blood}</strong>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ color: "#64748b" }}>Phone Number:</span>
                                <strong>{selectedPatient.phone}</strong>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ color: "#64748b" }}>Email:</span>
                                <strong>{selectedPatient.email}</strong>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ color: "#64748b" }}>Emergency Contact:</span>
                                <strong style={{ textAlign: "right" }}>{selectedPatient.emergency_contact}</strong>
                            </div>
                        </div>

                        <div style={{ marginTop: "14px", padding: "10px 12px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", fontSize: "0.8rem", color: "#166534", display: "flex", alignItems: "center", gap: "8px" }}>
                            <ShieldCheck size={16} />
                            <span>Clinical medical history is certified and protected against admin editing.</span>
                        </div>

                        <button
                            onClick={() => setSelectedPatient(null)}
                            style={{
                                width: "100%",
                                marginTop: "16px",
                                padding: "10px",
                                borderRadius: "8px",
                                border: "1px solid #cbd5e1",
                                background: "#f8fafc",
                                fontWeight: "600",
                                cursor: "pointer"
                            }}
                        >
                            Close
                        </button>
                    </div>
                </div>,
                document.body
            )}
        </section>
    );
}

export default PatientManagementTable;