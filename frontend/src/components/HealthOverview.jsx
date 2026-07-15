import "./HealthOverview.css";
import {
    Phone,
    Mail,
    Droplets,
    Ruler,
    Weight,
    Cake,
    UserRound,
    ShieldCheck,
    TriangleAlert
} from "lucide-react";

function HealthOverview() {

    return (

        <section className="health-overview">

            <div className="profile-header">

                <img
                    src="https://i.pravatar.cc/150?img=15"
                    alt="Patient"
                />

                <div>

                    <h2>Dawit Belayneh</h2>

                    <p>Patient ID : HL-2026-00154</p>

                    <span className="status">
                        <ShieldCheck size={16}/>
                        Healthy
                    </span>

                </div>

            </div>

            <div className="info-grid">

                <div className="info-card">

                    <Droplets size={22}/>

                    <div>

                        <h4>Blood Type</h4>

                        <p>O+</p>

                    </div>

                </div>

                <div className="info-card">

                    <Cake size={22}/>

                    <div>

                        <h4>Age</h4>

                        <p>23 Years</p>

                    </div>

                </div>

                <div className="info-card">

                    <UserRound size={22}/>

                    <div>

                        <h4>Gender</h4>

                        <p>Male</p>

                    </div>

                </div>

                <div className="info-card">

                    <Ruler size={22}/>

                    <div>

                        <h4>Height</h4>

                        <p>178 cm</p>

                    </div>

                </div>

                <div className="info-card">

                    <Weight size={22}/>

                    <div>

                        <h4>Weight</h4>

                        <p>72 kg</p>

                    </div>

                </div>

                <div className="info-card">

                    <Phone size={22}/>

                    <div>

                        <h4>Phone</h4>

                        <p>+251 900 000 000</p>

                    </div>

                </div>

                <div className="info-card">

                    <Mail size={22}/>

                    <div>

                        <h4>Email</h4>

                        <p>dawit@gmail.com</p>

                    </div>

                </div>

                <div className="info-card allergy">

                    <TriangleAlert size={22}/>

                    <div>

                        <h4>Allergies</h4>

                        <p>Penicillin</p>

                    </div>

                </div>

            </div>

        </section>

    );

}

export default HealthOverview;