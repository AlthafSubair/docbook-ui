"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "./Button";
import { useAuthStore } from "@/lib/stores/authStore";

/**
 * Helper to compute the target home route.
 * Logged-in users -> "/clinics" (Home)
 * Unauthenticated users -> "/login"
 */
export function getHomeRoute(accessToken?: string): string {
  const token = accessToken ?? useAuthStore.getState().accessToken;
  return token ? "/clinics" : "/login";
}

/**
 * Hook to retrieve the current home route based on Zustand auth state.
 */
export function useHomeRoute(): string {
  const accessToken = useAuthStore((s) => s.accessToken);
  return accessToken ? "/clinics" : "/login";
}

export interface HomeButtonProps {
  label?: string;
  variant?: "primary" | "secondary";
  className?: string;
  onClick?: () => void;
}

/**
 * Reusable Home Navigation Button.
 * Automatically navigates to "/clinics" if logged in, otherwise to "/login".
 */
export function HomeButton({
  label = "Back to Home",
  variant = "primary",
  className = "",
  onClick,
}: HomeButtonProps) {
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);

  const handleClick = () => {
    onClick?.();
    const targetRoute = getHomeRoute(accessToken);
    router.push(targetRoute);
  };

  return (
    <Button
      variant={variant}
      onClick={handleClick}
      className={`min-h-10 sm:min-h-11 text-sm ${className}`.trim()}
    >
      {label}
    </Button>
  );
}

export default HomeButton;
