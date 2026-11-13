import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ApiError } from "./client";
import { useAuthStore } from "@/lib/stores/authStore";
import type { PatientProfile } from "@/types/patient";

export interface CreatePatientPayload {
  fullName: string;
  dob: string;
  sex: "male" | "female" | "other" | string;
  relationship: "self" | "spouse" | "child" | "parent" | "sibling" | "other" | string;
  email?: string;
}

/**
 * Normalizes backend patient object fields so the UI always has consistent keys.
 */
export function normalizePatient(raw: Record<string, unknown>): PatientProfile {
  const rawRel = raw.relationship || raw.relation;
  const normalizedRel =
    typeof rawRel === "string" ? rawRel.toLowerCase() : "self";
  const patientId = String(
    raw.patientId ?? raw.patient_id ?? raw.id ?? raw._id ?? ""
  );

  return {
    id: patientId,
    phone: String(raw.phone || raw.phoneNumber || ""),
    full_name: String(raw.fullName || raw.full_name || raw.name || "Patient"),
    email: raw.email ? String(raw.email) : undefined,
    dob: raw.dob ? String(raw.dob) : raw.dateOfBirth ? String(raw.dateOfBirth) : undefined,
    sex: raw.sex ? String(raw.sex).toLowerCase() : raw.gender ? String(raw.gender).toLowerCase() : undefined,
    relationship: normalizedRel as PatientProfile["relationship"],
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
  const body: {
    fullName: string;
    dob: string;
    sex: string;
    relationship: string;
    email?: string;
  } = {
    fullName: payload.fullName,
    dob: payload.dob,
    sex: payload.sex.toLowerCase(),
    relationship: payload.relationship.toLowerCase(),
  };

  if (payload.email && payload.email.trim()) {
    body.email = payload.email.trim();
  }

  const response = await api.post<unknown>("/patients", body);
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

export interface UpdatePatientPayload {
  id: string;
  fullName: string;
  dob: string;
  sex: string;
  relationship: string;
  email?: string;
}

/**
 * Update an existing patient profile
 * PATCH or PUT /api/v1/patients/:id
 */
export async function updatePatient(payload: UpdatePatientPayload): Promise<PatientProfile> {
  const { id, ...rest } = payload;
  const body: {
    fullName: string;
    dob: string;
    sex: string;
    relationship: string;
    email?: string;
  } = {
    fullName: rest.fullName,
    dob: rest.dob,
    sex: rest.sex.toLowerCase(),
    relationship: rest.relationship.toLowerCase(),
  };

  if (rest.email && rest.email.trim()) {
    body.email = rest.email.trim();
  }

  let response;
  try {
    response = await api.patch<unknown>(`/patients/${id}`, body);
  } catch (err: unknown) {
    if (
      err &&
      typeof err === "object" &&
      "status" in err &&
      ((err as { status?: number }).status === 404 ||
        (err as { status?: number }).status === 405)
    ) {
      response = await api.put<unknown>(`/patients/${id}`, body);
    } else {
      throw err;
    }
  }

  const data = response.data;
  const rawObj =
    data && typeof data === "object" && "data" in data && typeof (data as Record<string, unknown>).data === "object"
      ? (data as Record<string, unknown>).data
      : data;
  return normalizePatient(rawObj as Record<string, unknown>);
}

/**
 * TanStack Query Mutation hook to update a patient profile
 */
export function useUpdatePatient() {
  const queryClient = useQueryClient();
  return useMutation<PatientProfile, ApiError, UpdatePatientPayload>({
    mutationFn: updatePatient,
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

