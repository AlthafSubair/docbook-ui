import { create } from "zustand";

interface AuthState {
  phone: string;
  country: string;
  national: string;
  setAuth: (phone: string, country?: string, national?: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  phone: typeof window !== "undefined" ? localStorage.getItem("docbook_user_phone") || "" : "",
  country: typeof window !== "undefined" ? localStorage.getItem("docbook_user_country") || "IN" : "IN",
  national: typeof window !== "undefined" ? localStorage.getItem("docbook_user_national") || "" : "",

  setAuth: (phone: string, country?: string, national?: string) => {
    try {
      localStorage.setItem("docbook_user_phone", phone);
      if (country) {
        localStorage.setItem("docbook_user_country", country);
      }
      if (national) {
        localStorage.setItem("docbook_user_national", national);
      }
    } catch {}

    set((state) => ({
      phone,
      country: country || state.country,
      national: national || state.national,
    }));
  },

  logout: () => {
    try {
      localStorage.removeItem("docbook_user_phone");
      localStorage.removeItem("docbook_user_national");
    } catch {}
    set({ phone: "", national: "" });
  },
}));
