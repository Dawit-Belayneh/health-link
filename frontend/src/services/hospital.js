import api from '../utils/axios';

// 1. Get all doctors in hospital
export const getHospitalDoctors = async () => {
    const response = await api.get('hospital/doctors/');
    return response.data;
};

// 2. Hospital Admin provisions/creates new Doctor account
export const createDoctorAccount = async (doctorData) => {
    const response = await api.post('hospital/doctors/', doctorData);
    return response.data;
};

// 3. Get hospital directory
export const getHospitalsList = async () => {
    const response = await api.get('hospital/');
    return response.data;
};

// 4. Delete/Deactivate Doctor
export const deleteDoctor = async (doctorId) => {
    const response = await api.delete(`hospital/doctors/${doctorId}/`);
    return response.data;
};

// 5. Update Doctor Employee details
export const updateDoctor = async (doctorId, doctorData) => {
    const response = await api.patch(`hospital/doctors/${doctorId}/`, doctorData);
    return response.data;
};

