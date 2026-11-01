import React from "react";
import TopNavbar from "@/app/components/ui/TopNavbar";
import BottomNav from "@/app/components/ui/BottomNav";

const ClinicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50/50">
      <TopNavbar />
      <main className="flex flex-1 flex-col pb-20">{children}</main>
      <BottomNav />
    </div>
  );
};

export default ClinicLayout;