import { z } from "zod";
import { parsePhoneNumberFromString } from "libphonenumber-js/max";
import type { CountryCode } from "libphonenumber-js";

export function validateMobileNumber(national: string, country: string): boolean {
  const digits = national.replace(/\D/g, "");
  if (!digits || digits.length < 5) return false;

  // Reject dummy all-repeated digits (e.g. 0000000000, 9999999999)
  if (/^(\d)\1+$/.test(digits)) return false;

  // India mobile numbers strictly start with 6, 7, 8, 9 and must be 10 digits
  if (country === "IN") {
    return /^[6-9]\d{9}$/.test(digits);
  }

  // General mobile check via libphonenumber-js
  try {
    const parsed = parsePhoneNumberFromString(national, country as CountryCode);
    if (!parsed || !parsed.isValid()) return false;
    const type = parsed.getType();
    return type === "MOBILE" || type === "FIXED_LINE_OR_MOBILE" || type === undefined;
  } catch {
    return false;
  }
}

export const loginSchema = z
  .object({
    phone: z.string(),
    national: z.string(),
    country: z.string(),
    isValid: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (!data.national || !data.national.trim()) {
      ctx.addIssue({
        code: "custom",
        message: "Please enter your phone number",
        path: ["phone"],
      });
      return;
    }

    const isMobileValid =
      data.isValid && validateMobileNumber(data.national, data.country);

    if (!isMobileValid) {
      let countryName = data.country;
      try {
        countryName =
          new Intl.DisplayNames(["en"], { type: "region" }).of(data.country) ||
          data.country;
      } catch {}

      ctx.addIssue({
        code: "custom",
        message: `Please enter a valid phone number for ${countryName}`,
        path: ["phone"],
      });
    }
  });

export type LoginFormData = z.infer<typeof loginSchema>;
