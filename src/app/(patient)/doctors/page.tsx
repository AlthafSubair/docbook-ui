"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { User, ArrowLeft, Calendar, Clock, Star, MapPin, Search } from "lucide-react";

import Title from "@/app/components/ui/Title";
import Desc from "@/app/components/ui/Desc";
import { RelationshipBadge } from "@/app/components/ui/RelationshipBadge";
import { PatientProfile } from "@/types/patient";
import { getAllProfiles } from "@/lib/patientStorage";

function DoctorsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const patientId = searchParams.get("patientId");

  const [selectedPatient, setSelectedPatient] = useState<PatientProfile | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (patientId) {
        const all = getAllProfiles();
        const found = all.find((p) => p.id === patientId);
        if (found) {
          setSelectedPatient(found);
          return;
        }
      }
      try {
        const raw = localStorage.getItem("docbook_selected_patient");
        if (raw) {
          setSelectedPatient(JSON.parse(raw));
        }
      } catch {}
    }
  }, [patientId]);

  const mockDoctors = [
    {
      id: "doc_1",
      name: "Dr. Sarah Jenkins",
      specialty: "General Physician",
      experience: "12 yrs exp",
      rating: 4.9,
      reviews: 142,
      hospital: "City Health Clinic",
      nextAvailable: "Today, 4:30 PM",
    },
    {
      id: "doc_2",
      name: "Dr. Arvind Menon",
      specialty: "Cardiologist",
      experience: "16 yrs exp",
      rating: 4.8,
      reviews: 98,
      hospital: "Apollo Specialty Hospital",
      nextAvailable: "Tomorrow, 10:00 AM",
    },
    {
      id: "doc_3",
      name: "Dr. Elena Rostova",
      specialty: "Pediatrician",
      experience: "9 yrs exp",
      rating: 4.9,
      reviews: 180,
      hospital: "Lotus Children's Care",
      nextAvailable: "Wed, 2:00 PM",
    },
  ];

  return (
    <div className="flex flex-1 flex-col w-full bg-slate-50/50 min-h-screen px-4 py-6 md:py-8">
      <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
        {/* Top Navigation & Selected Patient Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <Link
            href="/patients"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
          >
            <ArrowLeft className="size-4" />
            <span>Switch Patient Profile</span>
          </Link>

          {selectedPatient && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs text-xs">
              <span className="text-secondary-text">Booking for:</span>
              <span className="font-bold text-slate-900">{selectedPatient.full_name}</span>
              <RelationshipBadge relationship={selectedPatient.relationship} />
            </div>
          )}
        </div>

        {/* Page Header */}
        <div className="flex flex-col gap-1">
          <Title className="text-2xl md:text-3xl">Find Doctors</Title>
          <Desc className="text-xs md:text-sm">
            Book verified doctors and specialists for consultation
          </Desc>
        </div>

        {/* Search bar */}
        <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 shadow-xs">
          <Search className="size-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search doctors, specialties, or clinics..."
            className="flex-1 bg-transparent text-sm text-secondary-text outline-none placeholder:text-tertiary-text"
          />
        </div>

        {/* Doctors List */}
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-bold text-slate-800">Available Specialists</h2>
          <div className="flex flex-col gap-3">
            {mockDoctors.map((doc) => (
              <div
                key={doc.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs hover:border-primary/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="size-12 rounded-xl bg-primary/10 text-primary font-bold text-base flex items-center justify-center shrink-0">
                    {doc.name
                      .split(" ")[1]
                      ?.charAt(0)
                      .toUpperCase() || "DR"}
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-slate-900">{doc.name}</h3>
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md">
                        <Star className="size-3 fill-amber-500 text-amber-500" />
                        <span>{doc.rating}</span>
                      </div>
                    </div>

                    <span className="text-xs font-semibold text-primary mt-0.5">
                      {doc.specialty} • {doc.experience}
                    </span>

                    <div className="flex items-center gap-1 text-xs text-tertiary-text mt-1">
                      <MapPin className="size-3 shrink-0" />
                      <span>{doc.hospital}</span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                    <Clock className="size-3.5" />
                    <span>{doc.nextAvailable}</span>
                  </div>

                  <button
                    type="button"
                    className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Book Slot
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DoctorsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center p-8 text-secondary-text">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      <DoctorsContent />
    </Suspense>
  );
}
