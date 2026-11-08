import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ApiError } from "./client";
import { useAuthStore } from "@/lib/stores/authStore";
import type { PatientProfile } from "@/types/patient";

export interface CreatePatientPayload {
  full_name: string;
  phone?: string;
  email?: string;
  dob?: string;
  sex?: string;
  relationship?: string;
}

/**
 * Normalizes backend patient object fields so the UI always has consistent keys.
 */
export function normalizePatient(raw: Record<string, unknown>): PatientProfile {
  return {
    id: String(raw.id || raw._id || ""),
    phone: String(raw.phone || raw.phoneNumber || ""),
    full_name: String(raw.full_name || raw.fullName || raw.name || "Patient"),
    email: raw.email ? String(raw.email) : undefined,
    dob: raw.dob ? String(raw.dob) : raw.dateOfBirth ? String(raw.dateOfBirth) : undefined,
    sex: raw.sex ? String(raw.sex) : raw.gender ? String(raw.gender) : undefined,
    relationship: (raw.relationship ? String(raw.relationship) : "Self") as PatientProfile["relationship"],
    createdAt: String(raw.createdAt || raw.created_at || new Date().toISOString()),
  };
}

/**
 * Fetch all patients for the authenticated user
 * GET /api/v1/patients
 */
export async function getPatients(): Promise<PatientProfile[]> {
  const response = await api.get<unknown>("/patients");
  const data = response.data;

  let rawList: unknown[] = [];
  if (Array.isArray(data)) {
    rawList = data;
  } else if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.data)) {
      rawList = obj.data;
    } else if (Array.isArray(obj.patients)) {
      rawList = obj.patients;
    }
  }

  return rawList.map((item) =>
    typeof item === "object" && item !== null
      ? normalizePatient(item as Record<string, unknown>)
      : (item as PatientProfile)
  );
}

/**
 * TanStack Query hook to fetch patient profiles
 */
export function usePatients() {
  const accessToken = useAuthStore((s) => s.accessToken);

  return useQuery<PatientProfile[], ApiError>({
    queryKey: ["patients"],
    queryFn: getPatients,
    enabled: Boolean(accessToken),
  });
}

/**
 * Create a new patient profile
 * POST /api/v1/patients
 */
export async function createPatient(payload: CreatePatientPayload): Promise<PatientProfile> {
  const response = await api.post<unknown>("/patients", payload);
  const data = response.data;
  const rawObj =
    data && typeof data === "object" && "data" in data && typeof (data as Record<string, unknown>).data === "object"
      ? (data as Record<string, unknown>).data
      : data;
  return normalizePatient(rawObj as Record<string, unknown>);
}

/**
 * TanStack Query Mutation hook to create a patient profile
 */
export function useCreatePatient() {
  const queryClient = useQueryClient();
  return useMutation<PatientProfile, ApiError, CreatePatientPayload>({
    mutationFn: createPatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });
}

/**
 * Delete a patient profile
 * DELETE /api/v1/patients/:id
 */
export async function deletePatient(id: string): Promise<unknown> {
  const response = await api.delete(`/patients/${id}`);
  return response.data;
}

/**
 * TanStack Query Mutation hook to delete a patient profile
 */
export function useDeletePatient() {
  const queryClient = useQueryClient();
  return useMutation<unknown, ApiError, string>({
    mutationFn: deletePatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });
}

