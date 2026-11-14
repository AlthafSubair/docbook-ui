"use client";

import React from "react";
import { User } from "lucide-react";
import { Button } from "docbook-ui-package";
import { LoadingState } from "@/app/components/ui/LoadingState";
import { ErrorCard } from "@/app/components/ui/ErrorCard";
import { ProfileCard } from "@/app/components/patients/ProfileCard";
import type { PatientProfile } from "@/types/patient";

export interface PatientsListProps {
  profiles: PatientProfile[];
  isLoading: boolean;
  isError: boolean;
  selectingId?: string | null;
  onSelect: (profile: PatientProfile) => void;
  onDelete: (e: React.MouseEvent, id: string, name: string) => void;
  onEdit?: (e: React.MouseEvent, profile: PatientProfile) => void;
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
  onEdit,
  onRetry,
  onAddProfile,
}: PatientsListProps) {
  if (isLoading) {
    return <LoadingState message="Fetching patient profiles..." />;
  }

  if (isError) {
    return (
      <ErrorCard
        title="Failed to load patient profiles."
        description="Please verify your network connection or try again."
        onRetry={onRetry}
      />
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
    <div className="flex flex-col gap-2">
      {profiles.map((profile) => (
        <ProfileCard
          key={profile.id}
          profile={profile}
          isSelected={selectingId === profile.id}
          onSelect={onSelect}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}

export default PatientsList;

