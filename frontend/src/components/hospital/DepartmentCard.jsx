import "./DepartmentCard.css";

import {
    HeartPulse,
    Brain,
    Baby,
    Bone,
    Eye,
    Microscope,
    ArrowRight
} from "lucide-react";

function DepartmentCard() {

    const departments = [

        {
            id: 1,
            name: "Cardiology",
            doctors: 12,
            patients: 245,
            icon: <HeartPulse size={28} />,
            color: "red"
        },

        {
            id: 2,
            name: "Neurology",
            doctors: 8,
            patients: 156,
            icon: <Brain size={28} />,
            color: "purple"
        },

        {
            id: 3,
            name: "Pediatrics",
            doctors: 10,
            patients: 198,
            icon: <Baby size={28} />,
            color: "green"
        },

        {
            id: 4,
            name: "Orthopedics",
            doctors: 6,
            patients: 117,
            icon: <Bone size={28} />,
            color: "orange"
        },

        {
            id: 5,
            name: "Ophthalmology",
            doctors: 5,
            patients: 95,
            icon: <Eye size={28} />,
            color: "blue"
        },

        {
            id: 6,
            name: "Laboratory",
            doctors: 7,
            patients: 322,
            icon: <Microscope size={28} />,
            color: "cyan"
        }

    ];

    return (

        <section className="department-section">

            <div className="department-header">

                <div>

                    <h2>Hospital Departments</h2>

                    <p>Overview of all medical departments</p>

                </div>

                <button>

                    View All

                    <ArrowRight size={18} />

                </button>

            </div>

            <div className="department-grid">

                {

                    departments.map((department)=>(

                        <div
                            className="department-card"
                            key={department.id}
                        >

                            <div className={`department-icon ${department.color}`}>

                                {department.icon}

                            </div>

                            <h3>{department.name}</h3>

                            <div className="department-stats">

                                <div>

                                    <h4>{department.doctors}</h4>

                                    <span>Doctors</span>

                                </div>

                                <div>

                                    <h4>{department.patients}</h4>

                                    <span>Patients</span>

                                </div>

                            </div>

                            <button>

                                Manage Department

                            </button>

                        </div>

                    ))

                }

            </div>

        </section>

    );

}

export default DepartmentCard;