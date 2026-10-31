import React from "react";

type SpinnerSize = "sm" | "md" | "lg" | "xl";

interface SpinnerProps {
  /** Size variant: sm (16px), md (20px - default), lg (32px), xl (48px) */
  size?: SpinnerSize;
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
  className = "",
  label = "Loading...",
}: SpinnerProps) => {
  return (
    <span
      role="status"
      aria-label={label}
      className={`inline-flex items-center justify-center shrink-0 ${sizeClasses[size]} ${className}`.trim()}
    >
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
      <span className="sr-only">{label}</span>
    </span>
  );
};

export default Spinner;
