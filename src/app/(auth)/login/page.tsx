"use client";

import Image from "next/image";
import { Title, Desc } from "docbook-ui-package";
import LoginForm from "@/app/components/auth/LoginForm";

const LoginPage = () => {
  return (
    <div className="flex flex-1 flex-col justify-between items-center gap-2 sm:gap-4 px-5 py-3 sm:py-6 sm:px-10 md:py-6 md:px-12 lg:py-8 lg:px-10 xl:p-14 lg:justify-center lg:gap-6 xl:gap-8 w-full bg-background min-h-full">
      <div className="flex flex-col gap-1.5 sm:gap-2 w-full max-w-md shrink-0">
        <Title className="text-center">Welcome to DocBook</Title>
        <Desc className="text-center">
          Book your doctor’s appointment quickly and easily
        </Desc>
      </div>

      <div className="flex justify-center items-center my-auto lg:my-0 shrink-0">
        <Image
          src="/illustrations/Login.png"
          alt="Login illustration"
          width={280}
          height={280}
          priority
          className="w-36 sm:w-44 md:w-52 lg:w-48 xl:w-60 h-auto max-h-[18dvh] sm:max-h-[20dvh] lg:max-h-[19vh] xl:max-h-[23vh] max-w-full object-contain"
        />
      </div>

      <div className="w-full max-w-md shrink-0 pb-2 sm:pb-0">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
