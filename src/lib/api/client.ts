import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig } from "axios";
import { API_BASE_URL } from "./config";
import { useAuthStore } from "@/lib/stores/authStore";

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

/**
 * Pre-configured Axios instance
 */
export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json, */*",
  },
});

/* Request Interceptor */
api.interceptors.request.use(
  (config) => {
    // Inject auth accessToken directly from Zustand store or localStorage
    const accessToken =
      useAuthStore.getState().accessToken ||
      (typeof window !== "undefined"
        ? localStorage.getItem("docbook_access_token") || ""
        : "");
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/* Response Interceptor */
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig | undefined;

    // Check if error is 401 Unauthorized and not already retried
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh-token") &&
      !originalRequest.url?.includes("/auth/login") &&
      !originalRequest.url?.includes("/auth/send-otp")
    ) {
      if (isRefreshing) {
        // If refresh is already in progress, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (newToken: string) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
              }
              resolve(api(originalRequest));
            },
            reject: (err: unknown) => {
              reject(err);
            },
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call backend refresh endpoint with withCredentials: true.
        // The browser automatically attaches the HttpOnly refreshToken cookie!
        const refreshResponse = await axios.post<unknown>(
          `${API_BASE_URL}/auth/refresh-token`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "*/*",
            },
            withCredentials: true,
          }
        );

        const resData = (refreshResponse.data || {}) as Record<string, unknown>;
        const nestedData =
          resData.data && typeof resData.data === "object"
            ? (resData.data as Record<string, unknown>)
            : null;

        const newAccessToken =
          (resData.accessToken as string) ||
          (resData.access_token as string) ||
          (resData.token as string) ||
          (nestedData?.accessToken as string) ||
          (nestedData?.access_token as string) ||
          (nestedData?.token as string) ||
          "";

        if (!newAccessToken) {
          throw new Error("No access token returned from refresh endpoint");
        }

        // Update accessToken in Zustand and localStorage
        useAuthStore.getState().setAccessToken(newAccessToken);

        // Update authorization header on the original request
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        processQueue(null, newAccessToken);
        isRefreshing = false;

        // Replay original request with fresh access token
        return api(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        isRefreshing = false;
        useAuthStore.getState().logout();
        if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
          // eslint-disable-next-line @next/next/no-location-assign-relative-destination
          window.location.href = "/login";
        }
        return Promise.reject(refreshErr);
      }
    }

    // Default error handling
    let message = "An unexpected error occurred";
    let status = 0;
    let data: unknown = null;

    if (error.response) {
      status = error.response.status;
      data = error.response.data;

      if (data && typeof data === "object") {
        const dataObj = data as Record<string, unknown>;
        if (typeof dataObj.message === "string") {
          message = dataObj.message;
        } else if (typeof dataObj.error === "string") {
          message = dataObj.error;
        } else if (Array.isArray(dataObj.errors) && dataObj.errors.length > 0) {
          message = String(dataObj.errors[0]);
        }
      } else if (typeof data === "string" && data.length > 0) {
        message = data;
      } else if (error.response.statusText) {
        message = error.response.statusText;
      }
    } else if (error.request) {
      message = "Unable to connect to server. Please check your network or server status.";
    } else if (error.message) {
      message = error.message;
    }

    return Promise.reject(new ApiError(message, status, data));
  }
);

/**
 * Generic API helper wrapper for Axios
 */
export async function apiClient<T>(
  endpoint: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await api<T>(endpoint, config);
  return response.data;
}
