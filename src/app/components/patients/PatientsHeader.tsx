"use client";

import React from "react";
import Title from "@/app/components/ui/Title";
import Desc from "@/app/components/ui/Desc";
import { Button } from "@/app/components/ui/Button";

export interface PatientsHeaderProps {
  activeView: "list" | "form";
  hasExistingProfiles: boolean;
  onToggleView: () => void;
}

export function PatientsHeader({
  activeView,
  hasExistingProfiles,
  onToggleView,
}: PatientsHeaderProps) {
  if (activeView === "list") {
    return (
      <div className="flex items-center justify-between gap-3 pb-1">
        <div className="flex flex-col gap-0.5">
          <Title className="text-xl md:text-2xl font-bold">
            Patient Profiles
          </Title>
          <Desc className="text-xs md:text-sm text-secondary-text">
            Select a profile to continue
          </Desc>
        </div>

        <Button
          type="button"
          onClick={onToggleView}
          className="min-h-10 text-xs px-3.5 py-2 shrink-0"
        >
          Add Profile
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 text-center">
      <Title className="text-center text-xl md:text-2xl">
        {hasExistingProfiles ? "Add Patient Profile" : "Create Patient Profile"}
      </Title>

      <Desc className="text-center text-xs md:text-sm text-secondary-text">
        One account can hold multiple profiles for yourself, family, or friends
      </Desc>
    </div>
  );
}

export default PatientsHeader;

