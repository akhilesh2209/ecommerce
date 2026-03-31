import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Attach JWT automatically when available (client-side).
API.interceptors.request.use((config) => {
  if (typeof window === "undefined") return config;
  const token = window.localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    // Express receives headers in lowercase, but keep standard casing here.
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;