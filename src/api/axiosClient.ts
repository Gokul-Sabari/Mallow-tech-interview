import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://reqres.in/api",
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const apiKey = "reqres_1af77f68c54d455b865dfacb1f622a38"; 

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (apiKey) {
    config.headers["x-api-key"] = apiKey;
  }

  return config;
});

export default axiosClient;
