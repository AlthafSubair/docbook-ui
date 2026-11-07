import { useMutation } from "@tanstack/react-query";
import { api, type ApiError } from "./client";

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
