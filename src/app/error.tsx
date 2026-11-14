"use client";

import React, { useEffect } from "react";
import { ErrorState } from "@/app/components/ui/ErrorState";
import { Button } from "docbook-ui-package";
import { HomeButton } from "@/app/components/ui/HomeButton";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
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
      actions={
        <>
          <Button
            onClick={() => reset()}
            className="w-full sm:flex-1 min-h-10 sm:min-h-11 text-sm"
          >
            Try Again
          </Button>
          <HomeButton variant="secondary" className="w-full sm:flex-1" />
        </>
      }
    />
  );
}
