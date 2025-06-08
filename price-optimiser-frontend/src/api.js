import axios from "axios";
import CONFIG from "./config";

const api = axios.create({
  baseURL: CONFIG.API_BASE,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default api;
