import axios from "axios";
import { Cookies } from "react-cookie";

const cookies = new Cookies();
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "x-resqx-key": "OGCALMDOWNLETMETHROUGH",
  },
});

// Add a request interceptor to include the access token in authorized requests
axiosInstance.interceptors.request.use((config) => {
  const accessToken = cookies.get("access_token");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export default axiosInstance;
