"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, ChevronDown, Check, Stethoscope } from "lucide-react";
import { navItems, isNavItemActive } from "@/app/components/ui/BottomNav";
import { usePatients } from "@/lib/api/patients";

const POPULAR_LOCATIONS = [
  "Kochi, Kerala",
  "Trivandrum, Kerala",
  "Calicut, Kerala",
  "Bengaluru, Karnataka",
  "Chennai, Tamil Nadu",
  "Mumbai, Maharashtra",
  "Hyderabad, Telangana",
];

export interface TopNavbarProps {
  className?: string;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ className = "" }) => {
  const pathname = usePathname();
  const { data: profiles } = usePatients();
  const hasProfiles = Boolean(profiles && profiles.length > 0);

  const [selectedLocation, setSelectedLocation] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("docbook_user_location");
        if (saved) return saved;
      } catch {}
    }
    return "Kochi, Kerala";
  });
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (loc: string) => {
    setSelectedLocation(loc);
    try {
      localStorage.setItem("docbook_user_location", loc);
    } catch {}
    setIsOpen(false);
  };

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <header
      className={`sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] ${className}`.trim()}
    >
      <div className="w-full max-w-2xl lg:max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        {/* Left Side: Branding */}
        <Link
          href="/clinics"
          className="flex items-center gap-2 group select-none shrink-0"
          title="DocBook Home"
        >
          <div className="size-8 rounded-xl bg-[image:var(--button-gradient)] flex items-center justify-center text-white shadow-xs shadow-primary/20 group-hover:scale-105 transition-transform">
            <Stethoscope className="size-4.5 stroke-[2.4]" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-extrabold text-base tracking-tight text-slate-900">
              Doc<span className="bg-[image:var(--button-gradient)] bg-clip-text text-transparent">Book</span>
            </span>
          </div>
        </Link>

        {/* Center: Desktop Navigation Links in between brand and location */}
        {hasProfiles && (
          <nav
            aria-label="Desktop navigation"
            className="hidden lg:flex flex-1 items-center justify-center gap-6 xl:gap-8"
          >
            {navItems.map((item) => {
              const active = isNavItemActive(pathname, item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center gap-2 text-sm transition-colors py-1 group ${
                    active
                      ? "text-primary font-bold"
                      : "text-slate-600 hover:text-primary font-medium"
                  }`}
                >
                  <Icon
                    className={`size-4.5 transition-colors ${
                      active
                        ? "stroke-[2.4] text-primary"
                        : "stroke-2 text-slate-500 group-hover:text-primary"
                    }`}
                  />
                  <span className="whitespace-nowrap">{item.label}</span>

                  {item.badge !== undefined && (
                    <span
                      className={`min-w-[18px] h-4.5 px-1 rounded-full text-[11px] font-bold flex items-center justify-center transition-colors ${
                        active
                          ? "bg-primary text-white"
                          : "bg-slate-100 text-slate-600 group-hover:bg-primary/10 group-hover:text-primary"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        )}

        {/* Right Side: Location Selector */}
        <div className="relative shrink-0" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/80 hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer group shadow-2xs"
          >
            <MapPin className="size-3.5 text-primary shrink-0 transition-transform group-hover:scale-110" />
            <span className="text-xs font-semibold text-slate-800 max-w-[140px] sm:max-w-none truncate">
              {selectedLocation}
            </span>
            <ChevronDown
              className={`size-3 text-slate-400 group-hover:text-primary transition-transform duration-200 ${
                isOpen ? "rotate-180 text-primary" : ""
              }`}
            />
          </button>

          {/* Location Dropdown Popover */}
          {isOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Select Your Location
              </div>
              <div className="flex flex-col gap-0.5">
                {POPULAR_LOCATIONS.map((loc) => {
                  const isSelected = loc === selectedLocation;
                  return (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => handleSelect(loc)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left ${
                        isSelected
                          ? "bg-primary/10 text-primary"
                          : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <span className="truncate">{loc}</span>
                      {isSelected && <Check className="size-3.5 text-primary shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
