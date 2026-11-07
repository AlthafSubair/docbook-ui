"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { KeyboardEvent, ClipboardEvent } from "react";

import Title from "@/app/components/ui/Title";
import Desc from "@/app/components/ui/Desc";
import { Button } from "@/app/components/ui/Button";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 30;

function VerifyOTPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone");

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [timer, setTimer] = useState<number>(RESEND_COOLDOWN);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const canResend = timer <= 0;
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

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
    // Take the last character typed
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
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pastedData) return;

    const nextOtp = [...otp];
    pastedData.split("").forEach((char, idx) => {
      if (idx < OTP_LENGTH) {
        nextOtp[idx] = char;
      }
    });
    setOtp(nextOtp);

    // Focus the box immediately after the pasted content or the last box
    const nextFocusIndex = Math.min(pastedData.length, OTP_LENGTH - 1);
    inputRefs.current[nextFocusIndex]?.focus();
  };

  const handleResend = () => {
    if (!canResend) return;
    setOtp(Array(OTP_LENGTH).fill(""));
    setTimer(RESEND_COOLDOWN);
    setError("");
    inputRefs.current[0]?.focus();
    // Potential API call to resend OTP goes here
  };

  const isComplete = otp.every((digit) => digit.length === 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isComplete) {
      setError("Please enter the complete 6-digit OTP");
      return;
    }

    setIsVerifying(true);
    setError("");

    // Simulate verification delay
    setTimeout(() => {
      setIsVerifying(false);
      if (phone) {
        try {
          localStorage.setItem("docbook_user_phone", phone);
        } catch {}
        router.push(`/patients?phone=${encodeURIComponent(phone)}`);
      } else {
        router.push("/patients");
      }
    }, 1000);
  };

  return (
    <div className="flex flex-1 flex-col justify-between items-center gap-2 sm:gap-4 px-5 py-3 sm:py-6 sm:px-10 md:py-6 md:px-12 lg:py-8 lg:px-8 xl:p-12 lg:justify-center lg:gap-5 xl:gap-7 w-full bg-background min-h-full">
      <div className="flex flex-col gap-1.5 sm:gap-2 w-full max-w-md shrink-0">
        <Title className="text-center">Verify with OTP</Title>
        <Desc className="text-center">
          {phone ? (
            <>
              Enter the 6-digit code sent to{" "}
              <span className="font-semibold text-secondary-text">{phone}</span>
            </>
          ) : (
            "Enter the 6-digit code sent to your mobile number"
          )}
        </Desc>
      </div>

      <div className="flex justify-center items-center my-auto lg:my-0 shrink-0">
        <Image
          src="/illustrations/Login.png"
          alt="Verify OTP illustration"
          width={280}
          height={280}
          priority
          className="w-36 sm:w-44 md:w-52 lg:w-48 xl:w-60 h-auto max-h-[18dvh] sm:max-h-[20dvh] lg:max-h-[19vh] xl:max-h-[23vh] max-w-full object-contain"
        />
      </div>

      <div className="w-full max-w-sm shrink-0 pb-2 sm:pb-0">
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
            disabled={!isComplete || isVerifying}
            isLoading={isVerifying}
            onClick={handleSubmit}
          >
            Verify and proceed
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={<div className="flex flex-1 items-center justify-center p-8 text-secondary-text">Loading...</div>}>
      <VerifyOTPContent />
    </Suspense>
  );
}
