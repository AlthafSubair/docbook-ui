"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Star,
  Clock,
  Phone,
  Search,
  CheckCircle2,
  X,
  Stethoscope,
} from "lucide-react";

import { Title, Desc, Button } from "docbook-ui-package";
import { RelationshipBadge } from "@/app/components/ui/RelationshipBadge";
import { getClinicById, getDoctorsByClinicId, type Doctor } from "@/lib/clinicData";
import { usePatientStore } from "@/lib/stores/patientStore";
import { usePatients } from "@/lib/api/patients";

export default function ClinicDoctorsPage() {
  const router = useRouter();
  const params = useParams();
  const clinicId = (params?.id as string) || "cl_1";

  const clinic = useMemo(() => getClinicById(clinicId), [clinicId]);
  const doctors = useMemo(() => getDoctorsByClinicId(clinicId), [clinicId]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const selectedPatient = usePatientStore((s) => s.selectedPatient);
  const setSelectedPatient = usePatientStore((s) => s.setSelectedPatient);
  const { data: apiPatients } = usePatients();

  // Booking Modal State
  const [activeBookingDoctor, setActiveBookingDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("Today");
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);

  useEffect(() => {
    // Fallback if no active patient is selected yet
    if (!selectedPatient && apiPatients && apiPatients.length > 0) {
      setSelectedPatient(apiPatients[0]);
    }
  }, [selectedPatient, apiPatients, setSelectedPatient]);

  // Derived specialties list
  const specialties = useMemo(() => {
    const list = ["All"];
    doctors.forEach((d) => {
      if (!list.includes(d.specialty)) list.push(d.specialty);
    });
    return list;
  }, [doctors]);

  // Filtered doctors
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const matchesSearch =
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.degree.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSpecialty =
        selectedSpecialty === "All" || doc.specialty === selectedSpecialty;

      return matchesSearch && matchesSpecialty;
    });
  }, [doctors, searchQuery, selectedSpecialty]);

  const handleOpenBooking = (doctor: Doctor) => {
    setActiveBookingDoctor(doctor);
    setSelectedSlot(doctor.slots[0] || "10:30 AM");
    setSelectedDate(doctor.availableToday ? "Today" : "Tomorrow");
    setBookingSuccess(false);
  };

  const handleConfirmBooking = () => {
    if (!activeBookingDoctor || !clinic) return;

    // Save appointment to storage so it shows in /bookings
    try {
      const newBooking = {
        id: `apt_${Date.now()}`,
        clinicName: clinic.name,
        doctorName: activeBookingDoctor.name,
        specialty: activeBookingDoctor.specialty,
        date: selectedDate === "Today" ? "Today, Nov 1" : "Tomorrow, Nov 2",
        time: selectedSlot,
        token: activeBookingDoctor.tokenNumber,
        status: "Confirmed",
        patient: selectedPatient ? `${selectedPatient.full_name} (${selectedPatient.relationship})` : "Self",
      };

      const existing = JSON.parse(localStorage.getItem("docbook_user_bookings") || "[]");
      localStorage.setItem("docbook_user_bookings", JSON.stringify([newBooking, ...existing]));
    } catch {}

    setBookingSuccess(true);
    setTimeout(() => {
      setActiveBookingDoctor(null);
      setBookingSuccess(false);
      router.push("/bookings");
    }, 1200);
  };

  if (!clinic) {
    return (
      <div className="flex flex-1 items-center justify-center p-12 text-slate-500">
        <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col w-full px-4 py-4 md:py-8 max-w-2xl mx-auto gap-5">
      {/* Top Back Link & Patient Indicator */}
      <div className="flex items-center justify-between gap-2">
        <Link
          href="/clinics"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline group"
        >
          <ArrowLeft className="size-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>All Clinics</span>
        </Link>

        {selectedPatient && (
          <Link
            href="/patients"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/5 border border-primary/20 text-[11px] font-semibold text-slate-800 hover:border-primary/50 transition-all"
            title="Switch Patient"
          >
            <span className="text-slate-500 font-normal">Patient:</span>
            <span className="font-bold text-primary truncate max-w-[100px]">{selectedPatient.full_name}</span>
            <RelationshipBadge relationship={selectedPatient.relationship} />
          </Link>
        )}
      </div>

      {/* Clinic Context Header Card */}
      <div className="rounded-2xl border-2 border-primary/40 bg-white p-4 shadow-[0_2px_8px_rgba(0,0,255,0.06)] flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-2xs">
              <Building2 className="size-6" />
            </div>

            <div className="flex flex-col">
              <h1 className="font-bold text-base md:text-lg text-slate-900 leading-snug">
                {clinic.name}
              </h1>
              <span className="text-xs text-primary font-semibold mt-0.5">
                {clinic.specialty}
              </span>
              <div className="flex items-center gap-1.5 text-[11px] text-tertiary-text mt-1">
                <MapPin className="size-3.5 text-primary shrink-0" />
                <span>{clinic.address}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg shrink-0">
            <Star className="size-3.5 fill-amber-500 text-amber-500" />
            <span>{clinic.rating}</span>
            <span className="text-[10px] text-slate-400 font-medium">({clinic.reviewsCount})</span>
          </div>
        </div>

        {/* Status bar & call action */}
        <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
            <Clock className="size-3.5" />
            <span>{clinic.openStatus}</span>
          </div>

          <a
            href={`tel:${clinic.phone}`}
            className="inline-flex items-center gap-1 font-bold text-primary hover:underline"
          >
            <Phone className="size-3.5" />
            <span>{clinic.phone}</span>
          </a>
        </div>
      </div>

      {/* Section Title & Search */}
      <div className="flex flex-col gap-1 pt-1">
        <Title className="text-xl md:text-2xl font-bold flex items-center gap-2">
          <span>Doctors in Clinic</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
            {filteredDoctors.length} available
          </span>
        </Title>
        <Desc className="text-xs md:text-sm text-secondary-text">
          Choose a qualified specialist and book your consultation token
        </Desc>
      </div>

      {/* Doctor Search input */}
      <div className="flex items-center gap-2.5 rounded-xl border-2 border-primary/40 bg-white px-3.5 py-2.5 shadow-[0_2px_8px_rgba(0,0,255,0.08)] focus-within:border-primary transition-all">
        <Search className="size-4 text-primary shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by doctor name or specialty..."
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

      {/* Specialty Filter Pills */}
      {specialties.length > 2 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
          {specialties.map((spec) => (
            <button
              key={spec}
              type="button"
              onClick={() => setSelectedSpecialty(spec)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedSpecialty === spec
                  ? "bg-[image:var(--button-gradient)] text-white shadow-xs"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              {spec}
            </button>
          ))}
        </div>
      )}

      {/* Doctors List */}
      <div className="flex flex-col gap-3.5">
        {filteredDoctors.length === 0 ? (
          <div className="text-center p-8 bg-white rounded-2xl border border-slate-200 text-secondary-text">
            <Stethoscope className="size-8 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-sm">No doctors match your search</p>
            <p className="text-xs text-tertiary-text mt-1">
              Try searching for another specialty or clear filters
            </p>
          </div>
        ) : (
          filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="rounded-2xl border-2 border-primary/40 bg-white p-4 shadow-[0_2px_8px_rgba(0,0,255,0.06)] hover:border-primary transition-all flex flex-col gap-3 group"
            >
              {/* Doctor Info Row */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  {/* Doctor Initial / Avatar Icon */}
                  <div className="size-12 rounded-xl bg-[image:var(--button-gradient)] text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                    {doc.name.replace("Dr. ", "").charAt(0)}
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-sm md:text-base text-slate-900 group-hover:text-primary transition-colors">
                        {doc.name}
                      </h3>
                    </div>

                    <span className="text-xs text-primary font-semibold mt-0.5">
                      {doc.specialty}
                    </span>

                    <span className="text-[11px] text-tertiary-text mt-0.5 font-medium">
                      {doc.degree} • {doc.experience}
                    </span>

                    <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
                      <span>Speaks: {doc.languages.join(", ")}</span>
                    </div>
                  </div>
                </div>

                {/* Rating Badge */}
                <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg shrink-0">
                  <Star className="size-3.5 fill-amber-500 text-amber-500" />
                  <span>{doc.rating}</span>
                </div>
              </div>

              {/* Bio summary */}
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                {doc.about}
              </p>

              {/* Fee, Availability & Booking CTA */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2.5 border-t border-slate-100">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
                    <Clock className="size-3.5" />
                    <span>{doc.nextSlot}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-emerald-50 text-emerald-700 font-extrabold border border-emerald-200">
                      {doc.tokenNumber}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-900 mt-0.5">
                    ₹{doc.consultationFee}{" "}
                    <span className="text-[11px] text-slate-400 font-normal">
                      Consultation Fee
                    </span>
                  </span>
                </div>

                <Button
                  type="button"
                  onClick={() => handleOpenBooking(doc)}
                  className="min-h-10 text-xs px-4 py-2 shrink-0 self-end sm:self-auto w-full sm:w-auto"
                >
                  Book Appointment
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Booking Slot Modal Drawer */}
      {activeBookingDoctor && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl border-2 border-primary/40 shadow-2xl p-5 flex flex-col gap-4 animate-in slide-in-from-bottom-8 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-primary uppercase tracking-wide">
                  Schedule Appointment
                </span>
                <h3 className="font-bold text-base text-slate-900">
                  {activeBookingDoctor.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveBookingDoctor(null)}
                className="size-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {bookingSuccess ? (
              <div className="flex flex-col items-center justify-center py-8 text-center gap-3">
                <div className="size-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center animate-in zoom-in duration-200">
                  <CheckCircle2 className="size-10" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">Appointment Confirmed!</h4>
                <p className="text-xs text-slate-500 max-w-xs">
                  Your token <strong>{activeBookingDoctor.tokenNumber}</strong> for {selectedSlot} has been booked. Redirecting to bookings...
                </p>
              </div>
            ) : (
              <>
                {/* Patient Context Confirmation */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 font-medium">Patient</span>
                    <span className="font-bold text-slate-900">
                      {selectedPatient ? selectedPatient.full_name : "Self"}
                    </span>
                  </div>
                  {selectedPatient && (
                    <RelationshipBadge relationship={selectedPatient.relationship} />
                  )}
                </div>

                {/* Day Selector */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700">Choose Day</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedDate("Today")}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        selectedDate === "Today"
                          ? "border-primary bg-primary/10 text-primary shadow-xs"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      Today (Nov 1)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedDate("Tomorrow")}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        selectedDate === "Tomorrow"
                          ? "border-primary bg-primary/10 text-primary shadow-xs"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      Tomorrow (Nov 2)
                    </button>
                  </div>
                </div>

                {/* Slots Grid */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-bold text-slate-700">Available Time Slots</label>
                    <span className="text-slate-400 font-medium">{activeBookingDoctor.tokenNumber}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {activeBookingDoctor.slots.map((slot: string) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          selectedSlot === slot
                            ? "bg-[image:var(--button-gradient)] text-white shadow-xs scale-102"
                            : "bg-white border border-slate-200 text-slate-700 hover:border-primary/50"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Summary & Confirm */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-medium">Pay at Clinic</span>
                    <span className="font-extrabold text-base text-slate-900">
                      ₹{activeBookingDoctor.consultationFee}
                    </span>
                  </div>

                  <Button
                    type="button"
                    onClick={handleConfirmBooking}
                    className="min-h-11 text-xs px-5 py-2.5"
                  >
                    Confirm Booking
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
