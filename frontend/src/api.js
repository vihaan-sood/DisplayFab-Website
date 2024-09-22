import axios from "axios";
import { ACCESS_TOKEN } from "./constants";


console.log("API Base URL:", process.env.VITE_BASE_URL);
const api = axios.create({
    baseURL: process.env.VITE_BASE_URL
});


api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        // console.log(token);
        if (token && config.requiresAuth) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        // console.log("Request Headers:", config.headers);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
