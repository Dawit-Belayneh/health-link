import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api/",
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach JWT access token to every request if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle 401 responses (e.g. expired tokens)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401) {
            // If refresh token exists, we could attempt refresh, or clear and redirect
            const refreshToken = localStorage.getItem("refresh");
            if (refreshToken && !error.config._retry) {
                error.config._retry = true;
                try {
                    const res = await axios.post("http://127.0.0.1:8000/api/refresh/", {
                        refresh: refreshToken,
                    });
                    if (res.data.access) {
                        localStorage.setItem("access", res.data.access);
                        error.config.headers.Authorization = `Bearer ${res.data.access}`;
                        return api(error.config);
                    }
                } catch (refreshErr) {
                    localStorage.removeItem("access");
                    localStorage.removeItem("refresh");
                    localStorage.removeItem("user");
                }
            } else {
                localStorage.removeItem("access");
                localStorage.removeItem("refresh");
                localStorage.removeItem("user");
            }
        }
        return Promise.reject(error);
    }
);

export default api;