import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signupUser } from "../services/auth";
import "./Signup.css";

function Signup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        password: "",
        role: "patient",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        if (error) setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await signupUser(formData);
            console.log("Signup Success", response);
            alert("Account created successfully! Please log in.");
            navigate("/login");
        } catch (err) {
            console.error("Signup error:", err.response?.data);
            if (err.response?.data) {
                const msgs = Object.entries(err.response.data)
                    .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(" ") : v}`)
                    .join("\n");
                setError(msgs || "Registration failed. Please check your details.");
            } else {
                setError("Unable to reach server. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-page">

            <form className="signup-card" onSubmit={handleSubmit}>

                <h1>Create Account</h1>

                <p>Join HealthLink Today</p>

                <input
                    type="text"
                    name="first_name"
                    placeholder="First Name"
                    value={formData.first_name}
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="last_name"
                    placeholder="Last Name"
                    value={formData.last_name}
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Creating Account..." : "Create Account"}
                </button>

                {error && (
                    <div style={{
                        marginTop: "16px",
                        padding: "10px 14px",
                        backgroundColor: "#fee2e2",
                        color: "#b91c1c",
                        borderRadius: "8px",
                        fontSize: "0.85rem",
                        textAlign: "center",
                        whiteSpace: "pre-line"
                    }}>
                        {error}
                    </div>
                )}

                <p style={{ marginTop: "16px", fontSize: "0.9rem", textAlign: "center", color: "#64748b" }}>
                    Already have an account?{" "}
                    <Link to="/login" style={{ color: "#2563eb", fontWeight: "600", textDecoration: "none" }}>
                        Log In
                    </Link>
                </p>

            </form>

        </div>
    );
}

export default Signup;