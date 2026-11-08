import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { api, type ApiError } from "./client";
import { API_BASE_URL } from "./config";

export interface SendOtpPayload {
  country: string;
  number: string;
}

export interface SendOtpResponse {
  success?: boolean;
  message?: string;
  data?: unknown;
  [key: string]: unknown;
}

export interface VerifyOtpPayload {
  country: string;
  number: string;
  otp: string;
}

export interface VerifyOtpResponse {
  message: string;
  accessToken: string;
  refreshToken?: string;
}

export interface RefreshTokenPayload {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  message?: string;
  accessToken: string;
  refreshToken?: string;
  [key: string]: unknown;
}

/**
 * Send OTP to user's mobile number
 * POST /api/v1/auth/send-otp
 */
export async function sendOtp(payload: SendOtpPayload): Promise<SendOtpResponse> {
  const response = await api.post<SendOtpResponse>("/auth/send-otp", payload);
  return response.data;
}

/**
 * TanStack Query Mutation hook for sending OTP
 */
export function useSendOtp() {
  return useMutation<SendOtpResponse, ApiError, SendOtpPayload>({
    mutationFn: sendOtp,
  });
}

/**
 * Verify OTP with user's mobile number
 * POST /api/v1/auth/verify-otp
 */
export async function verifyOtp(payload: VerifyOtpPayload): Promise<VerifyOtpResponse> {
  const response = await api.post<VerifyOtpResponse>("/auth/verify-otp", payload);
  return response.data;
}

/**
 * TanStack Query Mutation hook for verifying OTP
 */
export function useVerifyOtp() {
  return useMutation<VerifyOtpResponse, ApiError, VerifyOtpPayload>({
    mutationFn: verifyOtp,
  });
}

/**
 * Exchange refresh token for a new access token
 * POST /api/v1/auth/refresh-token
 * Note: uses bare axios instance to prevent interceptor recursion on 401
 */
export async function refreshTokenApi(
  payload: RefreshTokenPayload
): Promise<RefreshTokenResponse> {
  const response = await axios.post<RefreshTokenResponse>(
    `${API_BASE_URL}/auth/refresh-token`,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
      withCredentials: true,
    }
  );
  return response.data;
}
