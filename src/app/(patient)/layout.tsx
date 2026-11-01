import React from "react";
import Header from "../components/ui/Header";
import BottomNav from "../components/ui/BottomNav";

const PatientLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col pb-20">{children}</main>
      <BottomNav />
    </div>
  );
};

export default PatientLayout;