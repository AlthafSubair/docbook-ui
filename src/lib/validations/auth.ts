import { z } from "zod";
import type { CountryCode } from "libphonenumber-js";
import { validateCellularNumber } from "@/lib/phoneUtils";

/**
 * Validates cellular/mobile number across all supported countries.
 * Delegates to the unified validation engine in phoneUtils.
 */
export function validateMobileNumber(national: string, country: string): boolean {
  return validateCellularNumber(country as CountryCode, national);
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
