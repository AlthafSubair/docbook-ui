"use client";

import React, { useEffect } from "react";
import { ErrorState } from "@/app/components/ui/ErrorState";
import "./globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Root global layout error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased font-sans">
        <ErrorState
          illustration="/illustrations/500.png"
          illustrationAlt="Global System Error Illustration"
          badge="Critical Error"
          title="Critical System Error"
          description="A critical error occurred while initializing DocBook. Please reload the application or try again later."
          errorDigest={error.digest}
          primaryAction={{
            label: "Reload Application",
            onClick: () => reset(),
          }}
          secondaryAction={{
            label: "Go to Login",
            href: "/login",
          }}
        />
      </body>
    </html>
  );
}

