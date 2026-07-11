import "./Footer.css";

function Footer() {
    return (
        <footer className="footer">

            <div className="footer-container">

                {/* Company */}

                <div className="footer-column">

                    <h2 className="footer-logo">
                        Health<span>Link</span>
                    </h2>

                    <p>
                        HealthLink is a secure healthcare platform that
                        connects patients, doctors, and hospitals through
                        one centralized digital system. Our mission is to
                        make healthcare information accessible, secure,
                        and efficient.
                    </p>

                </div>

                {/* Quick Links */}

                <div className="footer-column">

                    <h3>Quick Links</h3>

                    <ul>

                        <li><a href="/">Home</a></li>

                        <li><a href="#features">Features</a></li>

                        <li><a href="#how-it-works">How It Works</a></li>

                        <li><a href="#testimonials">Testimonials</a></li>

                        <li><a href="/login">Login</a></li>

                    </ul>

                </div>

                {/* Services */}

                <div className="footer-column">

                    <h3>Services</h3>

                    <ul>

                        <li>Patient Portal</li>

                        <li>Doctor Dashboard</li>

                        <li>Hospital Management</li>

                        <li>Medical Records</li>

                        <li>Emergency Information</li>

                    </ul>

                </div>

                {/* Contact */}

                <div className="footer-column">

                    <h3>Contact</h3>

                    <ul>

                        <li>📍 Adama, Ethiopia</li>

                        <li>📧 support@healthlink.com</li>

                        <li>📞 +251 900 000 000</li>

                        <li>🌐 www.healthlink.com</li>

                    </ul>

                    <div className="social-icons">

                        <a href="#">🌐</a>

                        <a href="#">📘</a>

                        <a href="#">💼</a>

                        <a href="#">▶️</a>

                    </div>

                </div>

            </div>

            <div className="footer-bottom">

                <p>
                    © 2026 HealthLink. All Rights Reserved.
                </p>

            </div>

        </footer>
    );
}

export default Footer;