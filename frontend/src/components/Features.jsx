import "./Features.css";

function Features() {

    const features = [
        {
            icon: "👤",
            title: "Patient Portal",
            description:
                "Patients can manage their health profile, view medical history, allergies, medications, and emergency information."
        },

        {
            icon: "👨‍⚕️",
            title: "Doctor Dashboard",
            description:
                "Doctors can securely access approved patient records, add diagnoses, and update medical information."
        },

        {
            icon: "🏥",
            title: "Hospital Management",
            description:
                "Hospitals can manage healthcare staff, monitor activities, and organize patient care efficiently."
        },

        {
            icon: "📋",
            title: "Medical Records",
            description:
                "Store and access medical history, diagnoses, treatments, and prescriptions in one centralized system."
        },

        {
            icon: "🔐",
            title: "Secure Access",
            description:
                "Role-based authentication ensures patients, doctors, and administrators only access permitted data."
        },

        {
            icon: "🚑",
            title: "Emergency Information",
            description:
                "Important patient information such as blood type and emergency contacts are available when needed."
        }
    ];


    return (

        <section className="features-section" id="features">

            <div className="features-header">

                <span>
                    Our Features
                </span>

                <h2>
                    Everything You Need For Smarter Healthcare
                </h2>

                <p>
                    HealthLink connects patients, doctors, and hospitals
                    through a secure digital healthcare ecosystem.
                </p>

            </div>


            <div className="features-container">

                {
                    features.map((feature, index) => (

                        <div 
                            className="feature-card"
                            key={index}
                        >

                            <div className="feature-icon">
                                {feature.icon}
                            </div>


                            <h3>
                                {feature.title}
                            </h3>


                            <p>
                                {feature.description}
                            </p>


                            <button>
                                Learn More →
                            </button>

                        </div>

                    ))
                }

            </div>

        </section>

    );
}


export default Features;