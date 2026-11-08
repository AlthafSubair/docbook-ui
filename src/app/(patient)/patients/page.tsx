"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/stores/authStore";
import { usePatients, useDeletePatient } from "@/lib/api/patients";
import { PatientsHeader } from "@/app/components/patients/PatientsHeader";
import { PatientsList } from "@/app/components/patients/PatientsList";
import { PatientForm } from "@/app/components/patients/PatientForm";
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
  const [activeView, setActiveView] = useState<"list" | "form">("list");
  const [selectingId, setSelectingId] = useState<string | null>(null);

  const hasExistingProfiles = profiles.length > 0;

  const handleSelectProfile = (profile: PatientProfile) => {
    setSelectingId(profile.id);
    try {
      localStorage.setItem("docbook_selected_patient_id", profile.id);
      localStorage.setItem("docbook_selected_patient", JSON.stringify(profile));
    } catch {}

    // Navigate to clinics page
    setTimeout(() => {
      router.push(`/clinics?patientId=${encodeURIComponent(profile.id)}`);
    }, 250);
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
        toast.success("Profile removed successfully");
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Failed to delete profile";
        toast.error(message);
      }
    }
  };

  return (
    <div className="flex flex-1 flex-col w-full items-center justify-start px-4 py-4 md:py-8">
      {/* Container starting from top */}
      <div className="w-full max-w-md flex flex-col gap-3.5">
        {/* Top Header: Title, Description, and Toggle Button */}
        <PatientsHeader
          activeView={activeView}
          hasExistingProfiles={hasExistingProfiles}
          onToggleView={() =>
            setActiveView((prev) => (prev === "list" ? "form" : "list"))
          }
        />

        {/* View 1: List profiles (Clicking selects and navigates to next page) */}
        {activeView === "list" ? (
          <PatientsList
            profiles={profiles}
            isLoading={isLoading}
            isError={isError}
            selectingId={selectingId}
            onSelect={handleSelectProfile}
            onDelete={handleDeleteProfile}
            onRetry={refetch}
            onAddProfile={() => setActiveView("form")}
          />
        ) : (
          /* View 2: Form (fits the screen without scrolling) */
          <PatientForm
            phone={currentPhone}
            hasExistingProfiles={hasExistingProfiles}
            onCancel={() => setActiveView("list")}
            onSuccess={() => setActiveView("list")}
          />
        )}
      </div>
    </div>
  );
}
