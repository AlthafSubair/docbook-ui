"use client";

import React, { useId } from "react";

export type SpinnerSize = "sm" | "md" | "lg" | "xl";
export type SpinnerVariant = "default" | "gradient";

export interface SpinnerProps {
  /** Size variant: sm (16px), md (20px - default), lg (32px), xl (48px) */
  size?: SpinnerSize;
  /** Visual variant: default (uses text-current) or gradient (uses DocBook brand gradient) */
  variant?: SpinnerVariant;
  /** Custom classes for sizing, colors, or positioning */
  className?: string;
  /** Accessible label for screen readers. Defaults to 'Loading...' */
  label?: string;
}

const sizeClasses: Record<SpinnerSize, string> = {
  sm: "size-4",
  md: "size-5",
  lg: "size-8",
  xl: "size-12",
};

export const Spinner = ({
  size = "md",
  variant = "default",
  className = "",
  label = "Loading...",
}: SpinnerProps) => {
  const rawId = useId();
  const gradientId = `docbook-spinner-${rawId.replace(/:/g, "")}`;
  const hasCustomSize = /(?:^|\s)(?:[a-z0-9_-]+:)?(?:size|w|h)-/i.test(className);
  const sizeClass = hasCustomSize ? "" : sizeClasses[size];

  return (
    <span
      role="status"
      aria-label={label}
      className={`inline-flex items-center justify-center shrink-0 ${sizeClass} ${className}`.trim()}
    >
      {variant === "gradient" ? (
        <svg
          className="size-full animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 50 50"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0000ff" stopOpacity="1" />
              <stop offset="50%" stopColor="#0000cc" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#000099" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Background track circle */}
          <circle
            className="opacity-15 text-primary"
            cx="25"
            cy="25"
            r="20"
            stroke="currentColor"
            strokeWidth="4"
          />

          {/* Active spinning gradient arc */}
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeDasharray="80 130"
          />
        </svg>
      ) : (
        <svg
          className="size-full animate-spin text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          {/* Background track circle */}
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3.5"
          />
          {/* Active spinning arc */}
          <path
            className="opacity-90"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      <span className="sr-only">{label}</span>
    </span>
  );
};

export default Spinner;
