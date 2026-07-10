import "./HowItWorks.css";

function HowItWorks() {

    const steps = [
        {
            number: "01",
            icon: "📝",
            title: "Create Account",
            description:
                "Patients, doctors, and hospitals register securely and create their HealthLink account."
        },

        {
            number: "02",
            icon: "👤",
            title: "Complete Profile",
            description:
                "Patients add important health information such as blood type, allergies, and emergency contacts."
        },

        {
            number: "03",
            icon: "🏥",
            title: "Hospital Access",
            description:
                "Doctors request permission from patients before accessing medical information."
        },

        {
            number: "04",
            icon: "🩺",
            title: "Medical Updates",
            description:
                "Doctors add diagnoses, treatments, and medical records after patient visits."
        },

        {
            number: "05",
            icon: "📊",
            title: "Track Health History",
            description:
                "Patients can view their complete medical history anytime from their dashboard."
        }
    ];


    return (

        <section 
            className="how-section"
            id="how-it-works"
        >

            <div className="how-header">

                <span>
                    How It Works
                </span>

                <h2>
                    Simple Healthcare Management Process
                </h2>

                <p>
                    HealthLink creates a secure connection between
                    patients, doctors, and hospitals.
                </p>

            </div>


            <div className="steps-container">


                {
                    steps.map((step,index)=>(

                        <div 
                            className="step-card"
                            key={index}
                        >

                            <div className="step-number">
                                {step.number}
                            </div>


                            <div className="step-icon">
                                {step.icon}
                            </div>


                            <h3>
                                {step.title}
                            </h3>


                            <p>
                                {step.description}
                            </p>


                        </div>

                    ))
                }


            </div>


        </section>

    );
}


export default HowItWorks;