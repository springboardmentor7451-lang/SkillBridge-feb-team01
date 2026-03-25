import axios from "axios";

export const API_URL = "http://127.0.0.1:5000/api";

const api = axios.create({
  baseURL: API_URL,
});

// attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// error handling
api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error(err.response?.data?.message || "API error");
    return Promise.reject(err);
  }
);
export default api;