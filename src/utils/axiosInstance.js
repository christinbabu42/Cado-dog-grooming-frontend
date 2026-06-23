import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://cado-dog-grooming-backend.onrender.com",
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default axiosInstance;