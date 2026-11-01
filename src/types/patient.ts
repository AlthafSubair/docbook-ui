export interface PatientProfile {
  id: string;
  phone: string;
  full_name: string;
  email?: string;
  dob?: string;
  sex?: string;
  relationship?: "Self" | "Family" | "Spouse" | "Child" | "Parent" | "Friend" | "Other";
  createdAt: string;
}
