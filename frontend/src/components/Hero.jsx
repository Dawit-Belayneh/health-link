import "./Hero.css";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="hero">

      <div className="hero-container">

        {/* Left Side */}
        <div className="hero-left">

          <span className="hero-tag">
            🩺 Trusted Digital Healthcare Platform
          </span>

          <h1>
            Your Health,
            <span> Connected Everywhere</span>
          </h1>

          <p>
            HealthLink is a secure healthcare platform that connects
            patients, doctors, and hospitals in one centralized system.
            Access your medical history, prescriptions, emergency
            information, and healthcare services anytime, anywhere.
          </p>

          <div className="hero-buttons">

            <Link to="/signup" className="btn-primary">
              Get Started
            </Link>

            <Link to="/login" className="btn-secondary">
              Login
            </Link>

          </div>

          <div className="hero-stats">

            <div>
              <h3>15+</h3>
              <p>Hospitals</p>
            </div>

            <div>
              <h3>250+</h3>
              <p>Doctors</p>
            </div>

            <div>
              <h3>10K+</h3>
              <p>Patients</p>
            </div>

          </div>

        </div>

        {/* Right Side */}

        <div className="hero-right">

          <div className="doctor-card">

            <div className="doctor-image">
              👨‍⚕️
            </div>

            <h2>Digital Healthcare</h2>

            <p>
              Secure patient records accessible only by
              authorized hospitals and healthcare professionals.
            </p>

          </div>

          <div className="floating-card top-card">
            ❤️ Emergency Information
          </div>

          <div className="floating-card bottom-card">
            📄 Medical Records
          </div>

        </div>

      </div>

    </section>
  );
}

export default Hero;