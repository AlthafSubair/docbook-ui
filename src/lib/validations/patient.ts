import { z } from "zod";

export const RELATIONSHIP_VALUES = [
  "self",
  "spouse",
  "child",
  "parent",
  "sibling",
  "other",
] as const;

export type PatientRelationshipValue = (typeof RELATIONSHIP_VALUES)[number];

export const RELATIONSHIP_OPTIONS: readonly {
  value: PatientRelationshipValue;
  label: string;
}[] = [
  { value: "self", label: "Self" },
  { value: "spouse", label: "Spouse" },
  { value: "child", label: "Child" },
  { value: "parent", label: "Parent" },
  { value: "sibling", label: "Sibling" },
  { value: "other", label: "Other" },
];

export const SEX_VALUES = ["male", "female", "other"] as const;

export type PatientSexValue = (typeof SEX_VALUES)[number];

export const SEX_OPTIONS: readonly {
  value: PatientSexValue;
  label: string;
}[] = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

export const patientFormSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(1, { message: "Full name is required" })
      .min(2, { message: "Full name must be at least 2 characters" })
      .max(150, { message: "Maximum 150 characters allowed" }),
    email: z
      .string()
      .trim()
      .max(255, { message: "Maximum 255 characters allowed" })
      .optional()
      .refine(
        (val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
        { message: "Enter a valid email address" }
      ),
    dob: z
      .string()
      .min(1, { message: "Date of birth is required" })
      .refine(
        (val) => {
          const date = new Date(val);
          return !isNaN(date.getTime());
        },
        { message: "Enter a valid date" }
      )
      .refine(
        (val) => {
          const date = new Date(val);
          const today = new Date();
          return date <= today;
        },
        { message: "Date of birth cannot be in the future" }
      )
      .refine(
        (val) => {
          const date = new Date(val);
          const minDate = new Date();
          minDate.setFullYear(minDate.getFullYear() - 130);
          return date >= minDate;
        },
        { message: "Please enter a realistic date of birth" }
      ),
    sex: z.enum(["male", "female", "other", ""], {
      message: "Please select gender/sex",
    }),
    customSex: z
      .string()
      .trim()
      .max(30, { message: "Maximum 30 characters allowed" })
      .optional(),
    relationship: z.enum(RELATIONSHIP_VALUES, {
      message: "Please select relationship",
    }),
  })
  .superRefine((data, ctx) => {
    if (!data.sex) {
      ctx.addIssue({
        code: "custom",
        message: "Please select gender/sex",
        path: ["sex"],
      });
    } else if (data.sex === "other") {
      if (!data.customSex || !data.customSex.trim()) {
        ctx.addIssue({
          code: "custom",
          message: "Please specify your gender / self-identify",
          path: ["customSex"],
        });
      }
    }
  });

export type PatientFormValues = z.infer<typeof patientFormSchema>;

