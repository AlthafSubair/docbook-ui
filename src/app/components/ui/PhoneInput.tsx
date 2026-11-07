"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import type { KeyboardEvent } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import {
  getCountries,
  getCountryCallingCode,
  parsePhoneNumberFromString,
} from "libphonenumber-js/max";
import type { CountryCode } from "libphonenumber-js";

/* ------------------------------------------------------------------ */
/* Country data (built once, shared by every PhoneInput on the page)   */
/* ------------------------------------------------------------------ */

type Country = { code: CountryCode; name: string; dial: string };

// Search bar (~50px) + list (max 256px) + borders. Used to decide direction.
const MENU_HEIGHT = 340;

let countryCache: Country[] | null = null;

function getCountryList(): Country[] {
  if (countryCache) return countryCache;

  let names: Intl.DisplayNames | null = null;
  try {
    names = new Intl.DisplayNames(["en"], { type: "region" });
  } catch {
    names = null; // very old browsers: fall back to the ISO code
  }

  countryCache = getCountries()
    .map((code) => ({
      code,
      name: names?.of(code) ?? code,
      dial: `+${getCountryCallingCode(code)}`,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return countryCache;
}

function compute(country: CountryCode, national: string) {
  if (!national) return { e164: "", isValid: false };
  const digits = national.replace(/\D/g, "");

  // Reject all-repeated dummy sequences (e.g. 0000000000, 9999999999)
  if (/^(\d)\1+$/.test(digits)) {
    return {
      e164: `+${getCountryCallingCode(country)}${digits}`,
      isValid: false,
    };
  }

  // India mobile numbers strictly start with 6, 7, 8, 9 and must be 10 digits
  if (country === "IN") {
    const isIndianMobile = /^[6-9]\d{9}$/.test(digits);
    return {
      e164: `+91${digits}`,
      isValid: isIndianMobile,
    };
  }

  const parsed = parsePhoneNumberFromString(national, country);
  const type = parsed?.getType();
  const isValidMobile =
    !!parsed &&
    parsed.isValid() &&
    (type === "MOBILE" || type === "FIXED_LINE_OR_MOBILE" || type === undefined);

  return {
    e164: parsed?.number ?? `+${getCountryCallingCode(country)}${digits}`,
    isValid: isValidMobile,
  };
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export type PhoneValue = {
  country: CountryCode;
  national: string; // digits only, no country code
  e164: string; // e.g. +919876543210 (empty when no number typed)
  isValid: boolean;
};

type PhoneInputProps = {
  label?: string;
  error?: string;
  helperText?: string;
  /** Name of the hidden field submitted with the form (E.164 value). */
  name?: string;
  id?: string;
  defaultCountry?: CountryCode;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  autoFocus?: boolean;
  /** "auto" opens upward when there is no room below. */
  direction?: "auto" | "up" | "down";
  onChange?: (value: PhoneValue) => void;
  containerClassName?: string;
  "aria-label"?: string;
};

export function PhoneInput({
  label,
  error,
  helperText,
  name = "phone",
  id,
  defaultCountry = "IN",
  placeholder = "Phone Number",
  disabled,
  required,
  autoFocus,
  direction = "auto",
  onChange,
  containerClassName = "",
  "aria-label": ariaLabel,
}: PhoneInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const listboxId = `${inputId}-listbox`;
  const messageId = `${inputId}-message`;

  const countries = useMemo(() => getCountryList(), []);

  const [country, setCountry] = useState<CountryCode>(defaultCountry);
  const [national, setNational] = useState("");
  const [open, setOpen] = useState(false);
  const [dropUp, setDropUp] = useState(direction === "up");
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [touched, setTouched] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const userSelectedRef = useRef(false);
  const prevDefaultCountryRef = useRef(defaultCountry);

  useEffect(() => {
    if (prevDefaultCountryRef.current !== defaultCountry) {
      prevDefaultCountryRef.current = defaultCountry;
      if (!userSelectedRef.current && defaultCountry) {
        setCountry(defaultCountry);
        const result = compute(defaultCountry, national);
        onChange?.({
          country: defaultCountry,
          national,
          ...result,
        });
      }
    }
  }, [defaultCountry, national, onChange]);

  const selected = countries.find((c) => c.code === country) ?? countries[0];
  const { e164, isValid } = useMemo(
    () => compute(country, national),
    [country, national],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/^\+/, "");
    if (!q) return countries;
    return countries.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dial.includes(q) ||
        c.code.toLowerCase().startsWith(q),
    );
  }, [countries, query]);

  const apply = (nextCountry: CountryCode, nextNational: string) => {
    setCountry(nextCountry);
    setNational(nextNational);
    const result = compute(nextCountry, nextNational);
    onChange?.({
      country: nextCountry,
      national: nextNational,
      ...result,
    });
  };

  /* ---- typing / pasting ------------------------------------------ */
  const handleInput = (raw: string) => {
    // Pasted full international number, e.g. "+91 98765 43210"
    if (raw.trim().startsWith("+")) {
      const parsed = parsePhoneNumberFromString(raw);
      if (parsed?.country) {
        userSelectedRef.current = true;
        apply(parsed.country, parsed.nationalNumber);
        return;
      }
    }
    apply(country, raw.replace(/\D/g, "").slice(0, 15));
  };

  /* ---- dropdown open / close ------------------------------------- */
  const openMenu = () => {
    if (disabled) return;

    // Decide direction from the space around the field
    if (direction === "up") {
      setDropUp(true);
    } else if (direction === "down") {
      setDropUp(false);
    } else {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (rect) {
        // visualViewport = the area actually visible on phones
        // (accounts for the address bar and the on-screen keyboard)
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
        countries.findIndex((c) => c.code === country),
      ),
    );
    setOpen(true);
  };

  const closeMenu = (returnFocus = false) => {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  };

  const choose = (c: Country) => {
    userSelectedRef.current = true;
    apply(c.code, national);
    closeMenu();
    inputRef.current?.focus();
  };

  // Close on outside tap/click (pointer events cover mouse, touch, pen)
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // Focus the search box on desktop only (on phones it would pop the
  // keyboard over the list)
  useEffect(() => {
    if (!open) return;
    const finePointer =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(pointer: fine)").matches;
    if (finePointer) searchRef.current?.focus();
  }, [open]);

  // Keep the highlighted option visible while using arrow keys
  useEffect(() => {
    if (!open) return;
    const c = filtered[activeIndex];
    if (!c) return;
    document
      .getElementById(`${inputId}-opt-${c.code}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, filtered, open, inputId]);

  // When opening, scroll the selected country into view
  useEffect(() => {
    if (!open) return;
    document
      .getElementById(`${inputId}-opt-${country}`)
      ?.scrollIntoView({ block: "center" });
    // Only on open
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
      if (c) choose(c);
    } else if (e.key === "Escape") {
      e.preventDefault();
      closeMenu(true);
    }
  };

  /* ---- messages --------------------------------------------------- */
  const shownError =
    error ??
    (touched && national && !isValid ? "Enter a valid phone number" : undefined);
  const message = shownError ?? helperText;

  /* ---- styles (same look as <Input />) ---------------------------- */
  const fieldStyles = [
    "flex items-stretch gap-3 rounded-xl border-2 bg-white px-4",
    "transition-[border-color,box-shadow] duration-200",
    shownError
      ? "border-red-500 shadow-[0_2px_8px_rgba(239,68,68,0.3)] focus-within:shadow-[0_0_0_3px_rgba(239,68,68,0.25)]"
      : "border-primary/50 shadow-[0_2px_8px_rgba(0,0,255,0.25)] focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgba(0,0,255,0.2)]",
    disabled ? "cursor-not-allowed opacity-50" : "",
  ].join(" ");

  return (
    <div
      ref={rootRef}
      className={`flex flex-col gap-2 ${containerClassName}`.trim()}
    >
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-semibold text-slate-700"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <div className={fieldStyles}>
          {/* Country trigger: flag + dial code */}
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
                // Chevron points toward where the menu will open
                open !== dropUp ? "rotate-180" : ""
              }`}
              aria-hidden="true"
            />
          </button>

          {/* National number */}
          <input
            ref={inputRef}
            id={inputId}
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            autoFocus={autoFocus}
            required={required}
            disabled={disabled}
            maxLength={20}
            placeholder={placeholder}
            value={national}
            onChange={(e) => handleInput(e.target.value)}
            onBlur={() => setTouched(true)}
            aria-label={ariaLabel || label || placeholder || "Phone number"}
            aria-invalid={shownError ? true : undefined}
            aria-describedby={message ? messageId : undefined}
            className="min-w-0 flex-1 bg-transparent py-2.5 text-base text-secondary-text outline-none placeholder:text-tertiary-text disabled:cursor-not-allowed"
          />
        </div>

        {/* Dropdown: opens upward or downward. When upward, the search box
            stays next to the field (flex-col-reverse). */}
        {open && (
          <div
            className={`absolute left-0 right-0 z-50 flex overflow-hidden rounded-xl border-2 border-primary/50 bg-white shadow-[0_8px_24px_rgba(0,0,255,0.18)] ${
              dropUp ? "bottom-full mb-2 flex-col-reverse" : "top-full mt-2 flex-col"
            }`}
          >
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
                    ? `${inputId}-opt-${filtered[activeIndex].code}`
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
                    id={`${inputId}-opt-${c.code}`}
                    role="option"
                    aria-selected={isSelected}
                    onPointerEnter={() => setActiveIndex(index)}
                    onClick={() => choose(c)}
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
      </div>

      {message && (
        <p
          id={messageId}
          role={shownError ? "alert" : undefined}
          className={`text-sm ${shownError ? "text-red-600" : "text-tertiary-text"}`}
        >
          {message}
        </p>
      )}

      {/* Submitted with the form: full international number */}
      <input type="hidden" name={name} value={e164} />
    </div>
  );
}
