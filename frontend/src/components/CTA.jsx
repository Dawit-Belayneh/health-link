import "./CTA.css";

function CTA() {
    return (
        <section className="cta-section">

            <div className="cta-container">

                <span className="cta-badge">
                    Join HealthLink Today
                </span>

                <h2>
                    Smarter Healthcare Starts Here
                </h2>

                <p>
                    Whether you're a patient looking for secure access to your
                    medical history, a doctor managing patient care, or a
                    hospital improving efficiency, HealthLink gives you one
                    trusted platform to connect everyone together.
                </p>

                <div className="cta-buttons">

                    <button className="primary-btn">
                        Create Account
                    </button>

                    <button className="secondary-btn">
                        Contact Us
                    </button>

                </div>

            </div>

        </section>
    );
}

export default CTA;