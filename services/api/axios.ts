import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";

// The base URL from the requirements
const BASE_URL = "http://172.252.13.68:8000/api/v1";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();

      if (typeof window !== "undefined") {
        // window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  },
);
