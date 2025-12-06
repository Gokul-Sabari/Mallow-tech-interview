import axios from "axios";
import apiConfig from "../config/apiConfig";

const axiosClient = axios.create({
  baseURL: apiConfig.BASE_URL,
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  config.headers["x-api-key"] = apiConfig.API_KEY;

  return config;
});

export default axiosClient;
