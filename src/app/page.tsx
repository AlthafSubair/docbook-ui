import Image from "next/image";
import Desc from "./components/ui/Desc";
import Hearder from "./components/ui/Hearder"
import Title from "./components/ui/Title";
import { Input } from "./components/ui/Input";
import { Phone } from "lucide-react";
import { Button } from "./components/ui/Button";

const page = () => {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Hearder />
      <div className="flex flex-col gap-2 px-4 py-4">
        <Title className="text-center">Welcome to DocBook</Title>
        <Desc className="text-center">Book your doctor’s appointment quickly and easily</Desc>
      </div>

      <div className="flex justify-center items-center px-4 py-2">
        <Image
          src="/illustrations/Login.png"
          alt="Login illustration"
          width={280}
          height={280}
          priority
          className="w-60 md:w-72 h-auto max-w-full object-contain"
        />
      </div>

      <div className="p-4">
        <form className="flex flex-col gap-4">
          <Input type="phone" placeholder="Phone Number" icon={<Phone />}/>
          <Button className="w-full">Verify and proceed</Button>
        </form>
      </div>
    </div>
  );
}

export default page