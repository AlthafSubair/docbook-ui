"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { KeyboardEvent, ClipboardEvent, FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/app/components/ui/Button";
import { useAuthStore } from "@/lib/stores/authStore";
import { useSendOtp, useVerifyOtp, type VerifyOtpResponse } from "@/lib/api";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 30;

export interface VerifyOtpFormProps {
  phone?: string | null;
}

export default function VerifyOtpForm({ phone }: VerifyOtpFormProps) {
  const router = useRouter();
  const { country, national, phone: storedPhone, setAuth } = useAuthStore();
  const effectivePhone = phone || storedPhone;

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [timer, setTimer] = useState<number>(RESEND_COOLDOWN);
  const [error, setError] = useState<string>("");

  const canResend = timer <= 0;
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const sendOtpMutation = useSendOtp();
  const verifyOtpMutation = useVerifyOtp();

  // Focus the first input on initial mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Resend countdown timer
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // Resolves the country code (falls back to localStorage or "IN")
  const resolveCountry = (): string => {
    if (country) return country;
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("docbook_user_country");
      if (stored) return stored;
    }
    return "IN";
  };

  // Resolves the clean national number (digits only, no country dial prefix)
  const resolveNationalNumber = (): string => {
    if (national) return national.replace(/\D/g, "");
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("docbook_user_national");
      if (stored) return stored.replace(/\D/g, "");
    }
    if (effectivePhone) {
      const digits = effectivePhone.replace(/\D/g, "");
      return digits.length > 10 ? digits.slice(-10) : digits;
    }
    return "";
  };

  const handleChange = (index: number, value: string) => {
    setError("");
    const digit = value.replace(/\D/g, "");
    if (!digit) {
      const nextOtp = [...otp];
      nextOtp[index] = "";
      setOtp(nextOtp);
      return;
    }

    const nextOtp = [...otp];
    nextOtp[index] = digit.slice(-1);
    setOtp(nextOtp);

    // Auto-advance to the next input box
    if (index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // Move to previous box and clear it
        const nextOtp = [...otp];
        nextOtp[index - 1] = "";
        setOtp(nextOtp);
        inputRefs.current[index - 1]?.focus();
      } else {
        const nextOtp = [...otp];
        nextOtp[index] = "";
        setOtp(nextOtp);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    setError("");
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pastedData) return;

    const nextOtp = [...otp];
    pastedData.split("").forEach((char, idx) => {
      if (idx < OTP_LENGTH) {
        nextOtp[idx] = char;
      }
    });
    setOtp(nextOtp);

    const nextFocusIndex = Math.min(pastedData.length, OTP_LENGTH - 1);
    inputRefs.current[nextFocusIndex]?.focus();
  };

  const handleResend = async () => {
    if (!canResend || sendOtpMutation.isPending || verifyOtpMutation.isPending) return;
    setOtp(Array(OTP_LENGTH).fill(""));
    setError("");

    const targetCountry = resolveCountry();
    const targetNumber = resolveNationalNumber();

    if (!targetNumber) {
      toast.error("Session expired. Please log in again.");
      router.push("/login");
      return;
    }

    try {
      await sendOtpMutation.mutateAsync({
        country: targetCountry,
        number: targetNumber,
      });
      toast.success("New OTP sent successfully!");
      setTimer(RESEND_COOLDOWN);
      inputRefs.current[0]?.focus();
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to resend OTP. Please try again.";
      toast.error(message);
      setError(message);
    }
  };

  const isComplete = otp.every((digit) => digit.length === 1);
  const isLoading = verifyOtpMutation.isPending;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const otpCode = otp.join("");

    // 1. Validate OTP presence & length
    if (otpCode.length !== OTP_LENGTH || !/^\d{6}$/.test(otpCode)) {
      const msg = "Please enter the complete 6-digit OTP";
      setError(msg);
      toast.error(msg);
      const firstEmpty = otp.findIndex((d) => !d);
      inputRefs.current[firstEmpty !== -1 ? firstEmpty : 0]?.focus();
      return;
    }

    // 2. Validate phone number & country
    const targetCountry = resolveCountry();
    const targetNumber = resolveNationalNumber();

    if (!targetNumber) {
      toast.error("Session expired. Please log in again.");
      router.push("/login");
      return;
    }

    try {
      // 3. Submit API: POST /api/v1/auth/verify-otp
      const response: VerifyOtpResponse = await verifyOtpMutation.mutateAsync({
        country: targetCountry,
        number: targetNumber,
        otp: otpCode,
      });

      // 4. Extract tokens returned by backend
      const { accessToken, message } = response;

      // 5. Update auth storage (localStorage & Zustand)
      const phoneToStore = effectivePhone || `+91${targetNumber}`;
      setAuth(phoneToStore, targetCountry, targetNumber, accessToken);

      toast.success(message || "Authentication successful");

      // 6. Navigate to Patients selection
      router.push("/patients");
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Invalid or expired OTP. Please try again.";
      setError(message);
      toast.error(message);

      // Re-focus inputs on error
      inputRefs.current[0]?.focus();
      inputRefs.current[0]?.select();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4">
      {/* 6-digit OTP Inputs */}
      <div className="flex justify-between items-center gap-1.5 sm:gap-2.5">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            pattern="\d*"
            maxLength={1}
            disabled={isLoading}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
            aria-label={`Digit ${index + 1} of 6`}
            className={`h-11 w-10 sm:h-12 sm:w-11 md:h-13 md:w-12 lg:h-12 lg:w-11 xl:h-13 xl:w-12 rounded-xl border-2 bg-background text-center text-lg sm:text-xl md:text-2xl font-bold text-primary-dark transition-[border-color,box-shadow,transform] duration-150 outline-none select-none disabled:opacity-60 disabled:cursor-not-allowed ${
              error
                ? "border-red-500 shadow-[0_2px_8px_rgba(239,68,68,0.3)] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.25)] animate-shake"
                : digit
                  ? "border-primary shadow-[0_2px_8px_rgba(0,0,255,0.25)]"
                  : "border-primary/50 shadow-[0_2px_8px_rgba(0,0,255,0.15)]"
            } focus:border-primary focus:shadow-[0_0_0_3px_rgba(0,0,255,0.2)] focus:scale-105`}
          />
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-center text-xs sm:text-sm font-medium text-red-600 animate-in fade-in duration-200">
          {error}
        </p>
      )}

      {/* Verify Button */}
      <Button
        type="submit"
        className="w-full"
        isLoading={isLoading}
        disabled={isLoading || !isComplete}
      >
        Verify and proceed
      </Button>

      {/* Resend & Actions Row */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-secondary-text pt-1">
        <Link
          href="/login"
          className="font-medium hover:text-foreground transition-colors hover:underline"
        >
          Change number
        </Link>

        <div>
          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              disabled={sendOtpMutation.isPending || isLoading}
              className="font-semibold text-primary hover:underline cursor-pointer disabled:opacity-50"
            >
              {sendOtpMutation.isPending ? "Sending..." : "Resend OTP"}
            </button>
          ) : (
            <span>
              Resend in <span className="font-semibold">{timer}s</span>
            </span>
          )}
        </div>
      </div>
    </form>
  );
}
