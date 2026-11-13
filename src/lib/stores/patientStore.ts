import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { PatientProfile } from "@/types/patient";

interface PatientState {
  /** The currently selected patient profile */
  selectedPatient: PatientProfile | null;
  /** Sets the active patient profile and persists it */
  setSelectedPatient: (patient: PatientProfile | null) => void;
  /** Clears the active patient profile */
  clearSelectedPatient: () => void;
}

export const usePatientStore = create<PatientState>()(
  persist(
    (set) => ({
      selectedPatient: (() => {
        if (typeof window !== "undefined") {
          try {
            const raw = localStorage.getItem("docbook_selected_patient");
            if (raw) return JSON.parse(raw) as PatientProfile;
          } catch {}
        }
        return null;
      })(),

      setSelectedPatient: (patient: PatientProfile | null) => {
        try {
          if (patient) {
            const pId = patient.id;
            localStorage.setItem("docbook_selected_patient_id", pId);
            localStorage.setItem("docbook_selected_patient", JSON.stringify(patient));
          } else {
            localStorage.removeItem("docbook_selected_patient_id");
            localStorage.removeItem("docbook_selected_patient");
          }
        } catch {}

        set({ selectedPatient: patient });
      },

      clearSelectedPatient: () => {
        try {
          localStorage.removeItem("docbook_selected_patient_id");
          localStorage.removeItem("docbook_selected_patient");
        } catch {}

        set({ selectedPatient: null });
      },
    }),
    {
      name: "docbook_patient_storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

