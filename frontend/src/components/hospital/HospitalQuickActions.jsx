import "./HospitalQuickActions.css";

import {
    UserRoundPlus,
    Stethoscope,
    Building2,
    CalendarPlus,
    FilePlus2,
    Users,
    ShieldCheck,
    ArrowRight
} from "lucide-react";

function HospitalQuickActions() {

    const actions = [

        {
            title: "Create Doctor",
            desc: "Create a new doctor account.",
            icon: <Stethoscope size={24} />,
            color: "blue"
        },

        {
            title: "Register Patient",
            desc: "Add a new patient profile.",
            icon: <UserRoundPlus size={24} />,
            color: "green"
        },

        {
            title: "Departments",
            desc: "Manage hospital departments.",
            icon: <Building2 size={24} />,
            color: "purple"
        },

        {
            title: "Appointments",
            desc: "Schedule patient visits.",
            icon: <CalendarPlus size={24} />,
            color: "orange"
        },

        {
            title: "Medical Records",
            desc: "Create patient records.",
            icon: <FilePlus2 size={24} />,
            color: "red"
        },

        {
            title: "Hospital Staff",
            desc: "Manage all staff members.",
            icon: <Users size={24} />,
            color: "cyan"
        },

        {
            title: "Permissions",
            desc: "Manage system access.",
            icon: <ShieldCheck size={24} />,
            color: "indigo"
        }

    ];

    return (

        <section className="hospital-actions">

            <div className="hospital-actions-header">

                <h2>Quick Actions</h2>

                <p>Frequently used administration tools</p>

            </div>

            <div className="hospital-actions-grid">

                {

                    actions.map((action,index)=>(

                        <button
                            key={index}
                            className="action-card"
                        >

                            <div className={`action-icon ${action.color}`}>

                                {action.icon}

                            </div>

                            <div className="action-info">

                                <h4>{action.title}</h4>

                                <p>{action.desc}</p>

                            </div>

                            <ArrowRight size={18}/>

                        </button>

                    ))

                }

            </div>

        </section>

    );

}

export default HospitalQuickActions;