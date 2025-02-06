import axios from "axios";
import { Cookies } from "react-cookie";

const cookies = new Cookies();

const axiosInstance = axios.create({
  baseURL: "https://internal-backend-rdhj.onrender.com",
  headers: {
    "Content-Type": "application/json",
    "x-resqx-key": "OGCALMDOWNLETMETHROUGH",
  },
});

// Add a request interceptor to include the access token in authorized requests
axiosInstance.interceptors.request.use((config) => {
  const accessToken = cookies.get("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export default axiosInstance;