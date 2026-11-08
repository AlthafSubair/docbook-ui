"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CountryCode } from "libphonenumber-js";
import { toast } from "sonner";
import { Button } from "@/app/components/ui/Button";
import { PhoneInput } from "@/app/components/ui/PhoneInput";
import { detectUserCountry, getClientLocalCountry } from "@/lib/countryDetection";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import { useAuthStore } from "@/lib/stores/authStore";
import { useSendOtp } from "@/lib/api";

export default function LoginForm() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [defaultCountry, setDefaultCountry] = useState<CountryCode>(() => {
    return getClientLocalCountry() ?? "IN";
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: "",
      national: "",
      country: defaultCountry,
      isValid: false,
    },
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  const sendOtpMutation = useSendOtp();

  useEffect(() => {
    detectUserCountry(defaultCountry).then((detected) => {
      if (detected && detected !== defaultCountry) {
        setDefaultCountry(detected);
        setValue("country", detected);
      }
    });
  }, [defaultCountry, setValue]);

  const onSubmit = async (data: LoginFormData) => {
    const cleanNumber = data.national.replace(/\D/g, "");

    try {
      await sendOtpMutation.mutateAsync({
        country: data.country,
        number: cleanNumber,
      });

      // Persist to global Zustand auth store & localStorage
      setAuth(data.phone, data.country, cleanNumber);
      toast.success("OTP sent successfully!");

      router.push(`/verify-otp?phone=${encodeURIComponent(data.phone)}`);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to send OTP. Please try again.";
      toast.error(message);
    }
  };

  const isLoading = isSubmitting || sendOtpMutation.isPending;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-3 sm:gap-4"
    >
      <Controller
        name="phone"
        control={control}
        render={({ field }) => (
          <PhoneInput
            name={field.name}
            defaultCountry={defaultCountry}
            required
            error={errors.phone?.message}
            aria-label="Phone number"
            onBlur={field.onBlur}
            onChange={(val) => {
              setValue("phone", val.e164);
              setValue("national", val.national);
              setValue("country", val.country);
              setValue("isValid", val.isValid);
              field.onChange(val.e164);
              try {
                localStorage.setItem("docbook_user_country", val.country);
              } catch {}
            }}
          />
        )}
      />
      <Button
        type="submit"
        className="w-full"
        isLoading={isLoading}
        disabled={isLoading}
      >
        Verify and proceed
      </Button>
    </form>
  );
}
