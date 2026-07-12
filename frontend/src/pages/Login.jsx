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

            console.log(data);

        }

        catch(error){

            console.log(error.response.data);

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