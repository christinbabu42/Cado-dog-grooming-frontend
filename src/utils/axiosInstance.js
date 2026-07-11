import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://cado-dog-grooming-backend.onrender.com",
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API Error:", {
      status: err.response?.status,
      url: err.config?.url,
      data: err.response?.data,
    });

    // Don't redirect for now
    return Promise.reject(err);
  }
);

export default axiosInstance;