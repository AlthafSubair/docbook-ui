"use client";

import React, { type ReactNode } from "react";
import { useIsMounted } from "@/hooks/useIsMounted";

export interface ClientOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Declarative component that renders its children only after mounting on the client.
 * During SSR and initial client hydration, it renders the fallback (or null),
 * preventing hydration mismatches.
 */
export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const isMounted = useIsMounted();

  if (!isMounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

