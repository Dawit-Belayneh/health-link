import "./QuickActions.css";

import {
    FilePlus2,
    Pill,
    CalendarPlus,
    TestTube,
    FileText,
    UserRoundPlus
} from "lucide-react";

function QuickActions() {

    const actions = [

        {
            id: 1,
            title: "New Medical Record",
            description: "Create a patient's medical record",
            icon: <FilePlus2 size={24} />,
            color: "blue"
        },

        {
            id: 2,
            title: "Write Prescription",
            description: "Prescribe medication",
            icon: <Pill size={24} />,
            color: "green"
        },

        {
            id: 3,
            title: "Schedule Appointment",
            description: "Book a new appointment",
            icon: <CalendarPlus size={24} />,
            color: "orange"
        },

        {
            id: 4,
            title: "Request Lab Test",
            description: "Send laboratory request",
            icon: <TestTube size={24} />,
            color: "purple"
        },

        {
            id: 5,
            title: "Medical Reports",
            description: "View patient reports",
            icon: <FileText size={24} />,
            color: "red"
        },

        {
            id: 6,
            title: "Add Patient Note",
            description: "Save consultation notes",
            icon: <UserRoundPlus size={24} />,
            color: "teal"
        }

    ];

    return (

        <section className="quick-actions">

            <div className="quick-header">

                <h2>Quick Actions</h2>

                <p>Frequently used doctor tools</p>

            </div>

            <div className="quick-grid">

                {

                    actions.map((action)=>(

                        <button
                            key={action.id}
                            className="quick-card"
                        >

                            <div className={`quick-icon ${action.color}`}>

                                {action.icon}

                            </div>

                            <h3>{action.title}</h3>

                            <p>{action.description}</p>

                        </button>

                    ))

                }

            </div>

        </section>

    );

}

export default QuickActions;