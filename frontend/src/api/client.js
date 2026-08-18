import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// attach admin token automatically if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jobkhojoai_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
