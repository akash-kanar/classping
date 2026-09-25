import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("classping_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Only force JSON when we're not sending FormData (file uploads).
    // For FormData, let the browser/axios set the multipart boundary itself.
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;