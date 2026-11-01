"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CalendarDays, Users, User } from "lucide-react";

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
}

export const navItems: NavItem[] = [
  {
    id: "home",
    label: "Home",
    href: "/clinics",
    icon: Home,
  },
  {
    id: "bookings",
    label: "Bookings",
    href: "/bookings",
    icon: CalendarDays,
    badge: 2,
  },
  {
    id: "patients",
    label: "Patients",
    href: "/patients",
    icon: Users,
  },
  {
    id: "profile",
    label: "Profile",
    href: "/profile",
    icon: User,
  },
];

export const BottomNav: React.FC = () => {
  const pathname = usePathname();

  const isItemActive = (href: string) => {
    if (href === "/clinics") {
      return (
        pathname === "/" ||
        pathname === "/clinics" ||
        pathname?.startsWith("/clinics/") ||
        pathname?.startsWith("/doctors")
      );
    }
    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed bottom-3 inset-x-0 z-50 pointer-events-none flex justify-center px-3 sm:px-4"
    >
      {/* Detached floating dock using full width with reduced compact height */}
      <div className="pointer-events-auto flex items-center justify-between w-full max-w-2xl h-14 p-1 rounded-full bg-white/95 backdrop-blur-xl border-2 border-primary/40 shadow-[0_8px_30px_rgba(0,0,255,0.14),0_2px_8px_rgba(0,0,0,0.06)] select-none">
        {navItems.map((item) => {
          const active = isItemActive(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex-1 h-full rounded-full flex flex-col items-center justify-center gap-0.5 px-2 relative cursor-pointer transition-all duration-200 group ${
                active
                  ? "bg-[image:var(--button-gradient)] text-white shadow-[0_2px_8px_rgba(0,0,255,0.35)] scale-[1.01]"
                  : "text-secondary-text hover:text-primary hover:bg-slate-100/80"
              }`}
            >
              {/* Icon Container with optional notification badge */}
              <div className="relative flex items-center justify-center">
                <Icon
                  className={`size-5 transition-transform duration-150 ${
                    active
                      ? "stroke-[2.4] text-white"
                      : "stroke-2 text-slate-500 group-hover:text-primary group-hover:scale-105"
                  }`}
                />

                {item.badge !== undefined && (
                  <span
                    className={`absolute -top-1 -right-2.5 min-w-[14px] h-[14px] px-1 rounded-full text-[12px] font-black flex items-center justify-center shadow-xs ${
                      active
                        ? "bg-white text-primary"
                        : "bg-[image:var(--button-gradient)] text-white"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[9.5px] leading-none tracking-tight whitespace-nowrap transition-colors ${
                  active
                    ? "font-bold text-white"
                    : "font-medium text-slate-600 group-hover:text-primary"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;


