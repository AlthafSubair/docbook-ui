"use client";

import React from "react";
import { ErrorState } from "@/app/components/ui/ErrorState";

export default function ServerErrorPage() {
  return (
    <ErrorState
      illustration="/illustrations/500.png"
      illustrationAlt="500 Server Error Illustration"
      badge="500 Error"
      title="Server Encountered an Error"
      description="Our servers ran into an unexpected hiccup. Our engineers have been alerted and are on it!"
      primaryAction={{
        label: "Try Again",
        onClick: () => {
          if (typeof window !== "undefined") {
            window.location.reload();
          }
        },
      }}
      secondaryAction={{
        label: "Back to Home",
        href: "/",
      }}
    />
  );
}

