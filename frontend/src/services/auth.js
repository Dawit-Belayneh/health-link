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