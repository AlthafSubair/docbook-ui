import Image from "next/image";

import { Phone } from "lucide-react";

import Title from "@/app/components/ui/Title";
import Desc from "@/app/components/ui/Desc";
import { Input } from "@/app/components/ui/Input";
import { Button } from "@/app/components/ui/Button";


const LoginPage = () => {
  return (
    <div className="flex flex-1 flex-col w-full">
      <div className="flex flex-1 flex-col justify-between items-center gap-4 sm:p-12 p-8">
        <div className="flex flex-col gap-2">
          <Title className="text-center">Welcome to DocBook</Title>
          <Desc className="text-center">Book your doctor’s appointment quickly and easily</Desc>
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
          <form className="flex flex-col gap-4">
            <Input type="tel" placeholder="Phone Number" icon={<Phone />} />
            <Button className="w-full" >Verify and proceed</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;