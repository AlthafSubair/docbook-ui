export interface Doctor {
  id: string;
  clinicId: string;
  name: string;
  degree: string;
  specialty: string;
  experience: string;
  rating: number;
  reviewsCount: number;
  consultationFee: number;
  nextSlot: string;
  tokenNumber: string;
  languages: string[];
  slots: string[];
  about: string;
  availableToday: boolean;
}

export interface Clinic {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviewsCount: number;
  address: string;
  distance: string;
  openStatus: string;
  availableDoctors: number;
  phone: string;
  about: string;
}

export const CLINICS: Clinic[] = [
  {
    id: "cl_1",
    name: "DocBook City Health Clinic",
    specialty: "Multi-Specialty Care",
    rating: 4.9,
    reviewsCount: 320,
    address: "MG Road, Central Junction, Kochi",
    distance: "1.2 km away",
    openStatus: "Open until 8:00 PM",
    availableDoctors: 4,
    phone: "+91 98765 43210",
    about: "Comprehensive multi-specialty healthcare facility offering expert consultation, diagnostic labs, and preventive wellness checks.",
  },
  {
    id: "cl_2",
    name: "Lotus Wellness & Specialty Care",
    specialty: "Pediatrics & Family Care",
    rating: 4.8,
    reviewsCount: 215,
    address: "Park Avenue, Near Metro Station, Kochi",
    distance: "2.4 km away",
    openStatus: "Open 24/7",
    availableDoctors: 3,
    phone: "+91 98765 43211",
    about: "Dedicated family healthcare and pediatric specialty clinic focused on compassionate child care and family medicine.",
  },
  {
    id: "cl_3",
    name: "Apex Heart & Vascular Institute",
    specialty: "Cardiology & Diagnostics",
    rating: 4.9,
    reviewsCount: 410,
    address: "Civil Lines, Health Hub Complex, Kochi",
    distance: "3.8 km away",
    openStatus: "Open until 9:30 PM",
    availableDoctors: 3,
    phone: "+91 98765 43212",
    about: "Premier center for advanced cardiology, ECG/Echo diagnostics, and preventive vascular care led by senior specialists.",
  },
];

export const DOCTORS: Doctor[] = [
  // Doctors for cl_1
  {
    id: "doc_1",
    clinicId: "cl_1",
    name: "Dr. Ananya Sharma",
    degree: "MBBS, MD (Internal Medicine)",
    specialty: "General Physician",
    experience: "12 yrs experience",
    rating: 4.9,
    reviewsCount: 184,
    consultationFee: 400,
    nextSlot: "Today at 10:30 AM",
    tokenNumber: "Token #14",
    languages: ["English", "Hindi", "Malayalam"],
    availableToday: true,
    slots: ["10:30 AM", "11:15 AM", "02:00 PM", "04:30 PM", "05:45 PM"],
    about: "Specialist in preventive health, diabetes management, fever diagnostics, and lifestyle diseases with over a decade of clinical excellence.",
  },
  {
    id: "doc_2",
    clinicId: "cl_1",
    name: "Dr. Rahul Menon",
    degree: "MBBS, MD, DM (Cardiology)",
    specialty: "Cardiologist",
    experience: "15 yrs experience",
    rating: 4.8,
    reviewsCount: 142,
    consultationFee: 600,
    nextSlot: "Today at 03:00 PM",
    tokenNumber: "Token #08",
    languages: ["English", "Malayalam"],
    availableToday: true,
    slots: ["03:00 PM", "03:45 PM", "04:30 PM", "06:00 PM"],
    about: "Consultant cardiologist experienced in hypertension, preventative cardiology, echocardiography, and cardiac rehabilitation.",
  },
  {
    id: "doc_3",
    clinicId: "cl_1",
    name: "Dr. Priya Nair",
    degree: "MBBS, DCH (Pediatrics)",
    specialty: "Pediatrician",
    experience: "9 yrs experience",
    rating: 4.9,
    reviewsCount: 120,
    consultationFee: 450,
    nextSlot: "Tomorrow at 10:00 AM",
    tokenNumber: "Token #04",
    languages: ["English", "Hindi", "Malayalam"],
    availableToday: false,
    slots: ["10:00 AM", "11:00 AM", "01:30 PM", "03:00 PM"],
    about: "Caring child specialist focusing on newborn care, vaccinations, seasonal viral management, and childhood nutrition.",
  },
  {
    id: "doc_4",
    clinicId: "cl_1",
    name: "Dr. Arjun Varma",
    degree: "MBBS, MS (Orthopedics)",
    specialty: "Orthopedic Surgeon",
    experience: "14 yrs experience",
    rating: 4.8,
    reviewsCount: 96,
    consultationFee: 550,
    nextSlot: "Today at 05:00 PM",
    tokenNumber: "Token #19",
    languages: ["English", "Malayalam", "Tamil"],
    availableToday: true,
    slots: ["05:00 PM", "05:30 PM", "06:15 PM", "07:00 PM"],
    about: "Specialized in joint pain, sports injuries, fracture management, arthritis relief, and post-operative mobility rehabilitation.",
  },

  // Doctors for cl_2
  {
    id: "doc_5",
    clinicId: "cl_2",
    name: "Dr. Elena Rostova",
    degree: "MD (Pediatrics), Fellowship in Neonatology",
    specialty: "Senior Pediatrician",
    experience: "11 yrs experience",
    rating: 4.9,
    reviewsCount: 210,
    consultationFee: 500,
    nextSlot: "Today at 11:30 AM",
    tokenNumber: "Token #06",
    languages: ["English", "Hindi"],
    availableToday: true,
    slots: ["11:30 AM", "12:15 PM", "02:30 PM", "04:00 PM"],
    about: "Expert in newborn development, pediatric asthma, allergy care, and immunization programs.",
  },
  {
    id: "doc_6",
    clinicId: "cl_2",
    name: "Dr. Vikram Das",
    degree: "MBBS, MD (Family Medicine)",
    specialty: "Family Physician",
    experience: "8 yrs experience",
    rating: 4.8,
    reviewsCount: 135,
    consultationFee: 400,
    nextSlot: "Today at 04:15 PM",
    tokenNumber: "Token #11",
    languages: ["English", "Hindi", "Malayalam"],
    availableToday: true,
    slots: ["04:15 PM", "05:00 PM", "06:00 PM", "07:15 PM"],
    about: "Dedicated family doctor providing holistic care for acute infections, geriatric health, and lifestyle monitoring.",
  },
  {
    id: "doc_7",
    clinicId: "cl_2",
    name: "Dr. Deepa George",
    degree: "MBBS, MD (DVL - Dermatology)",
    specialty: "Dermatologist",
    experience: "10 yrs experience",
    rating: 4.9,
    reviewsCount: 168,
    consultationFee: 550,
    nextSlot: "Tomorrow at 02:00 PM",
    tokenNumber: "Token #03",
    languages: ["English", "Malayalam"],
    availableToday: false,
    slots: ["02:00 PM", "02:45 PM", "03:30 PM", "04:30 PM"],
    about: "Specialist in dermatological skin health, acne treatments, allergic eczema, and clinical cosmetic dermatology.",
  },

  // Doctors for cl_3
  {
    id: "doc_8",
    clinicId: "cl_3",
    name: "Dr. Arvind Menon",
    degree: "MBBS, MD, DM (Chief Cardiologist)",
    specialty: "Senior Interventional Cardiologist",
    experience: "18 yrs experience",
    rating: 5.0,
    reviewsCount: 310,
    consultationFee: 800,
    nextSlot: "Today at 02:30 PM",
    tokenNumber: "Token #05",
    languages: ["English", "Malayalam", "Hindi"],
    availableToday: true,
    slots: ["02:30 PM", "03:15 PM", "04:30 PM", "05:45 PM"],
    about: "Renowned cardiologist with extensive expertise in coronary angiography, heart failure management, and lipid disorders.",
  },
  {
    id: "doc_9",
    clinicId: "cl_3",
    name: "Dr. Sneha Joseph",
    degree: "MBBS, DNB (Cardiology)",
    specialty: "Consultant Cardiologist",
    experience: "12 yrs experience",
    rating: 4.8,
    reviewsCount: 154,
    consultationFee: 700,
    nextSlot: "Today at 05:00 PM",
    tokenNumber: "Token #12",
    languages: ["English", "Malayalam"],
    availableToday: true,
    slots: ["05:00 PM", "05:45 PM", "06:30 PM", "07:15 PM"],
    about: "Focused on non-invasive cardiac imaging, preventive heart health for women, and arrhythmia assessment.",
  },
  {
    id: "doc_10",
    clinicId: "cl_3",
    name: "Dr. Harish Kumar",
    degree: "MBBS, MS, MCh (Vascular Specialist)",
    specialty: "Vascular & Thoracic Consultant",
    experience: "14 yrs experience",
    rating: 4.9,
    reviewsCount: 122,
    consultationFee: 650,
    nextSlot: "Tomorrow at 11:00 AM",
    tokenNumber: "Token #02",
    languages: ["English", "Hindi", "Malayalam"],
    availableToday: false,
    slots: ["11:00 AM", "12:00 PM", "03:00 PM", "04:00 PM"],
    about: "Expert in peripheral vascular disease, varicose vein therapy, and advanced cardiovascular diagnostic screening.",
  },
];

export function getClinicById(id: string): Clinic | undefined {
  return CLINICS.find((c) => c.id === id) || CLINICS[0];
}

export function getDoctorsByClinicId(clinicId: string): Doctor[] {
  const filtered = DOCTORS.filter((d) => d.clinicId === clinicId);
  return filtered.length > 0 ? filtered : DOCTORS.filter((d) => d.clinicId === "cl_1");
}
