import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:5000/api",
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