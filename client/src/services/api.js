import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Add authentication token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("toyland_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Prevent browser caching API responses
    config.headers["Cache-Control"] = "no-cache";
    config.headers["Pragma"] = "no-cache";

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;