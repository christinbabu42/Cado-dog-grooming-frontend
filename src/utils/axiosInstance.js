import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://cado-dog-grooming-backend.onrender.com",
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default axiosInstance;