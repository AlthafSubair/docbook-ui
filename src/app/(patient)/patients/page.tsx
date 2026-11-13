"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/stores/authStore";
import { usePatientStore } from "@/lib/stores/patientStore";
import { usePatients, useDeletePatient } from "@/lib/api/patients";
import { useIsMounted } from "@/hooks/useIsMounted";
import { PatientsHeader } from "@/app/components/patients/PatientsHeader";
import { PatientsList } from "@/app/components/patients/PatientsList";
import { PatientForm } from "@/app/components/patients/PatientForm";
import { LoadingState } from "@/app/components/ui/LoadingState";
import { ErrorCard } from "@/app/components/ui/ErrorCard";
import type { PatientProfile } from "@/types/patient";

export default function PatientsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryPhone = searchParams.get("phone");
  const storedPhone = useAuthStore((s) => s.phone);
  const currentPhone = queryPhone || storedPhone;

  // Fetch patient profiles via GET /api/v1/patients
  const { data: apiProfiles, isLoading, isError, refetch } = usePatients();
  const deletePatientMutation = useDeletePatient();

  const profiles: PatientProfile[] = apiProfiles ?? [];
  const hasExistingProfiles = profiles.length > 0;

  // Patient Store for persistent active patient selection
  const selectedPatient = usePatientStore((s) => s.selectedPatient);
  const setSelectedPatient = usePatientStore((s) => s.setSelectedPatient);
  const clearSelectedPatient = usePatientStore((s) => s.clearSelectedPatient);

  // Hydration-safe mount detection for Next.js SSR
  const isMounted = useIsMounted();

  // View state: 'list' or 'form'.
  // If there are no existing profiles, directly show the form.
  const [userView, setUserView] = useState<"list" | "form">("list");
  const activeView: "list" | "form" = hasExistingProfiles ? userView : "form";
  const [selectingId, setSelectingId] = useState<string | null>(null);
  const activeSelectedId = selectingId ?? selectedPatient?.id ?? null;

  const handleSelectProfile = (profile: PatientProfile) => {
    setSelectingId(profile.id);
    setSelectedPatient(profile);
    router.push(`/clinics`);
  };

  const handleDeleteProfile = async (
    e: React.MouseEvent,
    id: string,
    name: string
  ) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to remove the profile for ${name}?`)) {
      try {
        await deletePatientMutation.mutateAsync(id);
        if (selectedPatient?.id === id) {
          clearSelectedPatient();
        }
        if (selectingId === id) {
          setSelectingId(null);
        }
        toast.success("Profile removed successfully");
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Failed to delete profile";
        toast.error(message);
      }
    }
  };

  if (!isMounted || isLoading) {
    return <LoadingState message="Fetching patient profiles..." fullPage />;
  }

  if (isError) {
    return (
      <ErrorCard
        title="Failed to load patient profiles."
        description="Please verify your network connection or try again."
        onRetry={() => refetch()}
        fullPage
      />
    );
  }

  return (
    <div className="flex flex-1 flex-col w-full items-center justify-start px-4 py-4 md:py-8">
      {/* Container starting from top */}
      <div className="w-full max-w-md flex flex-col gap-3.5">
        {/* Top Header: Title, Description, and Toggle Button */}
        <PatientsHeader
          activeView={activeView}
          hasExistingProfiles={hasExistingProfiles}
          onToggleView={() =>
            setUserView((prev) => (prev === "list" ? "form" : "list"))
          }
        />

        {/* View 1: List profiles (Clicking selects and navigates to next page) */}
        {activeView === "list" ? (
          <PatientsList
            profiles={profiles}
            isLoading={isLoading}
            isError={isError}
            selectingId={activeSelectedId}
            onSelect={handleSelectProfile}
            onDelete={handleDeleteProfile}
            onRetry={refetch}
            onAddProfile={() => setUserView("form")}
          />
        ) : (
          /* View 2: Form (fits the screen without scrolling) */
          <PatientForm
            phone={currentPhone}
            hasExistingProfiles={hasExistingProfiles}
            onCancel={() => setUserView("list")}
            onSuccess={() => {
              setUserView("list");
            }}
          />
        )}
      </div>
    </div>
  );
}
