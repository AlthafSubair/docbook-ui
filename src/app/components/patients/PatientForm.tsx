"use client";

import React, { useState, useMemo } from "react";
import { toast } from "sonner";
import { User, Mail, Calendar } from "lucide-react";
import { Input } from "@/app/components/ui/Input";
import { Button } from "@/app/components/ui/Button";
import { useCreatePatient } from "@/lib/api/patients";

export type SexOption = "Male" | "Female" | "Other";
export type RelationshipOption =
  | "Self"
  | "Family"
  | "Spouse"
  | "Child"
  | "Parent"
  | "Friend"
  | "Other";

export const RELATIONSHIPS: RelationshipOption[] = [
  "Self",
  "Family",
  "Spouse",
  "Child",
  "Parent",
  "Friend",
  "Other",
];

export interface PatientFormProps {
  phone?: string;
  hasExistingProfiles: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

export function PatientForm({
  phone = "",
  hasExistingProfiles,
  onCancel,
  onSuccess,
}: PatientFormProps) {
  const createPatientMutation = useCreatePatient();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [sex, setSex] = useState<SexOption | "">("");
  const [customSex, setCustomSex] = useState("");
  const [relationship, setRelationship] = useState<RelationshipOption>(
    hasExistingProfiles ? "Family" : "Self"
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const maxDobDate = useMemo(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const effectiveSex = sex === "Other" ? customSex.trim() || "Other" : sex;

    try {
      await createPatientMutation.mutateAsync({
        phone,
        full_name: fullName.trim(),
        email: email.trim() || undefined,
        dob,
        sex: effectiveSex,
        relationship,
      });
      toast.success("Patient profile created successfully!");
      onSuccess();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to create patient profile";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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

      {/* Full Name */}
      <Input
        label="Full Name *"
        placeholder="e.g. Rahul Sharma"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        error={errors.fullName}
        maxLength={150}
        icon={<User className="size-5" />}
        required
      />

      {/* Email Address */}
      <Input
        label="Email Address"
        placeholder="e.g. rahul@example.com (optional)"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        maxLength={255}
        icon={<Mail className="size-5" />}
      />

      {/* Two Column Row: DOB & Gender */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {/* Date of Birth */}
        <Input
          label="Date of Birth *"
          type="date"
          value={dob}
          max={maxDobDate}
          onChange={(e) => setDob(e.target.value)}
          error={errors.dob}
          icon={<Calendar className="size-5" />}
          required
        />

        {/* Sex / Gender Selector */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-700">
            Sex / Gender *
          </label>
          <div className="grid grid-cols-3 gap-1">
            {(["Male", "Female", "Other"] as SexOption[]).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setSex(opt)}
                className={`h-11 text-xs font-semibold rounded-xl border transition-all text-center cursor-pointer ${
                  sex === opt
                    ? "bg-primary text-white border-primary shadow-xs"
                    : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
          {errors.sex && (
            <p className="text-[11px] font-medium text-red-500">
              {errors.sex}
            </p>
          )}
        </div>
      </div>

      {/* Custom Sex input when "Other" is chosen */}
      {sex === "Other" && (
        <Input
          label="Specify Gender / Self-Identify"
          placeholder="e.g. Non-Binary, Prefer not to say"
          value={customSex}
          onChange={(e) => setCustomSex(e.target.value)}
          maxLength={30}
        />
      )}

      {/* Form Action Buttons */}
      <div className="flex items-center gap-2 pt-1">
        {hasExistingProfiles && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            className="flex-1 min-h-11"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          className="flex-1 min-h-11"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          Save Profile
        </Button>
      </div>
    </form>
  );
}

export default PatientForm;

