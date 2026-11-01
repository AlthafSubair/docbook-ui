"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  Star,
  Clock,
  Phone,
  Building2,
  Stethoscope,
  ChevronRight,
  Filter,
} from "lucide-react";

import Title from "@/app/components/ui/Title";
import Desc from "@/app/components/ui/Desc";

interface Clinic {
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
}

const CATEGORIES = [
  "All",
  "General Medicine",
  "Dental",
  "Cardiology",
  "Pediatrics",
  "Dermatology",
  "Orthopedics",
];

const INITIAL_CLINICS: Clinic[] = [
  {
    id: "cl_1",
    name: "DocBook City Health Clinic",
    specialty: "Multi-Specialty Care",
    rating: 4.9,
    reviewsCount: 320,
    address: "MG Road, Central Junction",
    distance: "1.2 km away",
    openStatus: "Open until 8:00 PM",
    availableDoctors: 8,
    phone: "+91 98765 43210",
  },
  {
    id: "cl_2",
    name: "Lotus Wellness & Specialty Care",
    specialty: "Pediatrics & Family Care",
    rating: 4.8,
    reviewsCount: 215,
    address: "Park Avenue, Near Metro Station",
    distance: "2.4 km away",
    openStatus: "Open 24/7",
    availableDoctors: 5,
    phone: "+91 98765 43211",
  },
  {
    id: "cl_3",
    name: "Apex Heart & Vascular Institute",
    specialty: "Cardiology & Diagnostics",
    rating: 4.9,
    reviewsCount: 410,
    address: "Civil Lines, Health Hub Complex",
    distance: "3.8 km away",
    openStatus: "Open until 9:30 PM",
    availableDoctors: 12,
    phone: "+91 98765 43212",
  },
];

export default function ClinicsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredClinics = INITIAL_CLINICS.filter((clinic) => {
    const matchesSearch =
      clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clinic.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clinic.address.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      clinic.specialty.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-1 flex-col w-full px-4 py-4 md:py-8 max-w-2xl mx-auto gap-5">
      {/* Top Location Bar */}
      <div className="flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-secondary-text">
          <MapPin className="size-4 text-primary shrink-0" />
          <span className="font-semibold text-slate-800">Current Location:</span>
          <span className="text-primary font-medium hover:underline cursor-pointer">
            Kochi, Kerala
          </span>
        </div>
      </div>

      {/* Page Title & Desc */}
      <div className="flex flex-col gap-1">
        <Title className="text-2xl md:text-3xl font-bold">
          Find Clinics & Doctors
        </Title>
        <Desc className="text-xs md:text-sm text-secondary-text">
          Browse verified healthcare clinics, check timings, and book appointments
        </Desc>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2.5 rounded-xl border-2 border-primary/40 bg-white px-3.5 py-2.5 shadow-[0_2px_8px_rgba(0,0,255,0.08)] focus-within:border-primary transition-all">
        <Search className="size-4 text-primary shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search clinics, specialties, or locations..."
          className="flex-1 bg-transparent text-sm text-secondary-text outline-none placeholder:text-tertiary-text"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="text-xs text-slate-400 hover:text-slate-600 font-bold px-1"
          >
            Clear
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? "bg-[image:var(--button-gradient)] text-white shadow-xs"
                : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Clinics List Header */}
      <div className="flex items-center justify-between pt-1">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <span>Available Clinics</span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-semibold">
            {filteredClinics.length}
          </span>
        </h2>
      </div>

      {/* Clinics Cards */}
      <div className="flex flex-col gap-3.5">
        {filteredClinics.length === 0 ? (
          <div className="text-center p-8 bg-white rounded-2xl border border-slate-200 text-secondary-text">
            <Building2 className="size-8 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-sm">No clinics found</p>
            <p className="text-xs text-tertiary-text mt-1">
              Try adjusting your search query or filter
            </p>
          </div>
        ) : (
          filteredClinics.map((clinic) => (
            <div
              key={clinic.id}
              className="group rounded-2xl border-2 border-primary/40 bg-white p-4 shadow-[0_2px_8px_rgba(0,0,255,0.06)] hover:border-primary hover:shadow-md transition-all flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="size-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Building2 className="size-5" />
                  </div>

                  <div className="flex flex-col">
                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-primary transition-colors">
                      {clinic.name}
                    </h3>
                    <span className="text-xs text-primary font-medium mt-0.5">
                      {clinic.specialty}
                    </span>
                    <span className="text-[11px] text-tertiary-text mt-0.5">
                      {clinic.address} • {clinic.distance}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg shrink-0">
                  <Star className="size-3.5 fill-amber-500 text-amber-500" />
                  <span>{clinic.rating}</span>
                </div>
              </div>

              {/* Status and Action Row */}
              <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
                  <Clock className="size-3.5" />
                  <span>{clinic.openStatus}</span>
                </div>

                <Link
                  href={`/doctors?clinicId=${clinic.id}`}
                  className="inline-flex items-center gap-1 font-bold text-primary hover:underline"
                >
                  <span>{clinic.availableDoctors} Doctors Available</span>
                  <ChevronRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}