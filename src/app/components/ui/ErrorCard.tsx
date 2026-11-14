"use client";

import React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "docbook-ui-package";

export interface ErrorCardProps {
  /** Error heading or main message */
  title?: string;
  /** Secondary descriptive explanation or help text */
  description?: string;
  /** Callback triggered when user clicks the retry button */
  onRetry?: () => void;
  /** Custom label for the retry button (defaults to "Try Again") */
  retryLabel?: string;
  /** Whether to wrap in a centered full-page responsive container (defaults to false) */
  fullPage?: boolean;
  /** Optional container max-width class when fullPage is true (defaults to "max-w-md") */
  maxWidth?: string;
  /** Whether to show an alert icon (defaults to false) */
  showIcon?: boolean;
  /** Custom icon override */
  icon?: React.ReactNode;
  /** Additional container CSS classes */
  className?: string;
}

export function ErrorCard({
  title = "Failed to load data.",
  description = "Please verify your network connection or try again.",
  onRetry,
  retryLabel = "Try Again",
  fullPage = false,
  maxWidth = "max-w-md",
  showIcon = false,
  icon,
  className = "",
}: ErrorCardProps) {
  const content = (
    <div
      role="alert"
      className={`flex flex-col items-center justify-center py-10 px-4 gap-2 text-center border-2 border-dashed border-red-200 rounded-xl bg-red-50/40 ${className}`.trim()}
    >
      {showIcon && (
        <div className="flex size-9 rounded-full bg-red-100 text-red-600 items-center justify-center mb-0.5">
          {icon || <AlertCircle className="size-4.5" />}
        </div>
      )}
      {title && (
        <p className="text-xs text-red-600 font-semibold">{title}</p>
      )}
      {description && (
        <p className="text-[11px] text-slate-500 max-w-xs">{description}</p>
      )}
      {onRetry && (
        <Button
          type="button"
          variant="secondary"
          onClick={onRetry}
          className="text-xs py-1.5 px-3 min-h-8 mt-1"
        >
          {retryLabel}
        </Button>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="flex flex-1 flex-col w-full items-center justify-start px-4 py-4 md:py-8">
        <div className={`w-full ${maxWidth} flex flex-col gap-3.5`}>
          {content}
        </div>
      </div>
    );
  }

  return content;
}

export default ErrorCard;

