import api from '../utils/axios';

// 1. Doctor Dashboard summary
export const getDoctorDashboardSummary = async () => {
    const response = await api.get('doctor/dashboard-summary/');
    return response.data;
};

// 2. Doctor Patient Directory (supports 'my_patients' vs 'all')
export const getDoctorPatients = async (search = '', filter = 'my_patients') => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (filter) params.append('filter', filter);
    const response = await api.get(`doctor/patients/?${params.toString()}`);
    return response.data;
};

// 3. Patient Full Health Data (Protected by permission check)
export const getPatientHealthData = async (patientId) => {
    const response = await api.get(`doctor/patients/${patientId}/`);
    return response.data;
};

// 4. Send Access Permission Request to a Patient
export const sendAccessRequest = async (patientId, notes = '') => {
    const response = await api.post('access-requests/', {
        patient_id: patientId,
        notes: notes || 'Clinical consultation and patient health tracking.'
    });
    return response.data;
};

// 4b. Request Emergency Clinical Access verified via Patient Emergency Contact
export const requestEmergencyAccess = async (patientId, emergencyReason, contactName, contactPhone) => {
    const response = await api.post('access-requests/emergency-grant/', {
        patient_id: patientId,
        emergency_reason: emergencyReason,
        emergency_contact_name: contactName,
        emergency_contact_phone: contactPhone
    });
    return response.data;
};


// 5. Get Doctor Access Requests
export const getDoctorAccessRequests = async () => {
    const response = await api.get('access-requests/');
    return response.data;
};

// 6. Record Medical Record / Consultation
export const createDoctorMedicalRecord = async (recordData) => {
    const response = await api.post('medical_record/', recordData);
    return response.data;
};

// 7. Write Prescription
export const createDoctorPrescription = async (prescriptionData) => {
    const response = await api.post('prescriptions/', prescriptionData);
    return response.data;
};

// 8. Doctor Appointments
export const getDoctorAppointments = async () => {
    const response = await api.get('appointments/');
    return response.data;
};

// 9. Doctor Profile (Doctor's own credentials, not patient)
export const getDoctorProfile = async () => {
    const response = await api.get('doctor/me/');
    return response.data;
};

export const updateDoctorProfile = async (profileData) => {
    const response = await api.patch('doctor/me/', profileData);
    return response.data;
};
