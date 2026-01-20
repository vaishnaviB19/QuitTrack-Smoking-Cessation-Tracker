import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
  // baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
});

axiosInstance.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default axiosInstance;
