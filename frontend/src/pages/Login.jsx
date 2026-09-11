import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";
import { loginUser } from "../services/auth";

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

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

            // Redirect directly to Patient Dashboard (or role-specific dashboard)
            if (data.user && data.user.role === "hospital_staff") {
                navigate("/doctor/dashboard");
            } else if (data.user && data.user.role === "admin") {
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
                setError("Unable to connect to server. Please check your backend.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <form className="login-card" onSubmit={handleSubmit}>
                <h1>Welcome Back</h1>
                <p>Login to your HealthLink account</p>

                {error && (
                    <div style={{
                        padding: "10px 14px",
                        marginBottom: "16px",
                        borderRadius: "8px",
                        backgroundColor: "#fee2e2",
                        color: "#b91c1c",
                        fontSize: "0.9rem",
                        border: "1px solid #fca5a5",
                        textAlign: "center"
                    }}>
                        {error}
                    </div>
                )}

                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>

                <p style={{ marginTop: "16px", fontSize: "0.9rem", textAlign: "center", color: "#64748b" }}>
                    Don't have an account?{" "}
                    <Link to="/signup" style={{ color: "#2563eb", fontWeight: "600", textDecoration: "none" }}>
                        Sign Up
                    </Link>
                </p>
            </form>
        </div>
    );
}

export default Login;