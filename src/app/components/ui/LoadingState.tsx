"use client";

import React from "react";
import { Spinner, type SpinnerSize } from "@/app/components/ui/Spinner";

export interface LoadingStateProps {
  /** Optional message displayed below the spinner */
  message?: string;
  /** Size of the spinner: "sm" | "md" | "lg" | "xl" (defaults to "md") */
  size?: SpinnerSize;
  /** Whether to wrap in a centered full-page responsive container (defaults to false) */
  fullPage?: boolean;
  /** Optional container max-width class when fullPage is true (defaults to "max-w-md") */
  maxWidth?: string;
  /** Additional container CSS classes */
  className?: string;
}

export function LoadingState({
  message = "Loading...",
  size = "md",
  fullPage = false,
  maxWidth = "max-w-md",
  className = "",
}: LoadingStateProps) {
  const content = (
    <div
      role="status"
      aria-label={message}
      className={`flex flex-col items-center justify-center py-12 gap-3 min-h-[220px] select-none ${className}`.trim()}
    >
      <Spinner size={size} />
      {message && (
        <p className="text-xs text-secondary-text font-medium animate-pulse">
          {message}
        </p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="flex flex-1 flex-col w-full items-center justify-start px-4 py-4 md:py-8">
        <div className={`w-full ${maxWidth} flex flex-col gap-3.5`}>
          <div className="flex flex-col items-center justify-center py-16 gap-3 min-h-[300px]">
            <Spinner size={size} />
            {message && (
              <p className="text-xs text-secondary-text font-medium animate-pulse">
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return content;
}

export default LoadingState;

