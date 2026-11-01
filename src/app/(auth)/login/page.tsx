"use client"

import { useState } from "react";
import Image from "next/image";

import Title from "@/app/components/ui/Title";
import Desc from "@/app/components/ui/Desc";
import { Button } from "@/app/components/ui/Button";
import { PhoneInput } from "@/app/components/ui/PhoneInput";
import { useRouter } from "next/navigation";

const LoginPage = () => {

  const router = useRouter()
  const [phoneVal, setPhoneVal] = useState<string>("")

  const onLogin = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (phoneVal) {
      try {
        localStorage.setItem("docbook_user_phone", phoneVal);
      } catch {}
      router.push(`/verify-otp?phone=${encodeURIComponent(phoneVal)}`);
    } else {
      router.push('/verify-otp');
    }
  };

  return (
    <div className="flex flex-1 flex-col w-full">
      <div className="flex flex-1 flex-col justify-between items-center gap-4 sm:p-12 p-8">
        <div className="flex flex-col gap-2">
          <Title className="text-center">Welcome to DocBook</Title>
          <Desc className="text-center">
            Book your doctor’s appointment quickly and easily
          </Desc>
        </div>

        <div className="flex justify-center items-center">
          <Image
            src="/illustrations/Login.png"
            alt="Login illustration"
            width={280}
            height={280}
            priority
            className="w-60 md:w-72 h-auto max-w-full object-contain"
          />
        </div>

        <div className="w-full">
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
      </div>
    </div>
  );
};

export default LoginPage;