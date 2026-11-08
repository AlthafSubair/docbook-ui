import React from "react";
import { Spinner } from "./Spinner";

export type PageLoaderSize = "sm" | "md" | "lg" | "xl";

export interface PageLoaderProps {
  /** Responsive size scale of the spinner: "sm" | "md" | "lg" | "xl" (defaults to "lg") */
  size?: PageLoaderSize;
  /** Whether the loader should fix to the entire viewport (fixed) or fill its container (flex-1). Defaults to false. */
  fullScreen?: boolean;
  className?: string;
}

const sizeConfig: Record<
  PageLoaderSize,
  {
    spinnerClass: string;
    pulseClass: string;
    glowClass: string;
  }
> = {
  sm: {
    spinnerClass: "size-6 sm:size-7 md:size-8",
    pulseClass: "size-8 sm:size-10 md:size-12",
    glowClass: "size-10 sm:size-12 md:size-14",
  },
  md: {
    spinnerClass: "size-8 sm:size-9 md:size-11",
    pulseClass: "size-11 sm:size-13 md:size-15",
    glowClass: "size-14 sm:size-16 md:size-18",
  },
  lg: {
    // Standard responsive default (44px on mobile, 52px on tablet, 56px on desktop)
    spinnerClass: "size-11 sm:size-12 md:size-14",
    pulseClass: "size-14 sm:size-16 md:size-18",
    glowClass: "size-18 sm:size-20 md:size-24",
  },
  xl: {
    spinnerClass: "size-13 sm:size-15 md:size-18 lg:size-20",
    pulseClass: "size-16 sm:size-19 md:size-22 lg:size-24",
    glowClass: "size-20 sm:size-24 md:size-28 lg:size-32",
  },
};

export function PageLoader({
  size = "lg",
  fullScreen = false,
  className = "",
}: PageLoaderProps) {
  const currentSize = sizeConfig[size] ?? sizeConfig.lg;

  const containerClasses = fullScreen
    ? "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
    : "flex flex-1 min-h-[50vh] w-full items-center justify-center";

  return (
    <div
      role="status"
      aria-label="Loading"
      className={`${containerClasses} animate-in fade-in duration-200 select-none ${className}`.trim()}
    >
      <div className="relative flex items-center justify-center">
        {/* Soft glowing ambient aura */}
        <div
          className={`absolute rounded-full bg-primary/20 blur-xl animate-pulse ${currentSize.glowClass}`}
          aria-hidden="true"
        />

        {/* Dynamic expanding shine-out ping ring */}
        <div
          className={`absolute rounded-full bg-(image:--button-gradient) opacity-30 animate-ping ${currentSize.pulseClass}`}
          aria-hidden="true"
        />

        {/* Responsive Theme Gradient Spinner */}
        <div className="relative flex items-center justify-center">
          <Spinner
            variant="gradient"
            className={currentSize.spinnerClass}
            label="Loading"
          />
        </div>
      </div>
    </div>
  );
}

export default PageLoader;
