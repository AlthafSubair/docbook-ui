"use client";

import React, { useState, useMemo } from "react";
import { toast } from "sonner";
import { User, Mail } from "lucide-react";
import { Input } from "@/app/components/ui/Input";
import { Button } from "docbook-ui-package";
import { OptionSelector } from "@/app/components/ui/OptionSelector";
import { DatePicker } from "@/app/components/ui/DatePicker";
import { useCreatePatient, useUpdatePatient } from "@/lib/api/patients";
import type { PatientProfile } from "@/types/patient";
import {
  patientFormSchema,
  RELATIONSHIP_OPTIONS,
  SEX_OPTIONS,
  type PatientRelationshipValue,
  type PatientSexValue,
} from "@/lib/validations/patient";

export type SexOption = PatientSexValue;
export type RelationshipOption = PatientRelationshipValue;
export const RELATIONSHIPS = RELATIONSHIP_OPTIONS;

export interface PatientFormProps {
  phone?: string;
  hasExistingProfiles: boolean;
  initialData?: PatientProfile | null;
  onCancel: () => void;
  onSuccess: (patient: PatientProfile) => void;
}

export function PatientForm({
  hasExistingProfiles,
  initialData,
  onCancel,
  onSuccess,
}: PatientFormProps) {
  const isEditing = Boolean(initialData?.id);
  const createPatientMutation = useCreatePatient();
  const updatePatientMutation = useUpdatePatient();

  const [fullName, setFullName] = useState(initialData?.full_name || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [dob, setDob] = useState(initialData?.dob || "");

  const initialSexValue = initialData?.sex?.toLowerCase() || "";
  const isKnownSex = ["male", "female", "other"].includes(initialSexValue);

  const [sex, setSex] = useState<SexOption | "">(
    isKnownSex ? (initialSexValue as SexOption) : initialSexValue ? "other" : ""
  );
  const [customSex, setCustomSex] = useState(
    initialSexValue && !["male", "female"].includes(initialSexValue)
      ? initialData?.sex || ""
      : ""
  );
  const [relationship, setRelationship] = useState<RelationshipOption>(
    (initialData?.relationship?.toLowerCase() as RelationshipOption) ||
      (hasExistingProfiles ? "spouse" : "self")
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setFullName("");
    setEmail("");
    setDob("");
    setSex("");
    setCustomSex("");
    setRelationship(hasExistingProfiles ? "spouse" : "self");
    setErrors({});
  };

  const maxDobDate = useMemo(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  }, []);

  const validateForm = () => {
    const result = patientFormSchema.safeParse({
      fullName,
      email: email.trim() || undefined,
      dob,
      sex,
      customSex,
      relationship,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const fieldName = issue.path[0];
        if (fieldName && !fieldErrors[String(fieldName)]) {
          fieldErrors[String(fieldName)] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const effectiveSex =
      sex === "other" ? customSex.trim().toLowerCase() || "other" : sex;

    try {
      let savedPatient: PatientProfile;
      if (isEditing && initialData?.id) {
        savedPatient = await updatePatientMutation.mutateAsync({
          id: initialData.id,
          fullName: fullName.trim(),
          dob,
          sex: effectiveSex,
          relationship,
          ...(email.trim() ? { email: email.trim() } : {}),
        });
        toast.success("Patient profile updated successfully!");
      } else {
        savedPatient = await createPatientMutation.mutateAsync({
          fullName: fullName.trim(),
          dob,
          sex: effectiveSex,
          relationship,
          ...(email.trim() ? { email: email.trim() } : {}),
        });
        toast.success("Patient profile created successfully!");
      }

      resetForm();
      onSuccess(savedPatient);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : isEditing
          ? "Failed to update patient profile"
          : "Failed to create patient profile";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex lg:flex-1 flex-col lg:justify-between gap-2.5 sm:gap-3.5">
      {/* Form Fields Section */}
      <div className="flex flex-col gap-2.5">
        {/* Relationship selector */}
        <OptionSelector<RelationshipOption>
          label="Relationship *"
          options={RELATIONSHIPS}
          value={relationship}
          onChange={(val) => {
            setRelationship(val);
            if (errors.relationship) {
              setErrors((prev) => ({ ...prev, relationship: "" }));
            }
          }}
          gridClassName="grid-cols-3 sm:grid-cols-6 gap-1"
          size="sm"
          error={errors.relationship}
        />

        {/* Full Name */}
        <Input
          label="Full Name *"
          placeholder="e.g. Rahul Sharma"
          value={fullName}
          onChange={(e) => {
            setFullName(e.target.value);
            if (errors.fullName) {
              setErrors((prev) => ({ ...prev, fullName: "" }));
            }
          }}
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
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) {
              setErrors((prev) => ({ ...prev, email: "" }));
            }
          }}
          error={errors.email}
          maxLength={255}
          icon={<Mail className="size-5" />}
        />

        {/* Two Column Row: DOB & Gender */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Date of Birth */}
          <DatePicker
            label="Date of Birth *"
            value={dob}
            maxDate={maxDobDate}
            onChange={(val) => {
              setDob(val);
              if (errors.dob) {
                setErrors((prev) => ({ ...prev, dob: "" }));
              }
            }}
            error={errors.dob}
          />

          {/* Sex / Gender Selector */}
          <OptionSelector<SexOption>
            label="Sex / Gender *"
            options={SEX_OPTIONS}
            value={sex}
            onChange={(val) => {
              setSex(val);
              if (errors.sex) {
                setErrors((prev) => ({ ...prev, sex: "" }));
              }
            }}
            gridClassName="grid-cols-3 gap-1"
            size="md"
            error={errors.sex}
          />
        </div>

        {/* Custom Sex input when "other" is chosen */}
        {sex === "other" && (
          <Input
            label="Specify Gender / Self-Identify *"
            placeholder="e.g. Non-Binary, Prefer not to say"
            value={customSex}
            onChange={(e) => {
              setCustomSex(e.target.value);
              if (errors.customSex) {
                setErrors((prev) => ({ ...prev, customSex: "" }));
              }
            }}
            error={errors.customSex}
            maxLength={30}
            required
          />
        )}
      </div>

      {/* Form Action Buttons: directly after inputs on mobile/tablet, anchored to bottom on desktop */}
      <div className="flex items-center gap-2 pt-1.5 lg:pt-4 lg:mt-auto">
        {hasExistingProfiles && (
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              resetForm();
              onCancel();
            }}
            className={`${isEditing ? "flex-1" : "flex-1 lg:hidden"} min-h-11 lg:min-h-12`}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          className="flex-1 min-h-11 lg:min-h-12"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          {isEditing ? "Update Profile" : "Add Profile"}
        </Button>
      </div>
    </form>
  );
}

export default PatientForm;

