import { useState } from "react";
import "./Login.css";
import { loginUser } from "../services/auth";

function Login(){

    const [formData,setFormData]=useState({

        username:"",
        password:""

    });

    const handleChange=(e)=>{

        setFormData({

            ...formData,

            [e.target.name]:e.target.value

        });

    };

    const handleSubmit=async(e)=>{

        e.preventDefault();

        try{

            const data=await loginUser(formData);

            localStorage.setItem("access", data.access);
            localStorage.setItem("refresh", data.refresh);

            console.log("Login successful!");
            console.log(data);

        }

        catch (error) {
            console.log("Full Error:", error);

            if (error.response) {
                console.log("Status:", error.response.status);
                console.log("Data:", error.response.data);
            } else {
                console.log("Message:", error.message);
            }
        }

    };

    return(

        <div className="login-page">

            <form
                className="login-card"
                onSubmit={handleSubmit}
            >

                <h1>Welcome Back</h1>

                <p>Login to your HealthLink account</p>

                <input

                    type="text"

                    name="username"

                    placeholder="Username"

                    onChange={handleChange}

                />

                <input

                    type="password"

                    name="password"

                    placeholder="Password"

                    onChange={handleChange}

                />

                <button>

                    Login

                </button>

            </form>

        </div>

    );

}

export default Login;