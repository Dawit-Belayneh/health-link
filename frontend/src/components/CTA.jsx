import "./CTA.css";
import { Link } from "react-router-dom";

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

                    <Link to="/signup" className="primary-btn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                        Create Patient Account
                    </Link>

                    <Link to="/login" className="secondary-btn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                        Portal Login
                    </Link>

                </div>

            </div>

        </section>
    );
}

export default CTA;