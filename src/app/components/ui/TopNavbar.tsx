"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { MapPin, ChevronDown, Check, Stethoscope } from "lucide-react";

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
  const [selectedLocation, setSelectedLocation] = useState("Kochi, Kerala");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("docbook_user_location");
      if (saved) setSelectedLocation(saved);
    } catch {}
  }, []);

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
      <div className="w-full max-w-2xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
        {/* Left Side: Branding */}
        <Link
          href="/clinics"
          className="flex items-center gap-2 group select-none"
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

        {/* Right Side: Location Selector */}
        <div className="relative" ref={dropdownRef}>
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
