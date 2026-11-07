import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig } from "axios";
import { API_BASE_URL } from "./config";

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
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json, */*",
  },
});

/* Request Interceptor */
api.interceptors.request.use(
  (config) => {
    // Inject auth token if available in localStorage
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("docbook_auth_token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* Response Interceptor */
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
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
