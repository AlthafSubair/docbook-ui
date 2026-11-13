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
import Title from "@/app/components/ui/Title";
import Desc from "@/app/components/ui/Desc";
import { Button } from "@/app/components/ui/Button";
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
  const [editingPatient, setEditingPatient] = useState<PatientProfile | null>(null);
  const [formVersion, setFormVersion] = useState(0);
  const activeView: "list" | "form" = hasExistingProfiles ? userView : "form";
  const [selectingId, setSelectingId] = useState<string | null>(null);
  const activeSelectedId = selectingId ?? selectedPatient?.id ?? null;

  const handleFormReset = () => {
    setEditingPatient(null);
    setFormVersion((v) => v + 1);
  };

  const handleSelectProfile = (profile: PatientProfile) => {
    setSelectingId(profile.id);
    setSelectedPatient(profile);
    router.push(`/clinics`);
  };

  const handleEditProfile = (
    e: React.MouseEvent,
    profile: PatientProfile
  ) => {
    e.stopPropagation();
    setEditingPatient(profile);
    setUserView("form");
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
        if (editingPatient?.id === id) {
          handleFormReset();
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
      {/* ============================================================== */}
      {/* MOBILE & TABLET LAYOUT (< lg): UNTOUCHED                       */}
      {/* ============================================================== */}
      <div className="w-full max-w-md flex flex-col gap-3.5 lg:hidden">
        {/* Top Header: Title, Description, and Toggle Button */}
        <PatientsHeader
          activeView={activeView}
          hasExistingProfiles={hasExistingProfiles}
          isEditing={Boolean(editingPatient)}
          onToggleView={() => {
            handleFormReset();
            setUserView((prev) => (prev === "list" ? "form" : "list"));
          }}
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
            onEdit={handleEditProfile}
            onRetry={refetch}
            onAddProfile={() => {
              handleFormReset();
              setUserView("form");
            }}
          />
        ) : (
          /* View 2: Form (fits the screen without scrolling) */
          <PatientForm
            key={`mobile-${editingPatient?.id || `new-${formVersion}`}`}
            phone={currentPhone}
            hasExistingProfiles={hasExistingProfiles}
            initialData={editingPatient}
            onCancel={() => {
              handleFormReset();
              setUserView("list");
            }}
            onSuccess={() => {
              handleFormReset();
              setUserView("list");
            }}
          />
        )}
      </div>

      {/* ============================================================== */}
      {/* DESKTOP LAYOUT (>= lg): SIDE-BY-SIDE                           */}
      {/* ============================================================== */}
      <div className="hidden lg:flex flex-col w-full max-w-5xl gap-6">
        {/* Page Top Title */}
        <div className="flex flex-col gap-1">
          <Title className="text-2xl lg:text-3xl font-bold">
            Patient Profiles
          </Title>
          <Desc className="text-sm text-secondary-text">
            Manage your patient profiles and select one to book appointments
          </Desc>
        </div>

        {/* Two-Column Side-by-Side Grid */}
        <div className="grid grid-cols-2 gap-8 items-start">
          {/* Left Column: Patient Profiles List */}
          <div className="flex flex-col gap-3.5 p-5 rounded-2xl bg-white border-2 border-primary/20 shadow-[0_4px_20px_rgba(0,0,255,0.06)]">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <div className="flex flex-col gap-0.5">
                <h2 className="text-base font-bold text-slate-900">
                  Select Patient
                </h2>
                <p className="text-xs text-secondary-text">
                  Click a profile to proceed with booking
                </p>
              </div>

              {editingPatient ? (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleFormReset}
                  className="text-xs py-1.5 px-3 min-h-8"
                >
                  + Add New
                </Button>
              ) : (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-primary">
                  {profiles.length} {profiles.length === 1 ? "Profile" : "Profiles"}
                </span>
              )}
            </div>

            <PatientsList
              profiles={profiles}
              isLoading={isLoading}
              isError={isError}
              selectingId={activeSelectedId}
              onSelect={handleSelectProfile}
              onDelete={handleDeleteProfile}
              onEdit={handleEditProfile}
              onRetry={refetch}
              onAddProfile={handleFormReset}
            />
          </div>

          {/* Right Column: Patient Form */}
          <div className="flex flex-col gap-3.5 p-5 rounded-2xl bg-white border-2 border-primary/20 shadow-[0_4px_20px_rgba(0,0,255,0.06)] lg:sticky lg:top-20">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <div className="flex flex-col gap-0.5">
                <h2 className="text-base font-bold text-slate-900">
                  {editingPatient ? "Edit Patient Profile" : "Add Patient Profile"}
                </h2>
                <p className="text-xs text-secondary-text">
                  {editingPatient
                    ? `Update details for ${editingPatient.full_name}`
                    : "Create a new patient profile under this account"}
                </p>
              </div>
            </div>

            <PatientForm
              key={`desktop-${editingPatient?.id || `new-${formVersion}`}`}
              phone={currentPhone}
              hasExistingProfiles={hasExistingProfiles}
              initialData={editingPatient}
              onCancel={handleFormReset}
              onSuccess={handleFormReset}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
