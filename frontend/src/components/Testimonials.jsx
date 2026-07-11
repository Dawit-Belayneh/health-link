import "./Testimonials.css";

function Testimonials() {

    const testimonials = [

        {
            name: "Abel Tadesse",
            role: "Patient",
            image: "👨",
            rating: "★★★★★",
            message:
                "HealthLink makes it easy to access my medical history wherever I go. I no longer worry about carrying paper documents."
        },

        {
            name: "Dr. Hana Bekele",
            role: "Medical Doctor",
            image: "👩‍⚕️",
            rating: "★★★★★",
            message:
                "The platform helps us securely access patient records and update diagnoses quickly, improving patient care."
        },

        {
            name: "Sarah Alemu",
            role: "Hospital Administrator",
            image: "👩",
            rating: "★★★★★",
            message:
                "Managing hospital staff and patient records has become much more organized and efficient with HealthLink."
        }

    ];

    return (

        <section
            className="testimonial-section"
            id="testimonials"
        >

            <div className="testimonial-header">

                <span>
                    Testimonials
                </span>

                <h2>
                    Trusted By Patients, Doctors & Hospitals
                </h2>

                <p>
                    Hear what people say about using HealthLink for
                    secure healthcare management.
                </p>

            </div>


            <div className="testimonial-container">

                {

                    testimonials.map((item,index)=>(

                        <div
                            className="testimonial-card"
                            key={index}
                        >

                            <div className="quote">
                                ❝
                            </div>

                            <p className="message">
                                {item.message}
                            </p>

                            <div className="rating">
                                {item.rating}
                            </div>

                            <div className="user-info">

                                <div className="avatar">
                                    {item.image}
                                </div>

                                <div>

                                    <h3>
                                        {item.name}
                                    </h3>

                                    <span>
                                        {item.role}
                                    </span>

                                </div>

                            </div>

                        </div>

                    ))

                }

            </div>

        </section>

    );

}

export default Testimonials;