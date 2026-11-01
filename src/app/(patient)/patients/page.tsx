"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { User, Mail, Calendar } from "lucide-react";

import Title from "@/app/components/ui/Title";
import Desc from "@/app/components/ui/Desc";
import { Input } from "@/app/components/ui/Input";
import { Button } from "@/app/components/ui/Button";
import { ProfileCard } from "@/app/components/patients/ProfileCard";
import { PatientProfile } from "@/types/patient";
import {
  getProfilesForPhone,
  saveProfile,
  deleteProfile,
  seedDemoProfiles,
} from "@/lib/patientStorage";

type SexOption = "Male" | "Female" | "Other";
type RelationshipOption = "Self" | "Family" | "Spouse" | "Child" | "Parent" | "Friend" | "Other";

const RELATIONSHIPS: RelationshipOption[] = [
  "Self",
  "Family",
  "Spouse",
  "Child",
  "Parent",
  "Friend",
  "Other",
];

function PatientsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryPhone = searchParams.get("phone");

  const [currentPhone, setCurrentPhone] = useState<string>("");
  const [profiles, setProfiles] = useState<PatientProfile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeView, setActiveView] = useState<"list" | "form">("list");
  const [selectingId, setSelectingId] = useState<string | null>(null);

  // Form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [sex, setSex] = useState<SexOption | "">("");
  const [customSex, setCustomSex] = useState("");
  const [relationship, setRelationship] = useState<RelationshipOption>("Self");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let resolvedPhone = queryPhone || "";
    if (!resolvedPhone && typeof window !== "undefined") {
      resolvedPhone = localStorage.getItem("docbook_user_phone") || "+91 98765 43210";
    }
    if (!resolvedPhone) {
      resolvedPhone = "+91 98765 43210";
    }
    setCurrentPhone(resolvedPhone);

    let loadedProfiles = getProfilesForPhone(resolvedPhone);
    if (!loadedProfiles || loadedProfiles.length === 0) {
      loadedProfiles = seedDemoProfiles(resolvedPhone);
    }
    setProfiles(loadedProfiles);
    setIsLoading(false);
    setActiveView("list");
  }, [queryPhone]);

  const maxDobDate = useMemo(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  }, []);

  const hasExistingProfiles = profiles.length > 0;

  const handleToggleView = () => {
    if (activeView === "list") {
      resetForm();
      setActiveView("form");
    } else {
      setActiveView("list");
    }
  };

  const resetForm = () => {
    setFullName("");
    setEmail("");
    setDob("");
    setSex("");
    setCustomSex("");
    setRelationship(hasExistingProfiles ? "Family" : "Self");
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (fullName.trim().length > 150) {
      newErrors.fullName = "Maximum 150 characters allowed";
    }

    if (email.trim()) {
      if (email.trim().length > 255) {
        newErrors.email = "Maximum 255 characters allowed";
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
          newErrors.email = "Enter a valid email address";
        }
      }
    }

    if (!dob) {
      newErrors.dob = "Date of birth is required";
    } else {
      const selectedDate = new Date(dob);
      const today = new Date();
      if (isNaN(selectedDate.getTime())) {
        newErrors.dob = "Enter a valid date";
      } else if (selectedDate > today) {
        newErrors.dob = "Date of birth cannot be in the future";
      }
    }

    const effectiveSex = sex === "Other" ? customSex.trim() : sex;
    if (!effectiveSex) {
      newErrors.sex = "Please select gender/sex";
    } else if (effectiveSex.length > 30) {
      newErrors.sex = "Maximum 30 characters allowed";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const effectiveSex = sex === "Other" ? (customSex.trim() || "Other") : sex;

    setTimeout(() => {
      const newProfile = saveProfile({
        phone: currentPhone,
        full_name: fullName.trim(),
        email: email.trim() || undefined,
        dob,
        sex: effectiveSex,
        relationship,
      });

      const updated = getProfilesForPhone(currentPhone);
      setProfiles(updated);
      setIsSubmitting(false);

      setActiveView("list");
      resetForm();
    }, 400);
  };

  const handleSelectProfile = (profile: PatientProfile) => {
    setSelectingId(profile.id);
    try {
      localStorage.setItem("docbook_selected_patient_id", profile.id);
      localStorage.setItem("docbook_selected_patient", JSON.stringify(profile));
    } catch {}

    // Navigate to next page (e.g. doctor selection or appointment booking)
    setTimeout(() => {
      router.push(`/doctors?patientId=${encodeURIComponent(profile.id)}`);
    }, 250);
  };

  const handleDeleteProfile = (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to remove the profile for ${name}?`)) {
      deleteProfile(id);
      const updated = getProfilesForPhone(currentPhone);
      setProfiles(updated);
      if (updated.length === 0) {
        setActiveView("form");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 text-secondary-text">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col w-full items-center justify-start px-4 py-4 md:py-8">
      {/* Container starting from top */}
      <div className="w-full max-w-md flex flex-col gap-3.5">
        {/* Top Header: Heading + Description + Add Profile Button */}
        {activeView === "list" ? (
          <div className="flex items-center justify-between gap-3 pb-1 border-b border-slate-100">
            <div className="flex flex-col gap-0.5">
              <Title className="text-xl md:text-2xl font-bold">
                Patient Profiles
              </Title>
              <Desc className="text-xs md:text-sm text-secondary-text">
                Select a profile to continue
              </Desc>
            </div>

            {/* Add Profile in top header using our Button component */}
            <Button
              type="button"
              onClick={handleToggleView}
              className="min-h-10 text-xs px-3.5 py-2 shrink-0"
            >
              Add Profile
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-1 text-center">
            <Title className="text-center text-xl md:text-2xl">
              {hasExistingProfiles ? "Add Patient Profile" : "Create Patient Profile"}
            </Title>

            <Desc className="text-center text-xs md:text-sm text-secondary-text">
              One account can hold multiple profiles for yourself, family, or friends
            </Desc>
          </div>
        )}

        {/* View 1: List profiles (Clicking selects and navigates to next page) */}
        {activeView === "list" ? (
          <div className="flex flex-col gap-2.5">
            <div className="flex flex-col gap-2 max-h-[62vh] overflow-y-auto pr-0.5">
              {profiles.map((profile) => (
                <ProfileCard
                  key={profile.id}
                  profile={profile}
                  isSelected={selectingId === profile.id}
                  onSelect={handleSelectProfile}
                  onDelete={handleDeleteProfile}
                />
              ))}
            </div>
          </div>
        ) : (
          /* View 2: Form (fits the screen without scrolling) */
          <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
            {/* Relationship selector */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-700">
                Relationship *
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-1">
                {RELATIONSHIPS.map((rel) => (
                  <button
                    key={rel}
                    type="button"
                    onClick={() => setRelationship(rel)}
                    className={`h-8 px-1 text-xs font-semibold rounded-lg border transition-all text-center cursor-pointer ${
                      relationship === rel
                        ? "bg-primary text-white border-primary shadow-xs"
                        : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    {rel}
                  </button>
                ))}
              </div>
            </div>

            {/* full_name varchar(150) [not null] */}
            <Input
              label="Full Name *"
              name="full_name"
              placeholder="e.g. John Doe"
              maxLength={150}
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: "" }));
              }}
              error={errors.fullName}
              icon={<User className="size-5" />}
              required
            />

            {/* email varchar(255) */}
            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="e.g. john@example.com"
              maxLength={255}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
              }}
              error={errors.email}
              icon={<Mail className="size-5" />}
            />

            {/* dob & sex side-by-side or stacked cleanly */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 items-start">
              {/* dob date */}
              <Input
                label="Date of Birth *"
                name="dob"
                type="date"
                max={maxDobDate}
                value={dob}
                onChange={(e) => {
                  setDob(e.target.value);
                  if (errors.dob) setErrors((prev) => ({ ...prev, dob: "" }));
                }}
                error={errors.dob}
                icon={<Calendar className="size-5" />}
                required
              />

              {/* sex varchar(30) */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-700">
                  Sex / Gender *
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {(["Male", "Female", "Other"] as SexOption[]).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setSex(option);
                        if (errors.sex) setErrors((prev) => ({ ...prev, sex: "" }));
                      }}
                      className={`h-11 rounded-xl border-2 text-xs font-semibold transition-all duration-150 flex items-center justify-center cursor-pointer ${
                        sex === option
                          ? "border-primary bg-primary/10 text-primary shadow-xs"
                          : "border-slate-200 bg-white text-secondary-text hover:border-slate-300"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                {sex === "Other" && (
                  <div className="mt-1">
                    <Input
                      placeholder="Specify gender"
                      name="custom_sex"
                      maxLength={30}
                      value={customSex}
                      onChange={(e) => setCustomSex(e.target.value)}
                      error={errors.sex}
                    />
                  </div>
                )}

                {errors.sex && !customSex && (
                  <p className="text-xs text-red-600 font-medium">{errors.sex}</p>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 pt-1">
              {hasExistingProfiles && (
                <Button
                  variant="secondary"
                  type="button"
                  onClick={handleToggleView}
                  className="flex-1 min-h-12"
                >
                  Back
                </Button>
              )}

              <Button
                type="submit"
                isLoading={isSubmitting}
                className={hasExistingProfiles ? "flex-1" : "w-full"}
              >
                {hasExistingProfiles ? "Save Patient" : "Create Profile"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function PatientsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center p-8 text-secondary-text">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      <PatientsContent />
    </Suspense>
  );
}