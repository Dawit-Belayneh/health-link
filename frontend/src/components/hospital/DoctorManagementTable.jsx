import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import "./DoctorManagementTable.css";
import {
  Search,
  UserRoundPlus,
  Eye,
  SquarePen,
  Trash2,
  Mail,
  Phone,
  Stethoscope,
  X,
  CheckCircle2,
  AlertCircle,
  Building,
  Award,
  Calendar
} from "lucide-react";
import { getHospitalDoctors, createDoctorAccount, deleteDoctor, updateDoctor } from "../../services/hospital";

function DoctorManagementTable() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewDoctorModal, setViewDoctorModal] = useState(null);
  const [editDoctorModal, setEditDoctorModal] = useState(null);
  const [editFormData, setEditFormData] = useState({
    specialization: "General Medicine",
    license_number: "",
    years_of_experience: 3
  });
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [formSubmitting, setFormSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    specialization: "General Medicine",
    license_number: "",
    years_of_experience: 3,
    role: "doctor"
  });

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const data = await getHospitalDoctors();
      setDoctors(Array.isArray(data) ? data : (data.results || []));
    } catch (err) {
      console.error("Failed to load hospital doctors:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (showAddModal || viewDoctorModal || editDoctorModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showAddModal, viewDoctorModal, editDoctorModal]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErrorMessage("");
  };

  const handleAddDoctorSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setErrorMessage("");

    try {
      await createDoctorAccount(formData);
      setToastMessage(`Dr. ${formData.first_name} ${formData.last_name} account created successfully!`);
      setTimeout(() => setToastMessage(""), 5000);
      setShowAddModal(false);
      setFormData({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        password: "",
        specialization: "General Medicine",
        license_number: "",
        years_of_experience: 3,
        role: "doctor"
      });
      await fetchDoctors();
    } catch (err) {
      console.error("Create doctor error:", err);
      if (err.response && err.response.data) {
        const msgs = Object.entries(err.response.data)
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(" ") : v}`)
          .join("\n");
        setErrorMessage(msgs || "Failed to create doctor account.");
      } else {
        setErrorMessage("Network error. Unable to create doctor account.");
      }
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteDoctor = async (doctorId, doctorName) => {
    if (window.confirm(`Are you sure you want to remove ${doctorName} from the hospital system?`)) {
      try {
        await deleteDoctor(doctorId);
        setDoctors(prev => prev.filter(d => d.id !== doctorId));
        setToastMessage(`${doctorName} has been removed.`);
        setTimeout(() => setToastMessage(""), 4000);
      } catch (err) {
        console.error("Delete doctor failed:", err);
        alert("Failed to delete doctor.");
      }
    }
  };

  const handleOpenEdit = (doctor) => {
    setEditDoctorModal(doctor);
    setEditFormData({
      specialization: doctor.specialization || "General Medicine",
      license_number: doctor.license_number || "",
      years_of_experience: doctor.years_of_experience || 0
    });
    setEditError("");
  };

  const handleEditDoctorSubmit = async (e) => {
    e.preventDefault();
    if (!editDoctorModal) return;
    setEditSubmitting(true);
    setEditError("");

    try {
      await updateDoctor(editDoctorModal.id, editFormData);
      setToastMessage(`Dr. ${editDoctorModal.user_details?.full_name || editDoctorModal.user_details?.username} profile updated successfully!`);
      setTimeout(() => setToastMessage(""), 4000);
      setEditDoctorModal(null);
      await fetchDoctors();
    } catch (err) {
      console.error("Update doctor error:", err);
      setEditError(err.response?.data?.detail || "Failed to update doctor details.");
    } finally {
      setEditSubmitting(false);
    }
  };

  const filteredDoctors = doctors.filter((doc) => {
    const name = doc.user_details?.full_name || doc.user_details?.username || "";
    const email = doc.user_details?.email || "";
    const spec = doc.specialization || "";
    const lic = doc.license_number || "";
    const query = searchTerm.toLowerCase();

    return (
      name.toLowerCase().includes(query) ||
      email.toLowerCase().includes(query) ||
      spec.toLowerCase().includes(query) ||
      lic.toLowerCase().includes(query)
    );
  });

  return (
    <section className="doctor-management">
      <div className="doctor-header">
        <div>
          <h2>Doctor & Staff Management</h2>
          <p>Create and manage authorized medical doctors in your hospital</p>
        </div>

        <div className="doctor-tools">
          <div className="doctor-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search doctor or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button className="add-btn" onClick={() => setShowAddModal(true)}>
            <UserRoundPlus size={18} />
            Add Doctor
          </button>
        </div>
      </div>

      {toastMessage && (
        <div style={{
          padding: "12px 16px",
          backgroundColor: "#dcfce7",
          color: "#15803d",
          border: "1px solid #bbf7d0",
          borderRadius: "10px",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}>
          <CheckCircle2 size={20} />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Doctor</th>
              <th>Specialization</th>
              <th>Email</th>
              <th>License No.</th>
              <th>Experience</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                  Loading doctor directory...
                </td>
              </tr>
            ) : filteredDoctors.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                  {searchTerm ? "No doctors match your search query." : "No doctors registered yet. Click 'Add Doctor' to create an account."}
                </td>
              </tr>
            ) : (
              filteredDoctors.map((doctor) => {
                const docName = doctor.user_details?.full_name || `Dr. ${doctor.user_details?.username || "Doctor"}`;
                const docEmail = doctor.user_details?.email || `${doctor.user_details?.username}@healthlink.et`;
                
                return (
                  <tr key={doctor.id}>
                    <td>
                      <div className="doctor-info">
                        <div className="doctor-avatar">
                          <Stethoscope size={22} />
                        </div>
                        <div>
                          <strong>{docName}</strong>
                          <div style={{ fontSize: "0.78rem", color: "#64748b" }}>
                            @{doctor.user_details?.username}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span style={{ fontWeight: "500", color: "#1e293b" }}>
                        {doctor.specialization || "General Medicine"}
                      </span>
                    </td>

                    <td>
                      <div className="icon-text">
                        <Mail size={15} />
                        {docEmail}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontFamily: "monospace", fontSize: "0.85rem", color: "#475569" }}>
                        {doctor.license_number || "—"}
                      </div>
                    </td>

                    <td>
                      <span>{doctor.years_of_experience || 0} Years</span>
                    </td>

                    <td>
                      <span className="status active">Active</span>
                    </td>

                    <td>
                      <div className="actions">
                        <button
                          className="view"
                          title="View Doctor Details"
                          onClick={() => setViewDoctorModal(doctor)}
                        >
                          <Eye size={17} />
                        </button>

                        <button
                          className="edit"
                          title="Edit Doctor Details"
                          onClick={() => handleOpenEdit(doctor)}
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "8px",
                            border: "1px solid #bbf7d0",
                            background: "#f0fdf4",
                            color: "#16a34a",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          <SquarePen size={17} />
                        </button>

                        <button
                          className="delete"
                          title="Remove Doctor"
                          onClick={() => handleDeleteDoctor(doctor.id, docName)}
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* --- ADD DOCTOR MODAL --- */}
      {showAddModal && createPortal(
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(15, 23, 42, 0.6)",
          backdropFilter: "blur(4px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 99999,
          padding: "20px"
        }}>
          <div style={{
            background: "#ffffff",
            borderRadius: "16px",
            width: "100%",
            maxWidth: "580px",
            maxHeight: "90vh",
            overflowY: "auto",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            padding: "28px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "#eff6ff", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <UserRoundPlus size={24} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.25rem", color: "#0f172a" }}>Add Hospital Doctor</h3>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>Provision login credentials and clinical details</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}
              >
                <X size={20} />
              </button>
            </div>

            {errorMessage && (
              <div style={{
                padding: "10px 14px",
                backgroundColor: "#fef2f2",
                color: "#b91c1c",
                border: "1px solid #fecaca",
                borderRadius: "8px",
                fontSize: "0.85rem",
                marginBottom: "16px",
                whiteSpace: "pre-line"
              }}>
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleAddDoctorSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>First Name *</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    placeholder="e.g. Sarah"
                    required
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.9rem", boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>Last Name *</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    placeholder="e.g. Johnson"
                    required
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.9rem", boxSizing: "border-box" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>Username *</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="e.g. dr_johnson"
                    required
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.9rem", boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="e.g. sarah.j@healthlink.et"
                    required
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.9rem", boxSizing: "border-box" }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>Temporary Password * (Doctor will use this to log in)</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Min 6 characters"
                  required
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.9rem", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>Department / Specialization *</label>
                  <select
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.9rem", boxSizing: "border-box", background: "#fff" }}
                  >
                    <option value="Cardiology">Cardiology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="General Medicine">General Medicine</option>
                    <option value="Pulmonology">Pulmonology</option>
                    <option value="Internal Medicine">Internal Medicine</option>
                    <option value="Obstetrics & Gynecology">Obstetrics & Gynecology</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>Medical License Number *</label>
                  <input
                    type="text"
                    name="license_number"
                    value={formData.license_number}
                    onChange={handleInputChange}
                    placeholder="e.g. MED-ET-2026-0412"
                    required
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.9rem", boxSizing: "border-box" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "22px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>Years of Experience</label>
                  <input
                    type="number"
                    name="years_of_experience"
                    value={formData.years_of_experience}
                    onChange={handleInputChange}
                    min="0"
                    max="50"
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.9rem", boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>Role Designation</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.9rem", boxSizing: "border-box", background: "#fff" }}
                  >
                    <option value="doctor">Medical Doctor (Physician)</option>
                    <option value="hospital_staff">Clinical Specialist / Staff</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    padding: "10px 18px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    background: "#f8fafc",
                    color: "#475569",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  style={{
                    padding: "10px 22px",
                    borderRadius: "8px",
                    border: "none",
                    background: "#2563eb",
                    color: "#ffffff",
                    fontWeight: "600",
                    cursor: formSubmitting ? "not-allowed" : "pointer"
                  }}
                >
                  {formSubmitting ? "Creating Account..." : "Create Doctor Account"}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* --- VIEW DOCTOR MODAL --- */}
      {viewDoctorModal && createPortal(
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(15, 23, 42, 0.6)",
          backdropFilter: "blur(4px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 99999,
          padding: "20px"
        }}>
          <div style={{
            background: "#ffffff",
            borderRadius: "16px",
            width: "100%",
            maxWidth: "480px",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
            padding: "24px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ margin: 0, color: "#0f172a" }}>Doctor Profile</h3>
              <button onClick={() => setViewDoctorModal(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ textAlign: "center", padding: "16px 0", borderBottom: "1px solid #f1f5f9" }}>
              <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#eff6ff", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                <Stethoscope size={32} />
              </div>
              <h4 style={{ margin: "0 0 4px", fontSize: "1.15rem", color: "#0f172a" }}>
                {viewDoctorModal.user_details?.full_name || `Dr. ${viewDoctorModal.user_details?.username}`}
              </h4>
              <p style={{ margin: 0, color: "#2563eb", fontWeight: "600" }}>{viewDoctorModal.specialization}</p>
            </div>

            <div style={{ padding: "16px 0", display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.9rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748b" }}>Username:</span>
                <strong style={{ color: "#0f172a" }}>@{viewDoctorModal.user_details?.username}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748b" }}>Email:</span>
                <strong style={{ color: "#0f172a" }}>{viewDoctorModal.user_details?.email}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748b" }}>Medical License:</span>
                <strong style={{ color: "#0f172a", fontFamily: "monospace" }}>{viewDoctorModal.license_number}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748b" }}>Experience:</span>
                <strong style={{ color: "#0f172a" }}>{viewDoctorModal.years_of_experience} Years</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748b" }}>Hospital:</span>
                <strong style={{ color: "#0f172a" }}>{viewDoctorModal.hospital_details?.name || "HealthLink Central Hospital"}</strong>
              </div>
            </div>

            <button
              onClick={() => setViewDoctorModal(null)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                background: "#f8fafc",
                fontWeight: "600",
                cursor: "pointer",
                marginTop: "12px"
              }}
            >
              Close
            </button>
          </div>
        </div>,
        document.body
      )}

      {/* --- EDIT DOCTOR MODAL --- */}
      {editDoctorModal && createPortal(
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(15, 23, 42, 0.6)",
          backdropFilter: "blur(4px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 99999,
          padding: "20px"
        }}>
          <div style={{
            background: "#ffffff",
            borderRadius: "16px",
            width: "100%",
            maxWidth: "520px",
            maxHeight: "90vh",
            overflowY: "auto",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
            padding: "26px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "#f0fdf4", color: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <SquarePen size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, color: "#0f172a" }}>Edit Doctor Profile</h3>
                  <p style={{ margin: 0, color: "#64748b", fontSize: "0.85rem" }}>
                    {editDoctorModal.user_details?.full_name || `@${editDoctorModal.user_details?.username}`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditDoctorModal(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}
              >
                <X size={20} />
              </button>
            </div>

            {editError && (
              <div style={{
                padding: "10px 14px",
                backgroundColor: "#fef2f2",
                color: "#b91c1c",
                border: "1px solid #fecaca",
                borderRadius: "8px",
                fontSize: "0.85rem",
                marginBottom: "16px"
              }}>
                {editError}
              </div>
            )}

            <form onSubmit={handleEditDoctorSubmit}>
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
                  Specialization / Department *
                </label>
                <select
                  value={editFormData.specialization}
                  onChange={(e) => setEditFormData({ ...editFormData, specialization: e.target.value })}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.9rem", boxSizing: "border-box", background: "#fff" }}
                >
                  <option value="Cardiology">Cardiology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Dermatology">Dermatology</option>
                  <option value="General Medicine">General Medicine</option>
                  <option value="Pulmonology">Pulmonology</option>
                  <option value="Internal Medicine">Internal Medicine</option>
                  <option value="Obstetrics & Gynecology">Obstetrics & Gynecology</option>
                </select>
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
                  Medical License Number *
                </label>
                <input
                  type="text"
                  value={editFormData.license_number}
                  onChange={(e) => setEditFormData({ ...editFormData, license_number: e.target.value })}
                  required
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.9rem", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
                  Years of Experience
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={editFormData.years_of_experience}
                  onChange={(e) => setEditFormData({ ...editFormData, years_of_experience: parseInt(e.target.value) || 0 })}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.9rem", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setEditDoctorModal(null)}
                  style={{
                    padding: "10px 16px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    background: "#f8fafc",
                    color: "#475569",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editSubmitting}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "8px",
                    border: "none",
                    background: "#16a34a",
                    color: "#ffffff",
                    fontWeight: "600",
                    cursor: editSubmitting ? "not-allowed" : "pointer"
                  }}
                >
                  {editSubmitting ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}

export default DoctorManagementTable;