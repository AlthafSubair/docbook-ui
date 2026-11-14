"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ErrorState } from "@/app/components/ui/ErrorState";
import { Button } from "docbook-ui-package";
import { HomeButton } from "@/app/components/ui/HomeButton";

export default function NotFound() {
  const router = useRouter();

  const handleGoBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/login");
    }
  };

  return (
    <ErrorState
      illustration="/illustrations/404.png"
      illustrationAlt="404 Page Not Found Illustration"
      badge="404 Error"
      title="Page Not Found"
      description="Oops! The page you are looking for doesn't exist, has been moved, or is temporarily unavailable."
      actions={
        <>
          <HomeButton className="w-full sm:flex-1" />
          <Button
            variant="secondary"
            onClick={handleGoBack}
            className="w-full sm:flex-1 min-h-10 sm:min-h-11 text-sm"
          >
            Go Back
          </Button>
        </>
      }
    />
  );
}
