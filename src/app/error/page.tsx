"use client";

import React from "react";
import { ErrorState } from "@/app/components/ui/ErrorState";
import { Button } from "@/app/components/ui/Button";
import { HomeButton } from "@/app/components/ui/HomeButton";

export default function ErrorPage() {
  return (
    <ErrorState
      illustration="/illustrations/500.png"
      illustrationAlt="500 Server Error Illustration"
      badge="Application Error"
      title="Something Went Wrong"
      description="Our servers ran into an unexpected hiccup. Our engineers have been alerted and are on it!"
      actions={
        <>
          <Button
            onClick={() => {
              if (typeof window !== "undefined") {
                window.location.reload();
              }
            }}
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

