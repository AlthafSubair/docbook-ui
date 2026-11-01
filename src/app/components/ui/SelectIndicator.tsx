"use client";

import React from "react";
import { ChevronRight, Check } from "lucide-react";

export interface SelectIndicatorProps {
  isSelected?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "size-7 text-xs",
  md: "size-8 text-sm",
  lg: "size-9 text-base",
};

const iconSizes = {
  sm: "size-3.5",
  md: "size-4",
  lg: "size-4.5",
};

export const SelectIndicator: React.FC<SelectIndicatorProps> = ({
  isSelected = false,
  className = "",
  size = "md",
}) => {
  const containerSize = sizeClasses[size] || sizeClasses.md;
  const iconSize = iconSizes[size] || iconSizes.md;

  return (
    <div
      aria-hidden="true"
      className={`rounded-full flex items-center justify-center shrink-0 transition-all duration-200 shadow-2xs ${containerSize} ${
        isSelected
          ? "bg-[image:var(--button-gradient)] text-white shadow-[0_2px_10px_rgba(0,0,255,0.3)] ring-2 ring-primary/20 scale-105"
          : "bg-slate-100 text-slate-400 group-hover:bg-[image:var(--button-gradient)] group-hover:text-white group-hover:shadow-[0_2px_8px_rgba(0,0,255,0.25)]"
      } ${className}`.trim()}
    >
      {isSelected ? (
        <Check className={`${iconSize} stroke-[2.5] animate-in zoom-in-75 duration-150`} />
      ) : (
        <ChevronRight
          className={`${iconSize} stroke-[2.5] group-hover:translate-x-0.5 transition-transform duration-200`}
        />
      )}
    </div>
  );
};

export default SelectIndicator;
