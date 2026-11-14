"use client";

import React from "react";
import Link from "next/link";
import { User, Phone, Shield, Bell, HelpCircle, LogOut, ChevronRight } from "lucide-react";
import { Title, Desc } from "docbook-ui-package";

export default function ProfilePage() {
  const menuItems = [
    { icon: Phone, label: "Linked Phone Number", value: "+91 98765 43210" },
    { icon: Bell, label: "Notifications & Reminders", value: "Enabled" },
    { icon: Shield, label: "Privacy & Medical Records", value: "Secure" },
    { icon: HelpCircle, label: "Help & Support", value: "" },
  ];

  return (
    <div className="flex flex-1 flex-col w-full px-4 py-4 md:py-8 max-w-2xl mx-auto gap-5">
      <div className="flex flex-col gap-1">
        <Title className="text-2xl md:text-3xl font-bold">Profile</Title>
        <Desc className="text-xs md:text-sm text-secondary-text">
          Account details, linked family accounts, and preferences
        </Desc>
      </div>

      {/* Profile Card */}
      <div className="rounded-2xl border-2 border-primary/40 bg-white p-4 shadow-[0_2px_8px_rgba(0,0,255,0.06)] flex items-center gap-4">
        <div className="size-14 rounded-full border-2 border-teal-400 bg-teal-50 flex items-center justify-center text-teal-700">
          <User className="size-7" />
        </div>
        <div className="flex flex-col">
          <h2 className="font-bold text-base text-slate-900">Althaf Subair</h2>
          <span className="text-xs text-slate-500">+91 98765 43210</span>
          <span className="text-[11px] font-semibold text-emerald-600 mt-0.5">
            Verified Account
          </span>
        </div>
      </div>

      {/* Menu Settings */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs divide-y divide-slate-100">
        {menuItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors cursor-pointer text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                  <Icon className="size-4" />
                </div>
                <span className="font-medium text-slate-800">{item.label}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                {item.value && <span className="font-semibold text-slate-700">{item.value}</span>}
                <ChevronRight className="size-3.5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Logout button */}
      <Link
        href="/login"
        className="rounded-xl border border-rose-200 bg-rose-50/50 p-3 flex items-center justify-center gap-2 text-xs font-bold text-rose-600 hover:bg-rose-100 transition-colors"
      >
        <LogOut className="size-4" />
        <span>Log Out</span>
      </Link>
    </div>
  );
}
