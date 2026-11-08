"use client";

import React from "react";
import { ErrorState } from "@/app/components/ui/ErrorState";
import { Button } from "@/app/components/ui/Button";
import { HomeButton } from "@/app/components/ui/HomeButton";

export default function MaintenancePage() {
  return (
    <ErrorState
      illustration="/illustrations/maintance.png"
      illustrationAlt="DocBook Maintenance Mode Illustration"
      badge="Maintenance"
      title="Under Scheduled Maintenance"
      description="DocBook is temporarily undergoing scheduled maintenance to improve our services and reliability. We will be back online shortly!"
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
            Check Again
          </Button>
          <HomeButton variant="secondary" className="w-full sm:flex-1" />
        </>
      }
    />
  );
}
