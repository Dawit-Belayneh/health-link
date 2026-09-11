import api from "../utils/axios";

// Fetch the authenticated patient's profile (including user details)
export const getPatientProfile = async () => {
    const response = await api.get("patient/me/");
    return response.data;
};

// Fetch medical records for the authenticated patient
export const getMedicalRecords = async () => {
    const response = await api.get("medical_record/");
    return response.data;
};

// Update patient profile info (e.g. allergies, emergency contacts)
export const updatePatientProfile = async (data) => {
    const response = await api.patch("patient/me/", data);
    return response.data;
};
