"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Stethoscope,
  Clock,
  CalendarCheck,
  Users,
  Sparkles,
} from "lucide-react";

import Title from "@/app/components/ui/Title";
import Desc from "@/app/components/ui/Desc";
import { Button } from "@/app/components/ui/Button";
import { PhoneInput } from "@/app/components/ui/PhoneInput";

const LoginPage = () => {
  const router = useRouter();
  const [phoneVal, setPhoneVal] = useState<string>("");

  const onLogin = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (phoneVal) {
      try {
        localStorage.setItem("docbook_user_phone", phoneVal);
      } catch {}
      router.push(`/verify-otp?phone=${encodeURIComponent(phoneVal)}`);
    } else {
      router.push("/verify-otp");
    }
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

      {/* Right Section: Mobile Login Design, cleanly centered for desktop */}
      <section className="flex flex-1 flex-col justify-between items-center gap-3 sm:gap-4 p-6 sm:py-6 sm:px-10 md:py-6 md:px-12 lg:p-16 lg:justify-center lg:gap-8 w-full bg-background">
        <div className="flex flex-col gap-1.5 sm:gap-2 w-full max-w-md">
          <Title className="text-center">Welcome to DocBook</Title>
          <Desc className="text-center">
            Book your doctor’s appointment quickly and easily
          </Desc>
        </div>

        <div className="flex justify-center items-center my-auto lg:my-0">
          <Image
            src="/illustrations/Login.png"
            alt="Login illustration"
            width={280}
            height={280}
            priority
            className="w-48 sm:w-56 md:w-60 lg:w-72 h-auto max-h-[26vh] md:max-h-[28vh] lg:max-h-none max-w-full object-contain"
          />
        </div>

        <div className="w-full max-w-md">
          <form onSubmit={onLogin} className="flex flex-col gap-4">
            <PhoneInput
              name="phone"
              defaultCountry="IN"
              required
              aria-label="Phone number"
              onChange={(val) => setPhoneVal(val.e164)}
            />
            <Button type="submit" className="w-full">
              Verify and proceed
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;