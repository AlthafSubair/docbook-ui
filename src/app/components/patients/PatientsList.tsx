"use client";

import React from "react";
import { User } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { Spinner } from "@/app/components/ui/Spinner";
import { ProfileCard } from "@/app/components/patients/ProfileCard";
import type { PatientProfile } from "@/types/patient";

export interface PatientsListProps {
  profiles: PatientProfile[];
  isLoading: boolean;
  isError: boolean;
  selectingId?: string | null;
  onSelect: (profile: PatientProfile) => void;
  onDelete: (e: React.MouseEvent, id: string, name: string) => void;
  onRetry: () => void;
  onAddProfile: () => void;
}

export function PatientsList({
  profiles,
  isLoading,
  isError,
  selectingId,
  onSelect,
  onDelete,
  onRetry,
  onAddProfile,
}: PatientsListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3 min-h-[220px]">
        <Spinner size="md" />
        <p className="text-xs text-secondary-text font-medium">
          Fetching patient profiles...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-10 px-4 gap-2 text-center border-2 border-dashed border-red-200 rounded-xl bg-red-50/40">
        <p className="text-xs text-red-600 font-semibold">
          Failed to load patient profiles.
        </p>
        <p className="text-[11px] text-slate-500 max-w-xs">
          Please verify your network connection or try again.
        </p>
        <Button
          variant="secondary"
          onClick={onRetry}
          className="text-xs py-1.5 px-3 min-h-8 mt-1"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 px-4 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
        <div className="flex size-10 rounded-full bg-primary/10 text-primary items-center justify-center mb-2">
          <User className="size-5" />
        </div>
        <p className="text-sm font-bold text-slate-800">
          No Patient Profiles Found
        </p>
        <p className="text-xs text-slate-500 max-w-xs mt-1 mb-3.5">
          You haven&apos;t created any profiles yet. Add your first profile to continue.
        </p>
        <Button
          onClick={onAddProfile}
          className="text-xs py-2 px-4 min-h-9"
        >
          Create Profile
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 max-h-[62vh] overflow-y-auto pr-0.5">
      {profiles.map((profile) => (
        <ProfileCard
          key={profile.id}
          profile={profile}
          isSelected={selectingId === profile.id}
          onSelect={onSelect}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default PatientsList;

