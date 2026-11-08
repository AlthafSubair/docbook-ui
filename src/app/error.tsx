"use client";

import React, { useEffect } from "react";
import { ErrorState } from "@/app/components/ui/ErrorState";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected runtime errors to an error reporting service if desired
    console.error("Runtime application error:", error);
  }, [error]);

  return (
    <ErrorState
      illustration="/illustrations/500.png"
      illustrationAlt="500 Application Error Illustration"
      badge="Application Error"
      title="Something Went Wrong"
      description="An unexpected error occurred while loading this page. Our team has been notified. You can try refreshing the page."
      errorDigest={error.digest}
      primaryAction={{
        label: "Try Again",
        onClick: () => reset(),
      }}
      secondaryAction={{
        label: "Go to Home",
        href: "/",
      }}
    />
  );
}

