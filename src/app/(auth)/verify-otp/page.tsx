"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Title from "@/app/components/ui/Title";
import Desc from "@/app/components/ui/Desc";
import VerifyOtpForm from "@/app/components/auth/VerifyOtpForm";

export default function VerifyOTPPage() {
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone");

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
        <VerifyOtpForm phone={phone} />
      </div>
    </div>
  );
}
