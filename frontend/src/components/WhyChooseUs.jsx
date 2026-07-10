import "./WhyChooseUs.css";

function WhyChooseUs() {

    const benefits = [
        {
            icon: "🔐",
            title: "Secure Medical Data",
            description:
                "Patient information is protected with secure authentication and controlled access."
        },

        {
            icon: "👥",
            title: "Role-Based Access",
            description:
                "Patients, doctors, hospitals, and administrators only access information they are allowed to manage."
        },

        {
            icon: "🏥",
            title: "Connected Healthcare",
            description:
                "A centralized platform that connects hospitals, doctors, and patients efficiently."
        },

        {
            icon: "⚡",
            title: "Fast Information Access",
            description:
                "Authorized healthcare professionals can quickly access important patient information when needed."
        },

        {
            icon: "📋",
            title: "Complete Medical History",
            description:
                "Store diagnoses, treatments, medications, and previous visits in one place."
        },

        {
            icon: "🚑",
            title: "Emergency Ready",
            description:
                "Critical information like blood type and emergency contacts can help during urgent situations."
        }
    ];


    return (

        <section className="why-section">

            <div className="why-container">


                {/* Left Content */}

                <div className="why-content">

                    <span>
                        Why HealthLink?
                    </span>


                    <h2>
                        Building A Smarter
                        Healthcare Experience
                    </h2>


                    <p>
                        HealthLink improves healthcare communication by
                        creating a secure connection between patients,
                        doctors, and hospitals.
                    </p>


                    <p>
                        Our platform gives patients control over their
                        health information while allowing healthcare
                        professionals to provide better services.
                    </p>


                    <button>
                        Learn More →
                    </button>


                </div>



                {/* Right Cards */}

                <div className="benefits-container">

                    {
                        benefits.map((item,index)=>(

                            <div 
                                className="benefit-card"
                                key={index}
                            >

                                <div className="benefit-icon">
                                    {item.icon}
                                </div>


                                <div>

                                    <h3>
                                        {item.title}
                                    </h3>

                                    <p>
                                        {item.description}
                                    </p>

                                </div>


                            </div>

                        ))
                    }


                </div>


            </div>


        </section>

    );
}


export default WhyChooseUs;