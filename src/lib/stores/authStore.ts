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
  refreshToken: string;
  setAuth: (
    phone: string,
    country?: string,
    national?: string,
    tokens?: AuthTokens | string
  ) => void;
  setTokens: (accessToken: string, refreshToken?: string) => void;
  setAccessToken: (accessToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      phone: "",
      country: "IN",
      national: "",
      accessToken: "",
      refreshToken: "",

      setAuth: (phone, country, national, tokens) => {
        let accToken = "";
        let refToken = "";

        if (typeof tokens === "string") {
          accToken = tokens;
        } else if (tokens && typeof tokens === "object") {
          accToken = tokens.accessToken || "";
          refToken = tokens.refreshToken || "";
        }

        try {
          localStorage.setItem("docbook_user_phone", phone);
          if (country) {
            localStorage.setItem("docbook_user_country", country);
          }
          if (national) {
            localStorage.setItem("docbook_user_national", national);
          }
          if (accToken) {
            localStorage.setItem("docbook_access_token", accToken);
          }
          if (refToken) {
            localStorage.setItem("docbook_refresh_token", refToken);
          }
        } catch {}

        set((state) => ({
          phone,
          country: country || state.country,
          national: national || state.national,
          accessToken: accToken || state.accessToken,
          refreshToken: refToken || state.refreshToken,
        }));
      },

      setTokens: (accessToken: string, refreshToken?: string) => {
        try {
          localStorage.setItem("docbook_access_token", accessToken);
          if (refreshToken) {
            localStorage.setItem("docbook_refresh_token", refreshToken);
          }
        } catch {}

        set((state) => ({
          accessToken,
          refreshToken: refreshToken || state.refreshToken,
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
          refreshToken: "",
        });
      },
    }),
    {
      name: "docbook_auth_storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
