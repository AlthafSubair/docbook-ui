"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { KeyboardEvent, ClipboardEvent } from "react";

import Title from "@/app/components/ui/Title";
import Desc from "@/app/components/ui/Desc";
import { Button } from "@/app/components/ui/Button";
import {
  Stethoscope,
  Clock,
  CalendarCheck,
  Users,
  Sparkles,
} from "lucide-react";

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
    <div className="flex flex-1 flex-col lg:flex-row w-full bg-background text-foreground">
      {/* Left Section: Desktop Showcase & Branding (Visible on lg screens and above) */}
      <section className="hidden lg:flex lg:w-1/2 xl:w-7/12 relative flex-col justify-between p-10 xl:p-14 bg-gradient-to-br from-primary to-primary-dark text-white overflow-hidden isolate">
        {/* Ambient background glows & pattern overlays using token colors */}
        <div className="absolute -top-32 -left-32 size-96 rounded-full bg-primary/25 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 size-96 rounded-full bg-primary-dark/35 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-md shadow-black/10">
              <Stethoscope className="size-6 stroke-[2.3]" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-2xl tracking-tight text-white leading-none">
                Doc<span className="text-white/80">Book</span>
              </span>
              <span className="text-[11px] font-medium text-white/75 tracking-wider uppercase mt-1">
                Smart Clinic Appointments
              </span>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur-xs text-xs font-semibold text-white/90">
            <Sparkles className="size-3.5 text-white/90" />
            <span>Fast & Secure</span>
          </div>
        </div>

        {/* Hero Copy & Value Propositions */}
        <div className="relative z-10 my-auto py-8 max-w-xl">
          <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Healthcare appointments made simple, fast & stress-free.
          </h2>

          <p className="mt-4 text-base xl:text-lg text-white/85 leading-relaxed font-normal">
            Skip the crowded clinic waiting rooms. Book verified doctors, track your live token status, and take care of your entire family in one place.
          </p>

          {/* Highlights Grid */}
          <div className="mt-8 grid grid-cols-1 gap-3.5">
            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm transition-transform hover:scale-[1.01]">
              <div className="size-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0 text-white">
                <Clock className="size-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Live Queue & Token Tracker</h3>
                <p className="text-xs text-white/80 mt-0.5">Know exactly when your turn arrives and skip unnecessary lounge waiting.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm transition-transform hover:scale-[1.01]">
              <div className="size-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0 text-white">
                <CalendarCheck className="size-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Instant Slot Confirmation</h3>
                <p className="text-xs text-white/80 mt-0.5">Select your preferred date and time slot with real-time availability.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm transition-transform hover:scale-[1.01]">
              <div className="size-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0 text-white">
                <Users className="size-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Family Health Profiles</h3>
                <p className="text-xs text-white/80 mt-0.5">Manage and book appointments for your children, spouse, or parents easily.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Right Section: Mobile OTP Design, cleanly centered for desktop */}
      <section className="flex flex-1 flex-col justify-between items-center gap-3 sm:gap-4 p-6 sm:py-6 sm:px-10 md:py-6 md:px-12 lg:p-16 lg:justify-center lg:gap-8 w-full bg-background">
        <div className="flex flex-col gap-1.5 sm:gap-2 w-full max-w-md">
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

        <div className="flex justify-center items-center my-auto lg:my-0">
          <Image
            src="/illustrations/Login.png"
            alt="Verify OTP illustration"
            width={280}
            height={280}
            priority
            className="w-48 sm:w-56 md:w-60 lg:w-72 h-auto max-h-[26vh] md:max-h-[28vh] lg:max-h-none max-w-full object-contain"
          />
        </div>

        <div className="w-full max-w-sm">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* 6-digit OTP Inputs */}
            <div className="flex justify-between items-center gap-2 sm:gap-3">
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
                  className={`h-12 w-11 sm:h-14 sm:w-12 rounded-xl border-2 bg-background text-center text-xl sm:text-2xl font-bold text-primary-dark transition-[border-color,box-shadow,transform] duration-150 outline-none select-none ${
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
              <p className="text-center text-sm font-medium text-red-600 animate-in fade-in duration-200">
                {error}
              </p>
            )}

            {/* Resend and Edit options */}
            <div className="flex flex-col items-center gap-2 text-sm text-secondary-text">
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
      </section>
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