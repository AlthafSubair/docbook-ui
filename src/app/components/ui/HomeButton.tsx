"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "./Button";
import { useAuthStore } from "@/lib/stores/authStore";

/**
 * Helper to compute the target home route synchronously.
 * Logged-in users -> "/clinics" (Home)
 * Unauthenticated users -> "/login"
 */
export function getHomeRoute(phoneFromStore?: string): string {
  if (phoneFromStore) return "/clinics";
  if (typeof window !== "undefined") {
    const hasPhone = Boolean(localStorage.getItem("docbook_user_phone"));
    const hasToken = Boolean(localStorage.getItem("docbook_auth_token"));
    if (hasPhone || hasToken) return "/clinics";
  }
  return "/login";
}

/**
 * Hook to retrieve the current home route.
 */
export function useHomeRoute(): string {
  const phone = useAuthStore((s) => s.phone);
  return getHomeRoute(phone);
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
  const phone = useAuthStore((s) => s.phone);

  const handleClick = () => {
    onClick?.();
    const targetRoute = getHomeRoute(phone);
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
