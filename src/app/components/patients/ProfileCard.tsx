"use client";

import React from "react";
import { Trash2, ChevronRight, Pencil } from "lucide-react";
import { PatientProfile } from "@/types/patient";
import { RelationshipBadge } from "@/app/components/ui/RelationshipBadge";
import { SelectIndicator } from "@/app/components/ui/SelectIndicator";
import { ActionButton } from "@/app/components/ui/ActionButton";

export interface ProfileCardProps {
  profile: PatientProfile;
  isSelected?: boolean;
  onSelect: (profile: PatientProfile) => void;
  onDelete: (e: React.MouseEvent, id: string, name: string) => void;
  onEdit?: (e: React.MouseEvent, profile: PatientProfile) => void;
  className?: string;
}

function calculateAge(dobString?: string): string | null {
  if (!dobString) return null;
  const dob = new Date(dobString);
  if (isNaN(dob.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age >= 0 ? `${age} yrs` : null;
}

function formatDate(dobString?: string): string {
  if (!dobString) return "";
  const date = new Date(dobString);
  if (isNaN(date.getTime())) return dobString;
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  isSelected = false,
  onSelect,
  onDelete,
  onEdit,
  className = "",
}) => {
  const age = calculateAge(profile.dob);

  return (
    <div
      onClick={() => onSelect(profile)}
      className={`group relative rounded-xl px-3 py-2 sm:px-3.5 sm:py-2.5 border-2 bg-white transition-[border-color,box-shadow,transform] duration-200 cursor-pointer flex flex-col gap-1.5 active:scale-[0.99] ${
        isSelected
          ? "border-primary"
          : "border-primary/50 hover:border-primary"
      } ${className}`.trim()}
    >
      {/* Top Row: Avatar & Profile Details */}
      <div className="flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Avatar Initials */}
          <div className="size-9 rounded-lg bg-linear-to-br from-blue-600 to-indigo-800 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
            {profile.full_name.charAt(0).toUpperCase()}
          </div>

          {/* Info */}
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs sm:text-sm text-slate-900 truncate group-hover:text-primary transition-colors">
                {profile.full_name}
              </span>
              <RelationshipBadge relationship={profile.relationship} />
            </div>

            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-secondary-text">
              {profile.sex && <span className="font-medium capitalize">{profile.sex}</span>}
              {profile.sex && age && <span>•</span>}
              {age && <span>{age}</span>}
              {profile.dob && !age && <span>{formatDate(profile.dob)}</span>}
            </div>

            {profile.email && (
              <span className="text-[10px] text-tertiary-text truncate">
                {profile.email}
              </span>
            )}
          </div>
        </div>

        {/* Right selection indicator with gradient bg */}
        <SelectIndicator isSelected={isSelected} />
      </div>

      {/* Bottom Card Footer: Separated Action Buttons on bottom-left */}
      <div className="flex items-center justify-between pt-1.5 border-t border-slate-100">
        <div className="flex items-center gap-1">
          <ActionButton
            variant="success"
            icon={<Pencil className="size-3.5" />}
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(e, profile);
            }}
            title="Edit profile"
            aria-label={`Edit profile for ${profile.full_name}`}
          />
          <ActionButton
            variant="danger"
            icon={<Trash2 className="size-3.5" />}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(e, profile.id, profile.full_name);
            }}
            title="Delete profile"
            aria-label={`Delete profile for ${profile.full_name}`}
          />
        </div>

        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary group-hover:translate-x-0.5 transition-transform">
          <span>Tap to book</span>
          <ChevronRight className="size-3" />
        </span>
      </div>
    </div>
  );
};

export default ProfileCard;
