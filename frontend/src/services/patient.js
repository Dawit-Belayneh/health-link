import api from "../utils/axios";

// 1. Patient Profile
export const getPatientProfile = async () => {
    const response = await api.get("patient/me/");
    return response.data;
};

export const updatePatientProfile = async (data) => {
    const response = await api.patch("patient/me/", data);
    return response.data;
};

// 2. Dashboard Aggregated Real-Data Summary
export const getDashboardSummary = async () => {
    const response = await api.get("patient/dashboard-summary/");
    return response.data;
};

// 3. Medical Records
export const getMedicalRecords = async () => {
    const response = await api.get("medical_record/");
    return response.data;
};

// 4. Appointments
export const getAppointments = async () => {
    const response = await api.get("appointments/");
    return response.data;
};

export const createAppointment = async (appointmentData) => {
    const response = await api.post("appointments/", appointmentData);
    return response.data;
};

export const cancelAppointment = async (id) => {
    const response = await api.patch(`appointments/${id}/`, { status: "Cancelled" });
    return response.data;
};

export const updateAppointment = async (id, data) => {
    const response = await api.patch(`appointments/${id}/`, data);
    return response.data;
};

// 5. Vitals
export const getVitals = async () => {
    const response = await api.get("vitals/");
    return response.data;
};

export const logVitals = async (vitalsData) => {
    const response = await api.post("vitals/", vitalsData);
    return response.data;
};

// 6. Notifications
export const getNotifications = async () => {
    const response = await api.get("notifications/");
    return response.data;
};

export const toggleNotificationRead = async (id, isRead) => {
    const response = await api.patch(`notifications/${id}/`, { is_read: isRead });
    return response.data;
};

export const markAllNotificationsRead = async () => {
    const response = await api.post("notifications/mark-all-read/");
    return response.data;
};

export const deleteNotification = async (id) => {
    const response = await api.delete(`notifications/${id}/`);
    return response.data;
};

export const clearAllNotifications = async () => {
    const response = await api.delete("notifications/");
    return response.data;
};

// 7. Prescriptions
export const getPrescriptions = async () => {
    const response = await api.get("prescriptions/");
    return response.data;
};

export const requestPrescriptionRefill = async (id, data = {}) => {
    const response = await api.post(`prescriptions/${id}/refill/`, data);
    return response.data;
};

// 8. Access Requests & Permissions
export const getAccessRequests = async () => {
    const response = await api.get("access-requests/");
    return response.data;
};

export const respondToAccessRequest = async (id, action) => {
    const response = await api.post(`access-requests/${id}/respond/`, { action });
    return response.data;
};

