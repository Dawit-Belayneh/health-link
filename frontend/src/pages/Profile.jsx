import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Profile.css";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Footer from "../components/Footer";

import { getPatientProfile, updatePatientProfile } from "../services/patient";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Droplets,
    Ruler,
    Weight,
    ShieldAlert,
    HeartHandshake,
    CheckCircle2,
    AlertCircle,
    ArrowLeft,
    Edit3,
    Save,
    X
} from "lucide-react";

function Profile() {
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    // Form state
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        date_of_birth: "",
        gender: "Male",
        address: "",
        blood_type: "O+",
        height: "",
        weight: "",
        allergies: "",
        emergency_contact_name: "",
        emergency_contact_relationship: "",
        emergency_contact_phone: "",
    });

    useEffect(() => {
        const token = localStorage.getItem("access");
        if (!token) {
            navigate("/login");
            return;
        }

        const fetchProfile = async () => {
            try {
                setLoading(true);
                const data = await getPatientProfile();
                setPatient(data);

                // Populate form
                setFormData({
                    first_name: data.user_details?.first_name || "",
                    last_name: data.user_details?.last_name || "",
                    email: data.user_details?.email || "",
                    phone_number: data.phone_number || "",
                    date_of_birth: data.date_of_birth || "",
                    gender: data.gender || "Male",
                    address: data.address || "",
                    blood_type: data.blood_type || "O+",
                    height: data.height || "",
                    weight: data.weight || "",
                    allergies: data.allergies || "",
                    emergency_contact_name: data.emergency_contact_name || "",
                    emergency_contact_relationship: data.emergency_contact_relationship || "",
                    emergency_contact_phone: data.emergency_contact_phone || "",
                });
            } catch (err) {
                console.error("Failed to load profile:", err);
                if (err.response && err.response.status === 401) {
                    navigate("/login");
                } else {
                    setMessage({
                        type: "error",
                        text: "Failed to load profile. Please make sure the backend is running."
                    });
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (message.text) setMessage({ type: "", text: "" });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: "", text: "" });

        try {
            const payload = {
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
                phone_number: formData.phone_number,
                date_of_birth: formData.date_of_birth || null,
                gender: formData.gender,
                address: formData.address,
                blood_type: formData.blood_type,
                height: formData.height ? parseFloat(formData.height) : null,
                weight: formData.weight ? parseFloat(formData.weight) : null,
                allergies: formData.allergies,
                emergency_contact_name: formData.emergency_contact_name,
                emergency_contact_relationship: formData.emergency_contact_relationship,
                emergency_contact_phone: formData.emergency_contact_phone,
            };

            const updated = await updatePatientProfile(payload);
            setPatient(updated);

            // Update user in localStorage if name changed
            const localUser = JSON.parse(localStorage.getItem("user") || "{}");
            if (updated.user_details) {
                localStorage.setItem("user", JSON.stringify({
                    ...localUser,
                    ...updated.user_details
                }));
            }

            setMessage({ type: "success", text: "Profile updated successfully!" });
            setIsEditing(false);
        } catch (err) {
            console.error("Save error:", err);
            setMessage({
                type: "error",
                text: "Failed to update profile. Please verify your entries."
            });
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        if (patient) {
            setFormData({
                first_name: patient.user_details?.first_name || "",
                last_name: patient.user_details?.last_name || "",
                email: patient.user_details?.email || "",
                phone_number: patient.phone_number || "",
                date_of_birth: patient.date_of_birth || "",
                gender: patient.gender || "Male",
                address: patient.address || "",
                blood_type: patient.blood_type || "O+",
                height: patient.height || "",
                weight: patient.weight || "",
                allergies: patient.allergies || "",
                emergency_contact_name: patient.emergency_contact_name || "",
                emergency_contact_relationship: patient.emergency_contact_relationship || "",
                emergency_contact_phone: patient.emergency_contact_phone || "",
            });
        }
        setIsEditing(false);
        setMessage({ type: "", text: "" });
    };

    // Calculate BMI
    let bmiValue = null;
    let bmiCategory = "";
    if (formData.height && formData.weight) {
        const hMeters = parseFloat(formData.height) / 100;
        const wKg = parseFloat(formData.weight);
        if (hMeters > 0 && wKg > 0) {
            const bmi = (wKg / (hMeters * hMeters)).toFixed(1);
            bmiValue = bmi;
            if (bmi < 18.5) bmiCategory = "Underweight";
            else if (bmi < 25) bmiCategory = "Normal Weight";
            else if (bmi < 30) bmiCategory = "Overweight";
            else bmiCategory = "Obese";
        }
    }

    const fullName = patient?.user_details?.full_name || patient?.user_details?.username || "Patient";
    const patientId = patient?.id ? `HL-2026-${String(patient.id).padStart(5, "0")}` : "HL-2026-00001";

    if (loading) {
        return (
            <div className="patient-dashboard" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
                <div style={{ textAlign: "center" }}>
                    <div style={{
                        width: "48px",
                        height: "48px",
                        border: "4px solid #e2e8f0",
                        borderTop: "4px solid #2563eb",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                        margin: "0 auto 16px"
                    }} />
                    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                    <h3 style={{ color: "#334155" }}>Loading profile...</h3>
                </div>
            </div>
        );
    }

    return (
        <div className="patient-dashboard">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <main className="dashboard-main">
                <Topbar
                    patient={patient}
                    onToggleSidebar={() => setSidebarOpen(prev => !prev)}
                />

                <div className="profile-page-container">
                    {/* Top Navigation / Breadcrumb */}
                    <div className="profile-nav-header">
                        <Link to="/patient/dashboard" className="back-btn">
                            <ArrowLeft size={18} />
                            <span>Back to Dashboard</span>
                        </Link>

                        <div className="profile-action-btns">
                            {!isEditing ? (
                                <button
                                    className="edit-profile-btn"
                                    onClick={() => setIsEditing(true)}
                                >
                                    <Edit3 size={18} />
                                    <span>Edit Profile</span>
                                </button>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        className="cancel-btn"
                                        onClick={handleCancel}
                                        disabled={saving}
                                    >
                                        <X size={18} />
                                        <span>Cancel</span>
                                    </button>
                                    <button
                                        type="button"
                                        className="save-profile-btn"
                                        onClick={handleSave}
                                        disabled={saving}
                                    >
                                        <Save size={18} />
                                        <span>{saving ? "Saving..." : "Save Changes"}</span>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Alert Message */}
                    {message.text && (
                        <div className={`profile-alert ${message.type}`}>
                            {message.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                            <span>{message.text}</span>
                        </div>
                    )}

                    {/* Profile Header Hero Card */}
                    <div className="profile-hero-card">
                        <div className="profile-hero-avatar">
                            <img
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=2563eb&color=fff&size=128`}
                                alt={fullName}
                            />
                        </div>

                        <div className="profile-hero-info">
                            <div className="hero-name-row">
                                <h2>{fullName}</h2>
                                <span className="patient-id-tag">{patientId}</span>
                            </div>

                            <p className="hero-email">
                                <Mail size={16} />
                                {formData.email || patient?.user_details?.email || "No email on record"}
                            </p>

                            <div className="hero-quick-badges">
                                <span className="badge-item">
                                    <Droplets size={16} /> Blood: {formData.blood_type || "N/A"}
                                </span>
                                <span className="badge-item">
                                    <User size={16} /> {formData.gender}
                                </span>
                                {bmiValue && (
                                    <span className="badge-item bmi">
                                        BMI: {bmiValue} ({bmiCategory})
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Profile Details Form / Sections */}
                    <form onSubmit={handleSave} className="profile-form-grid">
                        {/* 1. Personal Information */}
                        <div className="profile-section-card">
                            <div className="section-title">
                                <User size={22} className="section-icon" />
                                <h3>Personal Information</h3>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>First Name</label>
                                    <input
                                        type="text"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        placeholder="Enter first name"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Last Name</label>
                                    <input
                                        type="text"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        placeholder="Enter last name"
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        placeholder="Enter email"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input
                                        type="text"
                                        name="phone_number"
                                        value={formData.phone_number}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        placeholder="+251 900 000 000"
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Date of Birth</label>
                                    <input
                                        type="date"
                                        name="date_of_birth"
                                        value={formData.date_of_birth}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Gender</label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Home Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    placeholder="City, Sub City, House No."
                                />
                            </div>
                        </div>

                        {/* 2. Medical & Health Metrics */}
                        <div className="profile-section-card">
                            <div className="section-title">
                                <Droplets size={22} className="section-icon" />
                                <h3>Health Metrics & Vitals</h3>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Blood Type</label>
                                    <select
                                        name="blood_type"
                                        value={formData.blood_type}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                    >
                                        <option value="A+">A+</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B-">B-</option>
                                        <option value="AB+">AB+</option>
                                        <option value="AB-">AB-</option>
                                        <option value="O+">O+</option>
                                        <option value="O-">O-</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Height (cm)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        name="height"
                                        value={formData.height}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        placeholder="e.g. 178"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Weight (kg)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        name="weight"
                                        value={formData.weight}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        placeholder="e.g. 72"
                                    />
                                </div>
                            </div>

                            {bmiValue && (
                                <div className="bmi-banner">
                                    <div>
                                        <h4>Body Mass Index (BMI)</h4>
                                        <p>Calculated from your current height and weight</p>
                                    </div>
                                    <div className="bmi-score">
                                        <span className="number">{bmiValue}</span>
                                        <span className="category">{bmiCategory}</span>
                                    </div>
                                </div>
                            )}

                            <div className="form-group">
                                <label>Known Allergies</label>
                                <textarea
                                    name="allergies"
                                    rows="2"
                                    value={formData.allergies}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    placeholder="List any medication, food, or environmental allergies..."
                                />
                            </div>
                        </div>

                        {/* 3. Emergency Contact */}
                        <div className="profile-section-card full-width">
                            <div className="section-title">
                                <HeartHandshake size={22} className="section-icon" />
                                <h3>Emergency Contact Information</h3>
                            </div>

                            <div className="form-row three-col">
                                <div className="form-group">
                                    <label>Emergency Contact Name</label>
                                    <input
                                        type="text"
                                        name="emergency_contact_name"
                                        value={formData.emergency_contact_name}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        placeholder="Full name"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Relationship</label>
                                    <input
                                        type="text"
                                        name="emergency_contact_relationship"
                                        value={formData.emergency_contact_relationship}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        placeholder="e.g. Brother, Parent, Spouse"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Emergency Phone Number</label>
                                    <input
                                        type="text"
                                        name="emergency_contact_phone"
                                        value={formData.emergency_contact_phone}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        placeholder="+251 911 000 000"
                                    />
                                </div>
                            </div>
                        </div>

                        {isEditing && (
                            <div className="form-submit-footer">
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={handleCancel}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="save-profile-btn"
                                    disabled={saving}
                                >
                                    <Save size={18} />
                                    <span>{saving ? "Saving Changes..." : "Save Profile"}</span>
                                </button>
                            </div>
                        )}
                    </form>
                </div>

                <Footer />
            </main>
        </div>
    );
}

export default Profile;
