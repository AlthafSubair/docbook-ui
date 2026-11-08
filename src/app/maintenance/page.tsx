"use client";

import React from "react";
import { ErrorState } from "@/app/components/ui/ErrorState";

export default function MaintenancePage() {
  return (
    <ErrorState
      illustration="/illustrations/maintance.png"
      illustrationAlt="DocBook Maintenance Mode Illustration"
      badge="Maintenance"
      title="Under Scheduled Maintenance"
      description="DocBook is temporarily undergoing scheduled maintenance to improve our services and reliability. We will be back online shortly!"
      primaryAction={{
        label: "Check Again",
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

