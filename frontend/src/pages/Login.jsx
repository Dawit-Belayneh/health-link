import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "./Login.css";
import { loginUser } from "../services/auth";
import {
    User,
    Stethoscope,
    Building2,
    Lock,
    Eye,
    EyeOff,
    AlertCircle,
    CheckCircle2,
    Info,
    ArrowRight,
    Sparkles
} from "lucide-react";

function Login() {
    const navigate = useNavigate();
    const location = useLocation();

    // Check query params for pre-selected role or recent registration
    const queryParams = new URLSearchParams(location.search);
    const initialRole = queryParams.get("role") || "patient";
    const justRegistered = queryParams.get("registered");

    const [selectedRole, setSelectedRole] = useState(initialRole);
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successNotice, setSuccessNotice] = useState(
        justRegistered === "patient"
            ? "Your patient account has been created successfully! Please log in below."
            : ""
    );

    useEffect(() => {
        if (["patient", "doctor", "admin"].includes(initialRole)) {
            setSelectedRole(initialRole);
        }
    }, [initialRole]);

    const handleRoleChange = (role) => {
        setSelectedRole(role);
        setError("");
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (error) setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const data = await loginUser(formData);

            localStorage.setItem("access", data.access);
            localStorage.setItem("refresh", data.refresh);
            if (data.user) {
                localStorage.setItem("user", JSON.stringify(data.user));
            }

            console.log("Login successful!", data);

            // Redirect directly to role-specific dashboard based on verified user role
            const userRole = data.user?.role;
            const isAdmin = userRole === "admin" || data.user?.is_admin;
            const isDoctor = userRole === "doctor" || userRole === "hospital_staff";

            if (isDoctor) {
                navigate("/doctor/dashboard");
            } else if (isAdmin) {
                navigate("/hospital/dashboard");
            } else {
                navigate("/patient/dashboard");
            }
        } catch (err) {
            console.error("Login error:", err);
            if (err.response && err.response.data) {
                const detail = err.response.data.detail || err.response.data.message || "Invalid username or password.";
                setError(detail);
            } else {
                setError("Unable to connect to the backend server. Please check your connection.");
            }
        } finally {
            setLoading(false);
        }
    };

    const roleConfig = {
        patient: {
            title: "Patient Portal Login",
            desc: "Sign in to access your digital medical records, appointments, and prescriptions",
            badge: "Patient Account",
            placeholderUser: "Username or Email",
            helperNotice: null,
            submitText: "Sign In as Patient"
        },
        doctor: {
            title: "Doctor & Staff Portal Login",
            desc: "Sign in with the credentials assigned to you by your Hospital Administrator",
            badge: "Clinical Staff Account",
            placeholderUser: "Doctor Username",
            helperNotice: (
                <div className="login-helper-callout doctor-callout">
                    <Info size={16} className="callout-icon" />
                    <div>
                        <strong>Doctor accounts are created by Hospital Administrators.</strong>
                        <span> You do not need to register. Please enter the username and password provided by your hospital admin.</span>
                    </div>
                </div>
            ),
            submitText: "Sign In as Doctor"
        },
        admin: {
            title: "Hospital Admin Portal Login",
            desc: "Sign in with the administrator credentials provisioned by the software company",
            badge: "Hospital Administrator",
            placeholderUser: "Hospital Admin Username",
            helperNotice: (
                <div className="login-helper-callout admin-callout">
                    <Building2 size={16} className="callout-icon" />
                    <div>
                        <strong>Hospital Admin accounts are provisioned by Software Company owners.</strong>
                        <span> Admins can log in here to manage hospital operations and register doctors.</span>
                    </div>
                </div>
            ),
            submitText: "Sign In as Hospital Admin"
        }
    };

    const currentConfig = roleConfig[selectedRole] || roleConfig.patient;

    return (
        <div className="login-page">
            <div className="login-container">

                {/* Role Tabs */}
                <div className="role-nav-tabs">
                    <button
                        type="button"
                        className={`role-tab-btn ${selectedRole === "patient" ? "active" : ""}`}
                        onClick={() => handleRoleChange("patient")}
                    >
                        <User size={18} />
                        <span>Patient</span>
                    </button>

                    <button
                        type="button"
                        className={`role-tab-btn ${selectedRole === "doctor" ? "active" : ""}`}
                        onClick={() => handleRoleChange("doctor")}
                    >
                        <Stethoscope size={18} />
                        <span>Doctor</span>
                    </button>

                    <button
                        type="button"
                        className={`role-tab-btn ${selectedRole === "admin" ? "active" : ""}`}
                        onClick={() => handleRoleChange("admin")}
                    >
                        <Building2 size={18} />
                        <span>Hospital Admin</span>
                    </button>
                </div>

                <div className="login-card">

                    <div className="login-header">
                        <div className="role-indicator-badge">
                            {selectedRole === "patient" && <User size={14} />}
                            {selectedRole === "doctor" && <Stethoscope size={14} />}
                            {selectedRole === "admin" && <Building2 size={14} />}
                            <span>{currentConfig.badge}</span>
                        </div>
                        <h1>{currentConfig.title}</h1>
                        <p>{currentConfig.desc}</p>
                    </div>

                    {successNotice && (
                        <div className="login-success-banner">
                            <CheckCircle2 size={18} />
                            <span>{successNotice}</span>
                        </div>
                    )}

                    {currentConfig.helperNotice}

                    {error && (
                        <div className="login-error-banner">
                            <AlertCircle size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="login-form">

                        <div className="login-form-group">
                            <label>Username</label>
                            <div className="login-input-wrapper">
                                <User size={18} className="login-field-icon" />
                                <input
                                    type="text"
                                    name="username"
                                    placeholder={currentConfig.placeholderUser}
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div className="login-form-group">
                            <label>Password</label>
                            <div className="login-input-wrapper">
                                <Lock size={18} className="login-field-icon" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                                <button
                                    type="button"
                                    className="login-eye-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="login-submit-btn" disabled={loading}>
                            {loading ? "Signing in..." : currentConfig.submitText}
                        </button>

                    </form>

                    {/* Dynamic Footer Depending on Role */}
                    <div className="login-footer">
                        {selectedRole === "patient" && (
                            <div className="footer-role-action">
                                <span>Don't have a patient account?</span>
                                <Link to="/signup" className="register-action-link">
                                    Sign Up as Patient <ArrowRight size={14} />
                                </Link>
                            </div>
                        )}

                        {selectedRole === "doctor" && (
                            <div className="footer-info-text">
                                <span>Need Doctor access? </span>
                                <strong>Contact your Hospital Administrator to provision your username and password.</strong>
                            </div>
                        )}

                        {selectedRole === "admin" && (
                            <div className="footer-info-text">
                                <span>Hospital Admin accounts are provisioned exclusively by the software company. </span>
                                <span style={{ color: "#64748b" }}>Contact platform support for credentials.</span>
                            </div>
                        )}
                    </div>

                    {/* Quick Demo Help Accordion */}
                    <div className="demo-credentials-card">
                        <div className="demo-credentials-header">
                            <Sparkles size={14} color="#f59e0b" />
                            <span>Quick Testing Credentials:</span>
                        </div>
                        <div className="demo-list">
                            <div className="demo-item">
                                <strong>Admin:</strong> <code>admin</code> / <code>AdminPass123!</code>
                            </div>
                            <div className="demo-item">
                                <strong>Doctor:</strong> <code>dr_sarah</code> / <code>password123</code>
                            </div>
                            <div className="demo-item">
                                <strong>Patient:</strong> Register new account or use <code>beti</code> / <code>password123</code>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}

export default Login;