import "./Navbar.css";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <Link to="/" className="logo">
          <span className="logo-icon">🏥</span>
          <span className="logo-text">HealthLink</span>
        </Link>

        {/* Navigation Links */}
        <ul className="nav-menu">
          <li>
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>

          <li>
            <a href="#features" className="nav-link">
              Features
            </a>
          </li>

          <li>
            <a href="#how-it-works" className="nav-link">
              How It Works
            </a>
          </li>

          <li>
            <a href="#testimonials" className="nav-link">
              Testimonials
            </a>
          </li>

          <li>
            <a href="#contact" className="nav-link">
              Contact
            </a>
          </li>
        </ul>

        {/* Buttons */}
        <div className="nav-buttons">
          <Link to="/login" className="login-btn">
            Login
          </Link>

          <Link to="/signup" className="signup-btn">
            Get Started
          </Link>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;