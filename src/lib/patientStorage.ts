import { PatientProfile } from "@/types/patient";

const STORAGE_KEY = "docbook_patient_profiles";

export function getAllProfiles(): PatientProfile[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PatientProfile[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Failed to read patient profiles from localStorage", err);
    return [];
  }
}

export function getProfilesForPhone(phone?: string): PatientProfile[] {
  const all = getAllProfiles();
  if (!phone) return all;
  const normalizedPhone = phone.replace(/\s+/g, "");
  const filtered = all.filter((p) => (p.phone || "").replace(/\s+/g, "") === normalizedPhone);
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

export function clearProfiles(): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    } catch {}
  }
}
