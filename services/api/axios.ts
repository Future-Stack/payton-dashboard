/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";

// The base URL from the requirements
// const BASE_URL = "http://172.252.13.68:8000/api/v1";
const BASE_URL = "https://onthebitefishing.com/api/v1";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
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

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const state = useAuthStore.getState();
      const refreshToken = state.refreshToken;
      const userId = state.user?.id;

      if (!refreshToken || !userId) {
        state.logout();
        if (typeof window !== "undefined") {
          window.location.href = "/";
        }
        return Promise.reject(error);
      }

      return new Promise(function (resolve, reject) {
        axios
          .post(`${BASE_URL}/auth/refresh-token`, {
            userId: String(userId),
            refreshToken: refreshToken,
          })
          .then(({ data }) => {
            if (data?.data?.accessToken && data?.data?.refreshToken) {
              state.setTokens(data.data.accessToken, data.data.refreshToken);
              apiClient.defaults.headers.common["Authorization"] =
                "Bearer " + data.data.accessToken;
              originalRequest.headers["Authorization"] =
                "Bearer " + data.data.accessToken;
              processQueue(null, data.data.accessToken);
              resolve(apiClient(originalRequest));
            } else {
              state.logout();
              if (typeof window !== "undefined") {
                window.location.href = "/login";
              }
              processQueue(new Error("Failed to refresh token"));
              reject(error);
            }
          })
          .catch((err) => {
            state.logout();
            if (typeof window !== "undefined") {
              window.location.href = "/login";
            }
            processQueue(err, null);
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    return Promise.reject(error);
  },
);
