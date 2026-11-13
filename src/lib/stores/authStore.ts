import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

interface AuthState {
  phone: string;
  country: string;
  national: string;
  accessToken: string;
  setAuth: (
    phone: string,
    country?: string,
    national?: string,
    tokenOrPayload?: string | AuthTokens
  ) => void;
  setAccessToken: (accessToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      phone:
        typeof window !== "undefined"
          ? localStorage.getItem("docbook_user_phone") || ""
          : "",
      country:
        typeof window !== "undefined"
          ? localStorage.getItem("docbook_user_country") || "IN"
          : "IN",
      national:
        typeof window !== "undefined"
          ? localStorage.getItem("docbook_user_national") || ""
          : "",
      accessToken:
        typeof window !== "undefined"
          ? localStorage.getItem("docbook_access_token") || ""
          : "",

      setAuth: (phone, country, national, tokenOrPayload) => {
        const rawToken =
          typeof tokenOrPayload === "string"
            ? tokenOrPayload
            : tokenOrPayload && typeof tokenOrPayload === "object"
            ? tokenOrPayload.accessToken || ""
            : "";

        try {
          localStorage.setItem("docbook_user_phone", phone);
          if (country) {
            localStorage.setItem("docbook_user_country", country);
          }
          if (national) {
            localStorage.setItem("docbook_user_national", national);
          }
          if (rawToken) {
            localStorage.setItem("docbook_access_token", rawToken);
          }
          localStorage.removeItem("docbook_refresh_token");
        } catch {}

        set((state) => ({
          phone,
          country: country || state.country,
          national: national || state.national,
          accessToken: rawToken || state.accessToken,
        }));
      },

      setAccessToken: (accessToken: string) => {
        try {
          localStorage.setItem("docbook_access_token", accessToken);
        } catch {}
        set({ accessToken });
      },

      logout: () => {
        try {
          localStorage.removeItem("docbook_user_phone");
          localStorage.removeItem("docbook_user_national");
          localStorage.removeItem("docbook_access_token");
          localStorage.removeItem("docbook_refresh_token");
        } catch {}
        set({
          phone: "",
          national: "",
          accessToken: "",
        });
      },
    }),
    {
      name: "docbook_auth_storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
