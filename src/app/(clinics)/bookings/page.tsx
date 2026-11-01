"use client";

import React from "react";
import Link from "next/link";
import { CalendarDays, Clock, MapPin, ChevronRight, CheckCircle2 } from "lucide-react";
import Title from "@/app/components/ui/Title";
import Desc from "@/app/components/ui/Desc";

export default function BookingsPage() {
  const appointments = [
    {
      id: "apt_1",
      clinicName: "DocBook City Health Clinic",
      doctorName: "Dr. Ananya Sharma",
      specialty: "General Physician",
      date: "Tomorrow, Nov 2",
      time: "10:30 AM",
      token: "A-14",
      status: "Confirmed",
      patient: "Althaf (Self)",
    },
    {
      id: "apt_2",
      clinicName: "Lotus Wellness & Specialty Care",
      doctorName: "Dr. Rahul Menon",
      specialty: "Pediatrician",
      date: "Wed, Nov 5",
      time: "04:15 PM",
      token: "P-08",
      status: "Confirmed",
      patient: "Ayaan (Child)",
    },
  ];

  return (
    <div className="flex flex-1 flex-col w-full px-4 py-4 md:py-8 max-w-2xl mx-auto gap-5">
      <div className="flex flex-col gap-1">
        <Title className="text-2xl md:text-3xl font-bold">My Bookings</Title>
        <Desc className="text-xs md:text-sm text-secondary-text">
          Manage upcoming appointments and check live token status
        </Desc>
      </div>

      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-semibold">
        <button className="text-primary border-b-2 border-primary pb-2 font-bold px-2">
          Upcoming (2)
        </button>
        <button className="text-slate-500 hover:text-slate-700 pb-2 px-2">
          Past
        </button>
      </div>

      <div className="flex flex-col gap-3.5">
        {appointments.map((apt) => (
          <div
            key={apt.id}
            className="rounded-2xl border-2 border-primary/40 bg-white p-4 shadow-[0_2px_8px_rgba(0,0,255,0.06)] hover:border-primary transition-all flex flex-col gap-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full w-fit">
                  Patient: {apt.patient}
                </span>
                <h3 className="font-bold text-sm text-slate-900 mt-2">
                  {apt.doctorName}
                </h3>
                <span className="text-xs text-slate-500">{apt.specialty}</span>
                <span className="text-xs text-slate-700 font-medium mt-1">
                  {apt.clinicName}
                </span>
              </div>

              <div className="text-right flex flex-col items-end">
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <CheckCircle2 className="size-3" />
                  {apt.status}
                </span>
                <span className="text-[11px] font-bold text-slate-500 mt-2">
                  Token: <strong className="text-slate-900">{apt.token}</strong>
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-3 text-slate-600">
                <span className="flex items-center gap-1 font-medium">
                  <CalendarDays className="size-3.5 text-primary" />
                  {apt.date}
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <Clock className="size-3.5 text-primary" />
                  {apt.time}
                </span>
              </div>

              <Link
                href="/clinics"
                className="font-bold text-primary hover:underline flex items-center gap-0.5"
              >
                <span>Details</span>
                <ChevronRight className="size-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
