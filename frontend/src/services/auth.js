import api from "../utils/axios";

export const loginUser = async (data) => {

    const response = await api.post(
        "login/",
        data
    );

    return response.data;

};


export const signupUser = async (data) => {
    const response = await api.post("signup/", data);
    return response.data;
};

export const getUserProfile = async () => {
    const response = await api.get("user/me/");
    return response.data;
};

export const updateUserProfile = async (userData) => {
    const response = await api.patch("user/me/", userData);
    return response.data;
};