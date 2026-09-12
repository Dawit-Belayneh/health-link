import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signupUser } from "../services/auth";
import {
    User,
    Mail,
    Lock,
    Phone,
    Calendar,
    Heart,
    Activity,
    ShieldCheck,
    CheckCircle2,
    ArrowRight,
    ArrowLeft,
    Hospital,
    Stethoscope,
    Eye,
    EyeOff,
    AlertCircle,
    Info,
    Pill,
    Scissors,
    FileText
} from "lucide-react";
import "./Signup.css";

const COMMON_CONDITIONS = [
    "Hypertension (High BP)",
    "Type 2 Diabetes",
    "Asthma",
    "Cardiovascular Disease",
    "Thyroid Disorder",
    "None / Healthy"
];

function Signup() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [selectedConditions, setSelectedConditions] = useState([]);
    const [successMessage, setSuccessMessage] = useState(false);

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        password: "",
        confirm_password: "",
        role: "patient",
        phone_number: "",
        date_of_birth: "",
        gender: "Male",
        address: "",
        emergency_contact_name: "",
        emergency_contact_phone: "",
        emergency_contact_relationship: "Parent",
        blood_type: "O+",
        height: "",
        weight: "",
        allergies: "",
        chronic_conditions: "",
        current_medications: "",
        past_surgeries: "",
        health_notes: ""
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

    const handleConditionToggle = (condition) => {
        let updated;
        if (condition === "None / Healthy") {
            updated = selectedConditions.includes("None / Healthy") ? [] : ["None / Healthy"];
        } else {
            updated = selectedConditions.filter(c => c !== "None / Healthy");
            if (updated.includes(condition)) {
                updated = updated.filter(c => c !== condition);
            } else {
                updated.push(condition);
            }
        }
        setSelectedConditions(updated);

        const conditionsStr = updated.join(", ");
        setFormData(prev => ({
            ...prev,
            chronic_conditions: conditionsStr
        }));
    };

    const validateStep = (currentStep) => {
        setError("");
        if (currentStep === 1) {
            if (!formData.first_name.trim() || !formData.last_name.trim()) {
                setError("Please enter your full first and last name.");
                return false;
            }
            if (!formData.username.trim()) {
                setError("Please choose a unique username.");
                return false;
            }
            if (!formData.email.trim() || !formData.email.includes("@")) {
                setError("Please provide a valid email address.");
                return false;
            }
            if (!formData.password || formData.password.length < 6) {
                setError("Password must be at least 6 characters long.");
                return false;
            }
            if (formData.password !== formData.confirm_password) {
                setError("Passwords do not match. Please verify.");
                return false;
            }
        } else if (currentStep === 2) {
            if (!formData.phone_number.trim()) {
                setError("Please enter your contact phone number.");
                return false;
            }
            if (!formData.date_of_birth) {
                setError("Please enter your date of birth.");
                return false;
            }
            if (!formData.emergency_contact_name.trim()) {
                setError("Please provide an emergency contact name.");
                return false;
            }
            if (!formData.emergency_contact_phone.trim()) {
                setError("Please provide an emergency contact phone number.");
                return false;
            }
        } else if (currentStep === 3) {
            if (!formData.blood_type) {
                setError("Please select your blood type.");
                return false;
            }
        }
        return true;
    };

    const nextStep = () => {
        if (validateStep(step)) {
            setStep(prev => prev + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const prevStep = () => {
        setError("");
        setStep(prev => prev - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateStep(3)) return;

        setLoading(true);
        setError("");

        try {
            // Prepare payload
            const payload = { ...formData };
            delete payload.confirm_password;

            if (payload.height === "") delete payload.height;
            if (payload.weight === "") delete payload.weight;

            await signupUser(payload);
            setSuccessMessage(true);
            setTimeout(() => {
                navigate("/login?registered=patient");
            }, 3000);
        } catch (err) {
            console.error("Signup error:", err.response?.data);
            if (err.response?.data) {
                const msgs = Object.entries(err.response.data)
                    .map(([k, v]) => `${k.replace('_', ' ')}: ${Array.isArray(v) ? v.join(" ") : v}`)
                    .join("\n");
                setError(msgs || "Registration failed. Please check your details.");
            } else {
                setError("Unable to reach server. Please check your backend connection.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-page">
            <div className="signup-wrapper">

                {/* Top Role Information Banner */}
                <div className="role-guidance-banner">
                    <div className="guidance-item active-guidance">
                        <div className="guidance-icon"><User size={18} /></div>
                        <div>
                            <strong>Patient Registration:</strong>
                            <span> Public self-registration with digital medical profile.</span>
                        </div>
                    </div>
                    <div className="guidance-divider"></div>
                    <div className="guidance-item">
                        <div className="guidance-icon doctor-icon"><Stethoscope size={18} /></div>
                        <div>
                            <strong>Doctors & Clinicians:</strong>
                            <span> Registered exclusively by Hospital Admins. </span>
                            <Link to="/login" className="guidance-link">Doctor Login &rarr;</Link>
                        </div>
                    </div>
                    <div className="guidance-divider"></div>
                    <div className="guidance-item">
                        <div className="guidance-icon hospital-icon"><Hospital size={18} /></div>
                        <div>
                            <strong>Hospital Admins:</strong>
                            <span> Provisioned by Software Company owners. </span>
                            <Link to="/login" className="guidance-link">Admin Login &rarr;</Link>
                        </div>
                    </div>
                </div>

                <div className="signup-card">
                    {successMessage ? (
                        <div className="signup-success-state">
                            <div className="success-icon-badge">
                                <CheckCircle2 size={54} color="#16a34a" />
                            </div>
                            <h2>Welcome to HealthLink!</h2>
                            <p>
                                Your patient account and clinical health intake profile have been created successfully.
                            </p>
                            <div className="success-redirect-note">
                                Redirecting you to the Login page in a moment...
                            </div>
                            <button
                                type="button"
                                className="continue-login-btn"
                                onClick={() => navigate("/login")}
                            >
                                Go to Login Now
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="signup-header">
                                <h1>Patient Registration</h1>
                                <p>Create your personal healthcare account & intake chart</p>
                            </div>

                            {/* Step Indicator */}
                            <div className="step-tracker">
                                <div className={`step-item ${step >= 1 ? "active" : ""}`}>
                                    <div className="step-bubble">1</div>
                                    <span>Account</span>
                                </div>
                                <div className={`step-line ${step >= 2 ? "active" : ""}`}></div>
                                <div className={`step-item ${step >= 2 ? "active" : ""}`}>
                                    <div className="step-bubble">2</div>
                                    <span>Personal & Emergency</span>
                                </div>
                                <div className={`step-line ${step >= 3 ? "active" : ""}`}></div>
                                <div className={`step-item ${step >= 3 ? "active" : ""}`}>
                                    <div className="step-bubble">3</div>
                                    <span>Medical Profile</span>
                                </div>
                            </div>

                            {error && (
                                <div className="signup-error-alert">
                                    <AlertCircle size={18} />
                                    <span>{error}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                {/* STEP 1: ACCOUNT CREDENTIALS */}
                                {step === 1 && (
                                    <div className="step-content">
                                        <div className="step-title">
                                            <ShieldCheck size={20} className="step-title-icon" />
                                            <h3>Step 1: Security & Account Details</h3>
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>First Name <span className="req">*</span></label>
                                                <input
                                                    type="text"
                                                    name="first_name"
                                                    placeholder="e.g. Abebe"
                                                    value={formData.first_name}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Last Name <span className="req">*</span></label>
                                                <input
                                                    type="text"
                                                    name="last_name"
                                                    placeholder="e.g. Kebede"
                                                    value={formData.last_name}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label>Username <span className="req">*</span></label>
                                            <div className="input-with-icon">
                                                <User size={18} className="input-icon" />
                                                <input
                                                    type="text"
                                                    name="username"
                                                    placeholder="Choose a unique username"
                                                    value={formData.username}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label>Email Address <span className="req">*</span></label>
                                            <div className="input-with-icon">
                                                <Mail size={18} className="input-icon" />
                                                <input
                                                    type="email"
                                                    name="email"
                                                    placeholder="name@example.com"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Password <span className="req">*</span></label>
                                                <div className="input-with-icon">
                                                    <Lock size={18} className="input-icon" />
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        name="password"
                                                        placeholder="At least 6 characters"
                                                        value={formData.password}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                    <button
                                                        type="button"
                                                        className="toggle-password"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                    >
                                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label>Confirm Password <span className="req">*</span></label>
                                                <div className="input-with-icon">
                                                    <Lock size={18} className="input-icon" />
                                                    <input
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        name="confirm_password"
                                                        placeholder="Re-enter password"
                                                        value={formData.confirm_password}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                    <button
                                                        type="button"
                                                        className="toggle-password"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    >
                                                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="step-actions">
                                            <div></div>
                                            <button type="button" className="btn-next" onClick={nextStep}>
                                                Next: Personal & Emergency <ArrowRight size={18} />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* STEP 2: DEMOGRAPHICS & EMERGENCY CONTACT */}
                                {step === 2 && (
                                    <div className="step-content">
                                        <div className="step-title">
                                            <Phone size={20} className="step-title-icon" />
                                            <h3>Step 2: Demographics & Emergency Contact</h3>
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Phone Number <span className="req">*</span></label>
                                                <div className="input-with-icon">
                                                    <Phone size={18} className="input-icon" />
                                                    <input
                                                        type="tel"
                                                        name="phone_number"
                                                        placeholder="+251 911 234 567"
                                                        value={formData.phone_number}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label>Date of Birth <span className="req">*</span></label>
                                                <div className="input-with-icon">
                                                    <Calendar size={18} className="input-icon" />
                                                    <input
                                                        type="date"
                                                        name="date_of_birth"
                                                        value={formData.date_of_birth}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Gender <span className="req">*</span></label>
                                                <select
                                                    name="gender"
                                                    value={formData.gender}
                                                    onChange={handleChange}
                                                >
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                </select>
                                            </div>

                                            <div className="form-group">
                                                <label>Residential Address</label>
                                                <input
                                                    type="text"
                                                    name="address"
                                                    placeholder="Sub-city, House No, City"
                                                    value={formData.address}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>

                                        <div className="sub-section-divider">
                                            <span>Emergency Contact Details</span>
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Emergency Contact Name <span className="req">*</span></label>
                                                <input
                                                    type="text"
                                                    name="emergency_contact_name"
                                                    placeholder="Full name of contact"
                                                    value={formData.emergency_contact_name}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>Relationship <span className="req">*</span></label>
                                                <select
                                                    name="emergency_contact_relationship"
                                                    value={formData.emergency_contact_relationship}
                                                    onChange={handleChange}
                                                >
                                                    <option value="Parent">Parent</option>
                                                    <option value="Spouse">Spouse</option>
                                                    <option value="Sibling">Sibling</option>
                                                    <option value="Child">Child</option>
                                                    <option value="Relative">Relative</option>
                                                    <option value="Friend">Friend</option>
                                                    <option value="Guardian">Guardian</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label>Emergency Contact Phone <span className="req">*</span></label>
                                            <div className="input-with-icon">
                                                <Phone size={18} className="input-icon" />
                                                <input
                                                    type="tel"
                                                    name="emergency_contact_phone"
                                                    placeholder="+251 912 345 678"
                                                    value={formData.emergency_contact_phone}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="step-actions">
                                            <button type="button" className="btn-prev" onClick={prevStep}>
                                                <ArrowLeft size={18} /> Back
                                            </button>
                                            <button type="button" className="btn-next" onClick={nextStep}>
                                                Next: Medical Profile <ArrowRight size={18} />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* STEP 3: MEDICAL PROFILE & HEALTH QUESTIONNAIRE */}
                                {step === 3 && (
                                    <div className="step-content">
                                        <div className="step-title">
                                            <Heart size={20} className="step-title-icon heart-icon" />
                                            <h3>Step 3: Medical Profile & Health Questions</h3>
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Blood Type <span className="req">*</span></label>
                                                <select
                                                    name="blood_type"
                                                    value={formData.blood_type}
                                                    onChange={handleChange}
                                                    required
                                                    className="blood-select"
                                                >
                                                    <option value="A+">A+ (A Positive)</option>
                                                    <option value="A-">A- (A Negative)</option>
                                                    <option value="B+">B+ (B Positive)</option>
                                                    <option value="B-">B- (B Negative)</option>
                                                    <option value="AB+">AB+ (AB Positive)</option>
                                                    <option value="AB-">AB- (AB Negative)</option>
                                                    <option value="O+">O+ (O Positive)</option>
                                                    <option value="O-">O- (O Negative)</option>
                                                </select>
                                            </div>

                                            <div className="form-group">
                                                <label>Height (cm)</label>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    name="height"
                                                    placeholder="e.g. 175"
                                                    value={formData.height}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>Weight (kg)</label>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    name="weight"
                                                    placeholder="e.g. 70"
                                                    value={formData.weight}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>

                                        {/* QUESTION 1: ALLERGIES */}
                                        <div className="question-card">
                                            <label className="question-label">
                                                <Activity size={18} className="q-icon" />
                                                <strong>Question 1: Known Allergies</strong>
                                                <span className="q-hint">Do you have allergies to medications, foods, or materials?</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="allergies"
                                                placeholder="e.g. Penicillin, Peanuts, Pollen, Latex (or type 'None')"
                                                value={formData.allergies}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        {/* QUESTION 2: CHRONIC CONDITIONS */}
                                        <div className="question-card">
                                            <label className="question-label">
                                                <Heart size={18} className="q-icon" />
                                                <strong>Question 2: Chronic Health Conditions</strong>
                                                <span className="q-hint">Select any pre-existing or chronic health conditions that apply:</span>
                                            </label>
                                            <div className="condition-chips">
                                                {COMMON_CONDITIONS.map((cond) => {
                                                    const isSelected = selectedConditions.includes(cond);
                                                    return (
                                                        <button
                                                            key={cond}
                                                            type="button"
                                                            className={`chip-btn ${isSelected ? "selected" : ""}`}
                                                            onClick={() => handleConditionToggle(cond)}
                                                        >
                                                            {isSelected && <CheckCircle2 size={14} style={{ marginRight: 4 }} />}
                                                            {cond}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            <input
                                                type="text"
                                                name="chronic_conditions"
                                                placeholder="Other chronic conditions or details (optional)"
                                                value={formData.chronic_conditions}
                                                onChange={handleChange}
                                                style={{ marginTop: "8px" }}
                                            />
                                        </div>

                                        {/* QUESTION 3: MEDICATIONS */}
                                        <div className="question-card">
                                            <label className="question-label">
                                                <Pill size={18} className="q-icon" />
                                                <strong>Question 3: Current Regular Medications</strong>
                                                <span className="q-hint">Are you currently taking any prescription medications or regular supplements?</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="current_medications"
                                                placeholder="e.g. Metformin 500mg, Lisinopril 10mg (or type 'None')"
                                                value={formData.current_medications}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        {/* QUESTION 4: SURGERIES */}
                                        <div className="question-card">
                                            <label className="question-label">
                                                <Scissors size={18} className="q-icon" />
                                                <strong>Question 4: Past Surgeries & Major Procedures</strong>
                                                <span className="q-hint">Have you undergone any major surgeries or hospital admissions?</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="past_surgeries"
                                                placeholder="e.g. Appendectomy in 2021 (or type 'None')"
                                                value={formData.past_surgeries}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        {/* QUESTION 5: ADDITIONAL NOTES */}
                                        <div className="question-card">
                                            <label className="question-label">
                                                <FileText size={18} className="q-icon" />
                                                <strong>Question 5: Additional Health Notes for Clinicians</strong>
                                                <span className="q-hint">Any dietary restrictions, physical limitations, or general medical notes:</span>
                                            </label>
                                            <textarea
                                                rows="2"
                                                name="health_notes"
                                                placeholder="Additional medical notes (optional)"
                                                value={formData.health_notes}
                                                onChange={handleChange}
                                                className="notes-textarea"
                                            ></textarea>
                                        </div>

                                        <div className="step-actions">
                                            <button type="button" className="btn-prev" onClick={prevStep} disabled={loading}>
                                                <ArrowLeft size={18} /> Back
                                            </button>
                                            <button type="submit" className="btn-submit" disabled={loading}>
                                                {loading ? "Registering Account..." : "Complete Registration"}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </form>

                            <p className="signup-footer-link">
                                Already have an account?{" "}
                                <Link to="/login">
                                    Log In Here
                                </Link>
                            </p>
                        </>
                    )}
                </div>

            </div>
        </div>
    );
}

export default Signup;