"use client";

import { useId, useMemo, useRef, useState, useEffect } from "react";
import type { CountryCode } from "libphonenumber-js";
import {
  getCountryList,
  computePhone,
  parseInternationalNumber,
  type Country,
  type PhoneValue,
} from "@/lib/phoneUtils";
import { CountryDropdown } from "./CountryDropdown";

export type { PhoneValue };

export type PhoneInputProps = {
  label?: string;
  error?: string;
  helperText?: string;
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
  onBlur?: () => void;
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
  onBlur,
  containerClassName = "",
  "aria-label": ariaLabel,
}: PhoneInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = `${inputId}-message`;

  const countries = useMemo(() => getCountryList(), []);
  const [country, setCountry] = useState<CountryCode>(defaultCountry);
  const [national, setNational] = useState("");
  const [touched, setTouched] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const userSelectedRef = useRef(false);
  const prevDefaultCountryRef = useRef(defaultCountry);

  // Sync defaultCountry if detected asynchronously (unless user explicitly selected one)
  useEffect(() => {
    if (prevDefaultCountryRef.current !== defaultCountry) {
      prevDefaultCountryRef.current = defaultCountry;
      if (!userSelectedRef.current && defaultCountry) {
        setCountry(defaultCountry);
        const result = computePhone(defaultCountry, national);
        onChange?.({
          country: defaultCountry,
          national,
          ...result,
        });
      }
    }
  }, [defaultCountry, national, onChange]);

  const { e164, isValid } = useMemo(
    () => computePhone(country, national),
    [country, national]
  );

  const apply = (nextCountry: CountryCode, nextNational: string) => {
    setCountry(nextCountry);
    setNational(nextNational);
    const result = computePhone(nextCountry, nextNational);
    onChange?.({
      country: nextCountry,
      national: nextNational,
      ...result,
    });
  };

  // Handle typing or pasting full international numbers (e.g. +91 98765 43210)
  const handleInput = (raw: string) => {
    const international = parseInternationalNumber(raw);
    if (international) {
      userSelectedRef.current = true;
      apply(international.country, international.nationalNumber);
      return;
    }
    apply(country, raw.replace(/\D/g, "").slice(0, 15));
  };

  const handleCountrySelect = (c: Country) => {
    userSelectedRef.current = true;
    apply(c.code, national);
    inputRef.current?.focus();
  };

  const shownError =
    error ??
    (touched && national && !isValid ? "Enter a valid phone number" : undefined);
  const message = shownError ?? helperText;

  const fieldStyles = [
    "flex items-stretch gap-3 rounded-xl border-2 bg-white px-4",
    "transition-[border-color,box-shadow] duration-200",
    shownError
      ? "border-red-500 shadow-[0_2px_8px_rgba(239,68,68,0.3)] focus-within:shadow-[0_0_0_3px_rgba(239,68,68,0.25)]"
      : "border-primary/50 shadow-[0_2px_8px_rgba(0,0,255,0.25)] focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgba(0,0,255,0.2)]",
    disabled ? "cursor-not-allowed opacity-50" : "",
  ].join(" ");

  return (
    <div className={`flex flex-col gap-2 ${containerClassName}`.trim()}>
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
          {/* Country selector dropdown */}
          <CountryDropdown
            id={inputId}
            country={country}
            countries={countries}
            disabled={disabled}
            direction={direction}
            onSelect={handleCountrySelect}
          />

          {/* National phone number input */}
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
            onBlur={() => {
              setTouched(true);
              onBlur?.();
            }}
            aria-label={ariaLabel || label || placeholder || "Phone number"}
            aria-invalid={shownError ? true : undefined}
            aria-describedby={message ? messageId : undefined}
            className="min-w-0 flex-1 bg-transparent py-2.5 text-base text-secondary-text outline-none placeholder:text-tertiary-text disabled:cursor-not-allowed"
          />
        </div>
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

      {/* Hidden input submitted with standard HTML forms */}
      <input type="hidden" name={name} value={e164} />
    </div>
  );
}
