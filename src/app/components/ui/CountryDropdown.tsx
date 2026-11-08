"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import type { KeyboardEvent } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import type { CountryCode } from "libphonenumber-js";
import type { Country } from "@/lib/phoneUtils";

const MENU_HEIGHT = 340;

export interface CountryDropdownProps {
  country: CountryCode;
  countries: Country[];
  onSelect: (country: Country) => void;
  disabled?: boolean;
  direction?: "auto" | "up" | "down";
  id: string;
}

export function CountryDropdown({
  country,
  countries,
  onSelect,
  disabled,
  direction = "auto",
  id,
}: CountryDropdownProps) {
  const [open, setOpen] = useState(false);
  const [dropUp, setDropUp] = useState(direction === "up");
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const listboxId = `${id}-listbox`;
  const selected = countries.find((c) => c.code === country) ?? countries[0];

  // Filter countries by query (name, dial code, or ISO code)
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/^\+/, "");
    if (!q) return countries;
    return countries.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dial.includes(q) ||
        c.code.toLowerCase().startsWith(q)
    );
  }, [countries, query]);

  // Open menu and calculate upward vs downward direction
  const openMenu = () => {
    if (disabled) return;

    if (direction === "up") {
      setDropUp(true);
    } else if (direction === "down") {
      setDropUp(false);
    } else {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (rect) {
        const viewportHeight =
          window.visualViewport?.height ?? window.innerHeight;
        const spaceBelow = viewportHeight - rect.bottom;
        const spaceAbove = rect.top;
        setDropUp(spaceBelow < MENU_HEIGHT && spaceAbove > spaceBelow);
      }
    }

    setQuery("");
    setActiveIndex(
      Math.max(
        0,
        countries.findIndex((c) => c.code === country)
      )
    );
    setOpen(true);
  };

  const closeMenu = (returnFocus = false) => {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  };

  const handleSelect = (c: Country) => {
    onSelect(c);
    closeMenu();
  };

  // Close when clicking outside
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (
        !dropdownRef.current?.contains(target) &&
        !triggerRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // Focus search box on desktop only (avoid auto-popping keyboard on mobile)
  useEffect(() => {
    if (!open) return;
    const isDesktopPointer =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(pointer: fine)").matches;
    if (isDesktopPointer) {
      searchRef.current?.focus();
    }
  }, [open]);

  // Keep highlighted option visible when navigating with arrow keys
  useEffect(() => {
    if (!open) return;
    const c = filtered[activeIndex];
    if (!c) return;
    document
      .getElementById(`${id}-opt-${c.code}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, filtered, open, id]);

  // When opening, scroll selected country into view
  useEffect(() => {
    if (!open) return;
    document
      .getElementById(`${id}-opt-${country}`)
      ?.scrollIntoView({ block: "center" });
    // Run only when dropdown opens
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const c = filtered[activeIndex];
      if (c) handleSelect(c);
    } else if (e.key === "Escape") {
      e.preventDefault();
      closeMenu(true);
    }
  };

  return (
    <>
      {/* Country trigger button: flag + dial code + chevron */}
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={() => (open ? closeMenu() : openMenu())}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-label={`Country code: ${selected.name} ${selected.dial}`}
        className="flex min-h-11 shrink-0 cursor-pointer items-center gap-2 border-r border-border-default pr-3 text-base text-secondary-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed"
      >
        <span
          className={`fi fi-${country.toLowerCase()} rounded-[3px] text-xl`}
          aria-hidden="true"
        />
        <span>{selected.dial}</span>
        <ChevronDown
          className={`size-4 text-tertiary-text transition-transform duration-200 ${
            open !== dropUp ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      {/* Floating dropdown menu */}
      {open && (
        <div
          ref={dropdownRef}
          className={`absolute left-0 right-0 z-50 flex overflow-hidden rounded-xl border-2 border-primary/50 bg-white shadow-[0_8px_24px_rgba(0,0,255,0.18)] ${
            dropUp ? "bottom-full mb-2 flex-col-reverse" : "top-full mt-2 flex-col"
          }`}
        >
          {/* Search box */}
          <div
            className={`flex items-center gap-2 border-border-default px-3 py-2 ${
              dropUp ? "border-t" : "border-b"
            }`}
          >
            <Search
              className="size-4 shrink-0 text-tertiary-text"
              aria-hidden="true"
            />
            <input
              ref={searchRef}
              type="text"
              role="combobox"
              aria-expanded="true"
              aria-controls={listboxId}
              aria-activedescendant={
                filtered[activeIndex]
                  ? `${id}-opt-${filtered[activeIndex].code}`
                  : undefined
              }
              aria-label="Search country or code"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              placeholder="Search country or code"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveIndex(0);
              }}
              onKeyDown={handleSearchKeyDown}
              className="min-w-0 flex-1 bg-transparent py-1 text-base text-secondary-text outline-none placeholder:text-tertiary-text"
            />
          </div>

          {/* Countries list */}
          <ul
            id={listboxId}
            role="listbox"
            aria-label="Countries"
            className="max-h-[min(16rem,40vh)] overflow-y-auto overscroll-contain py-1 [-webkit-overflow-scrolling:touch]"
          >
            {filtered.length === 0 && (
              <li className="px-4 py-3 text-sm text-tertiary-text">
                No countries found
              </li>
            )}

            {filtered.map((c, index) => {
              const isSelected = c.code === country;
              const isActive = index === activeIndex;
              return (
                <li
                  key={c.code}
                  id={`${id}-opt-${c.code}`}
                  role="option"
                  aria-selected={isSelected}
                  onPointerEnter={() => setActiveIndex(index)}
                  onClick={() => handleSelect(c)}
                  className={`flex min-h-11 cursor-pointer items-center gap-3 px-4 py-2 text-base text-secondary-text ${
                    isActive ? "bg-primary/10" : ""
                  }`}
                >
                  <span
                    className={`fi fi-${c.code.toLowerCase()} shrink-0 rounded-[3px] text-xl`}
                    aria-hidden="true"
                  />
                  <span className="min-w-0 flex-1 truncate">{c.name}</span>
                  <span className="shrink-0 text-sm text-tertiary-text">
                    {c.dial}
                  </span>
                  {isSelected && (
                    <Check
                      className="size-4 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
}

