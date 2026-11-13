"use client";

import React, { useState, useMemo } from "react";
import { toast } from "sonner";
import { User, Mail, Calendar } from "lucide-react";
import { Input } from "@/app/components/ui/Input";
import { Button } from "@/app/components/ui/Button";
import { OptionSelector } from "@/app/components/ui/OptionSelector";
import { useCreatePatient } from "@/lib/api/patients";
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
  onCancel: () => void;
  onSuccess: (patient: PatientProfile) => void;
}

export function PatientForm({
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
    hasExistingProfiles ? "spouse" : "self"
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const createdPatient = await createPatientMutation.mutateAsync({
        fullName: fullName.trim(),
        dob,
        sex: effectiveSex,
        relationship,
        ...(email.trim() ? { email: email.trim() } : {}),
      });

      toast.success("Patient profile created successfully!");
      onSuccess(createdPatient);
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
        <Input
          label="Date of Birth *"
          type="date"
          value={dob}
          max={maxDobDate}
          onChange={(e) => {
            setDob(e.target.value);
            if (errors.dob) {
              setErrors((prev) => ({ ...prev, dob: "" }));
            }
          }}
          error={errors.dob}
          icon={<Calendar className="size-5" />}
          required
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

