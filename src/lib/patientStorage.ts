import { PatientProfile } from "@/types/patient";

const STORAGE_KEY = "docbook_patient_profiles";
export const DEFAULT_PHONE = "+91 98765 43210";

export const INITIAL_DEMO_PROFILES: PatientProfile[] = [
  {
    id: "pat_1",
    phone: "+919876543210",
    full_name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    dob: "1994-05-14",
    sex: "Male",
    relationship: "Self",
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
  },
  {
    id: "pat_2",
    phone: "+919876543210",
    full_name: "Ananya Sharma",
    email: "ananya.sharma@example.com",
    dob: "1996-08-22",
    sex: "Female",
    relationship: "Spouse",
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
  {
    id: "pat_3",
    phone: "+919876543210",
    full_name: "Aarav Sharma",
    email: "",
    dob: "2020-03-10",
    sex: "Male",
    relationship: "Child",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

export function getAllProfiles(): PatientProfile[] {
  if (typeof window === "undefined") return INITIAL_DEMO_PROFILES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw || raw === "[]") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_PROFILES));
      return INITIAL_DEMO_PROFILES;
    }
    const parsed = JSON.parse(raw) as PatientProfile[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_PROFILES));
      return INITIAL_DEMO_PROFILES;
    }
    return parsed;
  } catch (err) {
    console.error("Failed to read patient profiles from localStorage", err);
    return INITIAL_DEMO_PROFILES;
  }
}

export function getProfilesForPhone(phone?: string): PatientProfile[] {
  const all = getAllProfiles();
  if (!phone) return all;
  const normalizedPhone = phone.replace(/\s+/g, "");
  const filtered = all.filter((p) => p.phone.replace(/\s+/g, "") === normalizedPhone);
  // If no profiles found for this specific phone, return all profiles so user always sees the list
  return filtered.length > 0 ? filtered : all;
}

export function saveProfile(profile: Omit<PatientProfile, "id" | "createdAt">): PatientProfile {
  const all = getAllProfiles();
  const newProfile: PatientProfile = {
    ...profile,
    id: `pat_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
  };

  const updated = [newProfile, ...all];
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to save patient profile to localStorage", err);
    }
  }
  return newProfile;
}

export function deleteProfile(id: string): PatientProfile[] {
  const all = getAllProfiles();
  const filtered = all.filter((p) => p.id !== id);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (err) {
      console.error("Failed to remove patient profile from localStorage", err);
    }
  }
  return filtered;
}

export function seedDemoProfiles(phone: string = DEFAULT_PHONE): PatientProfile[] {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_PROFILES));
    } catch {}
  }
  return INITIAL_DEMO_PROFILES;
}

export function clearProfilesForPhone(phone?: string): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    } catch {}
  }
}
