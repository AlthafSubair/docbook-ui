export enum PatientRelationship {
  SELF = "self",
  SPOUSE = "spouse",
  CHILD = "child",
  PARENT = "parent",
  SIBLING = "sibling",
  OTHER = "other",
}

export enum PatientSex {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}

export type PatientRelationshipType =
  | "self"
  | "spouse"
  | "child"
  | "parent"
  | "sibling"
  | "other";

export type PatientSexType = "male" | "female" | "other";

export interface PatientProfile {
  id: string;
  phone?: string;
  full_name: string;
  email?: string;
  dob?: string;
  sex?: PatientSexType | string;
  relationship?: PatientRelationshipType | string;
  createdAt: string;
}
