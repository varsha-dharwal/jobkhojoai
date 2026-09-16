import axios from "axios";

const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;

  if (typeof window !== "undefined" && window.location.hostname === "localhost") {
    return "http://localhost:5000/api";
  }

  return "https://jobkhojoai-backend.onrender.com/api";
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
});

// attach admin token automatically if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jobkhojoai_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
