import { useState } from "react";
import { signupUser } from "../services/auth";
import "./Signup.css";

function Signup() {

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        password: "",
        role: "patient",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const response = await signupUser(formData);

            console.log("Signup Success");
            console.log(response);

            alert("Account created successfully!");

        } catch (error) {

            console.log(error.response?.data);

            alert("Signup Failed");

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

                <button type="submit">
                    Create Account
                </button>

            </form>

        </div>
    );
}

export default Signup;