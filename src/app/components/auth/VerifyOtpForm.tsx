"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { KeyboardEvent, ClipboardEvent, FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/app/components/ui/Button";
import { useAuthStore } from "@/lib/stores/authStore";
import { useSendOtp } from "@/lib/api";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 30;

export interface VerifyOtpFormProps {
  phone?: string | null;
}

export default function VerifyOtpForm({ phone }: VerifyOtpFormProps) {
  const router = useRouter();
  const { country, national, phone: storedPhone } = useAuthStore();
  const effectivePhone = phone || storedPhone;

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [timer, setTimer] = useState<number>(RESEND_COOLDOWN);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const canResend = timer <= 0;
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const sendOtpMutation = useSendOtp();

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
    if (!canResend || sendOtpMutation.isPending) return;
    setOtp(Array(OTP_LENGTH).fill(""));
    setError("");

    if (country && national) {
      try {
        await sendOtpMutation.mutateAsync({
          country,
          number: national.replace(/\D/g, ""),
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
    } else {
      setTimer(RESEND_COOLDOWN);
      inputRefs.current[0]?.focus();
    }
  };

  const isComplete = otp.every((digit) => digit.length === 1);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isComplete) {
      setError("Please enter the complete 6-digit OTP");
      return;
    }

    setIsVerifying(true);
    setError("");

    // Simulate verification delay (replace with API call when ready)
    setTimeout(() => {
      setIsVerifying(false);
      if (effectivePhone) {
        try {
          localStorage.setItem("docbook_user_phone", effectivePhone);
        } catch {}
        router.push(`/patients?phone=${encodeURIComponent(effectivePhone)}`);
      } else {
        router.push("/patients");
      }
    }, 1000);
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
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
            aria-label={`Digit ${index + 1} of 6`}
            className={`h-11 w-10 sm:h-12 sm:w-11 md:h-13 md:w-12 lg:h-12 lg:w-11 xl:h-13 xl:w-12 rounded-xl border-2 bg-background text-center text-lg sm:text-xl md:text-2xl font-bold text-primary-dark transition-[border-color,box-shadow,transform] duration-150 outline-none select-none ${
              error
                ? "border-red-500 shadow-[0_2px_8px_rgba(239,68,68,0.3)] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.25)]"
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

      {/* Resend and Edit options */}
      <div className="flex flex-col items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-secondary-text">
        <div className="flex items-center gap-1.5">
          <span>Didn&apos;t receive the code?</span>
          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              className="font-semibold text-primary hover:underline cursor-pointer transition-colors"
            >
              Resend OTP
            </button>
          ) : (
            <span className="font-semibold text-tertiary-text">
              Resend in {timer}s
            </span>
          )}
        </div>

        <Link
          href="/login"
          className="text-xs font-medium text-tertiary-text hover:text-primary transition-colors"
        >
          Change phone number
        </Link>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        disabled={isVerifying}
        isLoading={isVerifying}
      >
        Verify and proceed
      </Button>
    </form>
  );
}

