import {
  getCountries,
  getCountryCallingCode,
  parsePhoneNumberFromString,
} from "libphonenumber-js/max";
import type { CountryCode } from "libphonenumber-js";

export type Country = {
  code: CountryCode;
  name: string;
  dial: string;
};

export type PhoneValue = {
  country: CountryCode;
  national: string; // digits only, no country code
  e164: string; // e.g. +919876543210 (empty when no number typed)
  isValid: boolean;
};

let countryCache: Country[] | null = null;

/**
 * Strict cellular prefix & length rules for target countries where
 * landlines or non-SMS capable lines must be explicitly distinguished.
 * Add new country rules here whenever needed.
 */
export const STRICT_CELLULAR_RULES: Partial<Record<CountryCode, RegExp>> = {
  // India: 10 digits starting with 6, 7, 8, or 9
  IN: /^[6-9]\d{9}$/,
  // UAE: 9 digits starting with 50, 52, 54, 55, 56, 58
  AE: /^(?:50|52|54|55|56|58)\d{7}$/,
  // Saudi Arabia: 9 digits starting with 5
  SA: /^5\d{8}$/,
  // United Kingdom: 10 digits starting with 7
  GB: /^7\d{9}$/,
  // United States & Canada: 10 digits; area code & exchange cannot begin with 0 or 1
  US: /^[2-9]\d{2}[2-9]\d{6}$/,
  CA: /^[2-9]\d{2}[2-9]\d{6}$/,
};

/**
 * Validates whether a given national number is a valid cellular/mobile line.
 * 1. Rejects dummy repetitive digits (e.g. 0000000000, 9999999999).
 * 2. Checks explicit cellular rules in STRICT_CELLULAR_RULES if configured.
 * 3. Falls back to global libphonenumber metadata validation for all other countries.
 */
export function validateCellularNumber(
  country: CountryCode,
  national: string
): boolean {
  const digits = national.replace(/\D/g, "");
  if (!digits || digits.length < 5) return false;

  // Reject all-repeated dummy sequences (e.g. 0000000000, 9999999999)
  if (/^(\d)\1+$/.test(digits)) return false;

  // Check explicit cellular rule if configured for this country
  const customRule = STRICT_CELLULAR_RULES[country];
  if (customRule) {
    return customRule.test(digits);
  }

  // Universal fallback: Google's libphonenumber telecom metadata
  try {
    const parsed = parsePhoneNumberFromString(national, country);
    if (!parsed || !parsed.isValid()) return false;
    const type = parsed.getType();
    return (
      type === "MOBILE" ||
      type === "FIXED_LINE_OR_MOBILE" ||
      type === undefined
    );
  } catch {
    return false;
  }
}

/**
 * Returns cached list of supported countries with localized names and dial codes.
 */
export function getCountryList(): Country[] {
  if (countryCache) return countryCache;

  let names: Intl.DisplayNames | null = null;
  try {
    names = new Intl.DisplayNames(["en"], { type: "region" });
  } catch {
    names = null; // Older browsers: fall back to ISO code
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

/**
 * Validates and formats the phone number based on country and national digits.
 */
export function computePhone(
  country: CountryCode,
  national: string
): { e164: string; isValid: boolean } {
  if (!national) return { e164: "", isValid: false };
  const digits = national.replace(/\D/g, "");
  const isValid = validateCellularNumber(country, national);

  let e164 = "";
  try {
    const parsed = parsePhoneNumberFromString(national, country);
    e164 = parsed?.number ?? `+${getCountryCallingCode(country)}${digits}`;
  } catch {
    e164 = `+${getCountryCallingCode(country)}${digits}`;
  }

  return {
    e164,
    isValid,
  };
}

/**
 * Parses raw input if the user pasted a full international number with + prefix
 */
export function parseInternationalNumber(
  raw: string
): { country: CountryCode; nationalNumber: string } | null {
  if (!raw.trim().startsWith("+")) return null;
  try {
    const parsed = parsePhoneNumberFromString(raw);
    if (parsed?.country) {
      return {
        country: parsed.country,
        nationalNumber: parsed.nationalNumber,
      };
    }
  } catch {}
  return null;
}
