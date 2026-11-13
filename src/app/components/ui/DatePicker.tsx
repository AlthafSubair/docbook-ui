"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
} from "lucide-react";

export interface DatePickerProps {
  label?: string;
  value?: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  error?: string;
  maxDate?: string; // YYYY-MM-DD
  minDate?: string; // YYYY-MM-DD
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const SHORT_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const SHORT_WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function parseISODate(isoStr?: string): { year: number; month: number; day: number } | null {
  if (!isoStr) return null;
  const parts = isoStr.split("-");
  if (parts.length !== 3) return null;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // 0-based
  const day = parseInt(parts[2], 10);
  if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
  return { year, month, day };
}

function formatDisplayDate(isoStr?: string): string {
  if (!isoStr) return "";
  const parsed = parseISODate(isoStr);
  if (!parsed) return "";
  const date = new Date(parsed.year, parsed.month, parsed.day);
  if (isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function calculateAge(isoStr?: string): string | null {
  if (!isoStr) return null;
  const parsed = parseISODate(isoStr);
  if (!parsed) return null;

  const today = new Date();
  let age = today.getFullYear() - parsed.year;
  const m = today.getMonth() - parsed.month;
  if (m < 0 || (m === 0 && today.getDate() < parsed.day)) {
    age--;
  }
  return age >= 0 ? `${age} yrs` : null;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value = "",
  onChange,
  error,
  maxDate,
  minDate,
  placeholder = "Select date of birth",
  disabled = false,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [placement, setPlacement] = useState<"bottom" | "top">("bottom");
  const [viewMode, setViewMode] = useState<"days" | "months" | "years">("days");

  const containerRef = useRef<HTMLDivElement>(null);

  // Today reference
  const today = useMemo(() => new Date(), []);
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDate = today.getDate();
  const todayISO = `${todayYear}-${String(todayMonth + 1).padStart(2, "0")}-${String(todayDate).padStart(2, "0")}`;

  const resolvedMax = maxDate || todayISO;

  // Selected date components
  const selectedParsed = useMemo(() => parseISODate(value), [value]);

  // View year and month state for calendar navigation
  const [viewYear, setViewYear] = useState(() => selectedParsed?.year ?? todayYear);
  const [viewMonth, setViewMonth] = useState(() => selectedParsed?.month ?? todayMonth);

  // Year page start for 12-year grid (e.g. 2016 - 2027)
  const [yearPageStart, setYearPageStart] = useState(() => {
    const y = selectedParsed?.year ?? todayYear;
    return y - (y % 12);
  });

  // Sync view during render when value changes from outside (e.g. edit mode reset)
  const [prevValue, setPrevValue] = useState(value);
  if (value !== prevValue) {
    setPrevValue(value);
    if (selectedParsed) {
      setViewYear(selectedParsed.year);
      setViewMonth(selectedParsed.month);
      setYearPageStart(selectedParsed.year - (selectedParsed.year % 12));
    }
  }

  // Calculate whether popover should open upwards or downwards based on viewport space
  const updatePlacement = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const popoverHeight = 360; // Approximate popup height
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    if (spaceBelow < popoverHeight && spaceAbove > spaceBelow) {
      setPlacement("top");
    } else {
      setPlacement("bottom");
    }
  }, []);

  const handleToggle = () => {
    if (disabled) return;
    if (!isOpen) {
      updatePlacement();
      setViewMode("days");
      if (selectedParsed) {
        setViewYear(selectedParsed.year);
        setViewMonth(selectedParsed.month);
        setYearPageStart(selectedParsed.year - (selectedParsed.year % 12));
      }
    }
    setIsOpen((prev) => !prev);
  };

  // Close popup on outside click or escape
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    function handleScrollOrResize() {
      updatePlacement();
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleScrollOrResize);
    window.addEventListener("scroll", handleScrollOrResize, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleScrollOrResize);
      window.removeEventListener("scroll", handleScrollOrResize, true);
    };
  }, [isOpen, updatePlacement]);

  // Calculate calendar grid days
  const calendarDays = useMemo(() => {
    const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay(); // 0 = Sunday
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    // Previous month padding
    const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();
    const leadingDays: { day: number; isCurrentMonth: boolean; iso: string }[] = [];
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      const m = viewMonth === 0 ? 12 : viewMonth;
      const y = viewMonth === 0 ? viewYear - 1 : viewYear;
      leadingDays.push({
        day: d,
        isCurrentMonth: false,
        iso: `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
      });
    }

    // Current month days
    const currentMonthDays: { day: number; isCurrentMonth: boolean; iso: string }[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      currentMonthDays.push({
        day: d,
        isCurrentMonth: true,
        iso: `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
      });
    }

    // Trailing days to fill standard 35 or 42 grid slots
    const totalSlots = leadingDays.length + currentMonthDays.length <= 35 ? 35 : 42;
    const trailingCount = totalSlots - (leadingDays.length + currentMonthDays.length);
    const trailingDays: { day: number; isCurrentMonth: boolean; iso: string }[] = [];
    for (let d = 1; d <= trailingCount; d++) {
      const m = viewMonth === 11 ? 1 : viewMonth + 2;
      const y = viewMonth === 11 ? viewYear + 1 : viewYear;
      trailingDays.push({
        day: d,
        isCurrentMonth: false,
        iso: `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
      });
    }

    return [...leadingDays, ...currentMonthDays, ...trailingDays];
  }, [viewYear, viewMonth]);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (resolvedMax) {
      const nextMonthDate = new Date(viewYear, viewMonth + 1, 1);
      const maxDateObj = new Date(resolvedMax);
      if (nextMonthDate > maxDateObj && nextMonthDate.getMonth() !== maxDateObj.getMonth()) {
        return;
      }
    }

    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  const isDateDisabled = (isoStr: string) => {
    if (resolvedMax && isoStr > resolvedMax) return true;
    if (minDate && isoStr < minDate) return true;
    return false;
  };

  const isMonthDisabled = (year: number, monthIdx: number) => {
    if (!resolvedMax) return false;
    const maxDateObj = new Date(resolvedMax);
    if (year > maxDateObj.getFullYear()) return true;
    if (year === maxDateObj.getFullYear() && monthIdx > maxDateObj.getMonth()) return true;
    return false;
  };

  const isYearDisabled = (year: number) => {
    if (!resolvedMax) return false;
    const maxYear = new Date(resolvedMax).getFullYear();
    return year > maxYear;
  };

  const handleSelectDate = (isoStr: string) => {
    if (isDateDisabled(isoStr)) return;
    onChange(isoStr);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
  };

  const displayFormatted = formatDisplayDate(value);
  const age = calculateAge(value);

  // Field container styling
  const fieldBorderStyles = error
    ? "border-red-500 shadow-[0_2px_8px_rgba(239,68,68,0.25)] hover:border-red-600 focus-within:border-red-500"
    : isOpen
      ? "border-primary shadow-[0_0_0_3px_rgba(0,0,255,0.2)]"
      : "border-primary/50 shadow-[0_2px_8px_rgba(0,0,255,0.25)] hover:border-primary hover:shadow-[0_2px_8px_rgba(0,0,255,0.3)]";

  // Years in the current 12-year window
  const visibleYears = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => yearPageStart + i);
  }, [yearPageStart]);

  return (
    <div ref={containerRef} className={`relative flex flex-col gap-2 ${className}`.trim()}>
      {/* Label */}
      {label && (
        <label className="text-sm font-semibold text-slate-700 select-none">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={handleToggle}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className={`w-full h-12 px-3.5 rounded-xl border-2 bg-white flex items-center justify-between gap-2.5 transition-all duration-200 cursor-pointer outline-none select-none text-left ${fieldBorderStyles} ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {/* Left: Icon & Display Value */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <CalendarIcon className="size-5 text-primary shrink-0" />

          {value ? (
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-sm font-semibold text-slate-900 truncate">
                {displayFormatted}
              </span>
              {age && (
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded-md bg-blue-50 text-primary shrink-0">
                  {age}
                </span>
              )}
            </div>
          ) : (
            <span className="text-sm text-tertiary-text font-normal truncate">
              {placeholder}
            </span>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {value && !disabled && (
            <span
              role="button"
              tabIndex={0}
              onClick={handleClear}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.stopPropagation();
                  onChange("");
                }
              }}
              title="Clear date"
              className="p-1 rounded-full text-slate-400 hover:text-red-500 hover:bg-slate-100 transition-colors"
            >
              <X className="size-3.5" />
            </span>
          )}
          <ChevronDown
            className={`size-4 text-slate-400 transition-transform duration-200 ${
              isOpen ? "rotate-180 text-primary" : ""
            }`}
          />
        </div>
      </button>

      {/* Validation error message */}
      {error && (
        <p className="text-sm text-red-600 animate-in fade-in duration-150">
          {error}
        </p>
      )}

      {/* Floating Modern Datepicker Popover */}
      {isOpen && (
        <div
          className={`absolute left-0 z-50 w-76 sm:w-80 rounded-2xl bg-white border-2 border-primary/20 shadow-[0_12px_36px_rgba(0,0,255,0.18),0_4px_16px_rgba(0,0,0,0.08)] p-3.5 animate-in fade-in zoom-in-95 duration-150 select-none ${
            placement === "top" ? "bottom-full mb-2" : "top-full mt-2"
          }`}
        >
          {/* ======================================================== */}
          {/* TOP CARDS: EXACTLY 2 CARDS AT A TIME (COMPACT)           */}
          {/* If on Date view -> shows Month card & Year card           */}
          {/* If on Month view -> shows Date card & Year card           */}
          {/* If on Year view  -> shows Date card & Month card          */}
          {/* ======================================================== */}
          <div className="grid grid-cols-2 gap-2 mb-2.5">
            {/* 1. Date View Active: show Month & Year cards */}
            {viewMode === "days" && (
              <>
                <button
                  type="button"
                  onClick={() => setViewMode("months")}
                  className="h-10 px-2.5 rounded-xl transition-all duration-150 flex flex-col items-center justify-center text-center bg-white hover:bg-primary/5 text-slate-800 border border-primary/30 hover:border-primary shadow-2xs hover:shadow-xs active:scale-[0.98] cursor-pointer select-none group"
                >
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold group-hover:text-primary transition-colors leading-none">
                    Month
                  </span>
                  <span className="text-xs font-bold text-slate-900 group-hover:text-primary transition-colors truncate leading-tight mt-0.5">
                    {MONTH_NAMES[viewMonth]}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setYearPageStart(viewYear - (viewYear % 12));
                    setViewMode("years");
                  }}
                  className="h-10 px-2.5 rounded-xl transition-all duration-150 flex flex-col items-center justify-center text-center bg-white hover:bg-primary/5 text-slate-800 border border-primary/30 hover:border-primary shadow-2xs hover:shadow-xs active:scale-[0.98] cursor-pointer select-none group"
                >
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold group-hover:text-primary transition-colors leading-none">
                    Year
                  </span>
                  <span className="text-xs font-bold text-slate-900 group-hover:text-primary transition-colors truncate leading-tight mt-0.5">
                    {viewYear}
                  </span>
                </button>
              </>
            )}

            {/* 2. Month View Active: show Date & Year cards */}
            {viewMode === "months" && (
              <>
                <button
                  type="button"
                  onClick={() => setViewMode("days")}
                  className="h-10 px-2.5 rounded-xl transition-all duration-150 flex flex-col items-center justify-center text-center bg-white hover:bg-primary/5 text-slate-800 border border-primary/30 hover:border-primary shadow-2xs hover:shadow-xs active:scale-[0.98] cursor-pointer select-none group"
                >
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold group-hover:text-primary transition-colors leading-none">
                    Date
                  </span>
                  <span className="text-xs font-bold text-slate-900 group-hover:text-primary transition-colors truncate leading-tight mt-0.5">
                    {selectedParsed ? selectedParsed.day : todayDate}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setYearPageStart(viewYear - (viewYear % 12));
                    setViewMode("years");
                  }}
                  className="h-10 px-2.5 rounded-xl transition-all duration-150 flex flex-col items-center justify-center text-center bg-white hover:bg-primary/5 text-slate-800 border border-primary/30 hover:border-primary shadow-2xs hover:shadow-xs active:scale-[0.98] cursor-pointer select-none group"
                >
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold group-hover:text-primary transition-colors leading-none">
                    Year
                  </span>
                  <span className="text-xs font-bold text-slate-900 group-hover:text-primary transition-colors truncate leading-tight mt-0.5">
                    {viewYear}
                  </span>
                </button>
              </>
            )}

            {/* 3. Year View Active: show Date & Month cards */}
            {viewMode === "years" && (
              <>
                <button
                  type="button"
                  onClick={() => setViewMode("days")}
                  className="h-10 px-2.5 rounded-xl transition-all duration-150 flex flex-col items-center justify-center text-center bg-white hover:bg-primary/5 text-slate-800 border border-primary/30 hover:border-primary shadow-2xs hover:shadow-xs active:scale-[0.98] cursor-pointer select-none group"
                >
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold group-hover:text-primary transition-colors leading-none">
                    Date
                  </span>
                  <span className="text-xs font-bold text-slate-900 group-hover:text-primary transition-colors truncate leading-tight mt-0.5">
                    {selectedParsed ? selectedParsed.day : todayDate}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode("months")}
                  className="h-10 px-2.5 rounded-xl transition-all duration-150 flex flex-col items-center justify-center text-center bg-white hover:bg-primary/5 text-slate-800 border border-primary/30 hover:border-primary shadow-2xs hover:shadow-xs active:scale-[0.98] cursor-pointer select-none group"
                >
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold group-hover:text-primary transition-colors leading-none">
                    Month
                  </span>
                  <span className="text-xs font-bold text-slate-900 group-hover:text-primary transition-colors truncate leading-tight mt-0.5">
                    {MONTH_NAMES[viewMonth]}
                  </span>
                </button>
              </>
            )}
          </div>

          {/* ======================================================== */}
          {/* VIEW 1: DAYS VIEW                                        */}
          {/* ======================================================== */}
          {viewMode === "days" && (
            <>
              {/* Sub-Header: Month & Year Navigator */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800 px-1">
                  {MONTH_NAMES[viewMonth]} {viewYear}
                </span>

                {/* Prev / Next Month arrows */}
                <div className="flex items-center gap-0.5">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    title="Previous month"
                    className="size-7 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-primary transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    title="Next month"
                    className="size-7 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-primary transition-colors cursor-pointer"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>

              {/* Weekday Labels */}
              <div className="grid grid-cols-7 gap-1 pt-2 pb-1 text-center">
                {SHORT_WEEKDAYS.map((wd) => (
                  <span
                    key={wd}
                    className="text-[11px] font-bold text-slate-400 uppercase tracking-wider"
                  >
                    {wd}
                  </span>
                ))}
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((item, index) => {
                  const isSelected = value
                    ? value === item.iso
                    : selectedParsed
                      ? selectedParsed.day === item.day &&
                        viewMonth === selectedParsed.month &&
                        viewYear === selectedParsed.year
                      : false;
                  const isToday = todayISO === item.iso;
                  const disabledDay = isDateDisabled(item.iso);

                  let buttonStyles =
                    "text-slate-700 hover:bg-primary/10 hover:text-primary font-medium";

                  if (!item.isCurrentMonth) {
                    buttonStyles = "text-slate-300 font-normal hover:bg-slate-50";
                  }

                  if (disabledDay) {
                    buttonStyles =
                      "text-slate-200 cursor-not-allowed opacity-35 hover:bg-transparent";
                  }

                  if (isSelected) {
                    buttonStyles =
                      "bg-[image:var(--button-gradient)] text-white font-bold shadow-md shadow-primary/30 hover:opacity-95 scale-[1.05]";
                  } else if (isToday && item.isCurrentMonth) {
                    buttonStyles += " ring-1.5 ring-primary/50 font-bold text-primary";
                  }

                  return (
                    <button
                      key={`${item.iso}-${index}`}
                      type="button"
                      disabled={disabledDay}
                      onClick={() => handleSelectDate(item.iso)}
                      className={`size-8.5 rounded-lg text-xs flex items-center justify-center transition-all cursor-pointer ${buttonStyles}`}
                    >
                      {item.day}
                    </button>
                  );
                })}
              </div>

              {/* Quick Footer */}
              <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-100 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setViewYear(todayYear);
                    setViewMonth(todayMonth);
                  }}
                  className="text-slate-500 hover:text-primary font-semibold transition-colors cursor-pointer"
                >
                  Current Month
                </button>

                {value && (
                  <button
                    type="button"
                    onClick={() => {
                      onChange("");
                      setIsOpen(false);
                    }}
                    className="text-red-500 hover:text-red-600 font-semibold transition-colors cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
            </>
          )}

          {/* ======================================================== */}
          {/* VIEW 2: MONTHS VIEW (In-Popup Selection with Gradient)   */}
          {/* ======================================================== */}
          {viewMode === "months" && (
            <div className="flex flex-col gap-2">
              {/* Sub-Header: Year navigation */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800 px-1">
                  Select Month ({viewYear})
                </span>

                <div className="flex items-center gap-0.5">
                  <button
                    type="button"
                    onClick={() => setViewYear((prev) => prev - 1)}
                    className="size-7 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-primary transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <button
                    type="button"
                    disabled={isYearDisabled(viewYear + 1)}
                    onClick={() => setViewYear((prev) => prev + 1)}
                    className="size-7 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-primary disabled:opacity-30 cursor-pointer transition-colors"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>

              {/* 3x4 Grid of Months */}
              <div className="grid grid-cols-3 gap-2 py-1">
                {SHORT_MONTHS.map((monthName, idx) => {
                  const isSelectedMonth = viewMonth === idx;
                  const disabledMonth = isMonthDisabled(viewYear, idx);

                  let buttonStyles =
                    "bg-slate-50 text-slate-700 hover:bg-primary/10 hover:text-primary hover:border-primary/40 border border-slate-200/70 font-semibold";

                  if (disabledMonth) {
                    buttonStyles =
                      "bg-slate-50/50 text-slate-300 border-slate-100 cursor-not-allowed opacity-35";
                  } else if (isSelectedMonth) {
                    buttonStyles =
                      "bg-[image:var(--button-gradient)] text-white font-bold border-transparent shadow-md shadow-primary/30 hover:opacity-95 scale-[1.02]";
                  }

                  return (
                    <button
                      key={monthName}
                      type="button"
                      disabled={disabledMonth}
                      onClick={() => {
                        setViewMonth(idx);
                        setViewMode("days"); // Flows to Date selection
                      }}
                      className={`h-11 rounded-xl text-xs flex items-center justify-center transition-all cursor-pointer ${buttonStyles}`}
                    >
                      {monthName}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW 3: YEARS VIEW (In-Popup Selection with Gradient)    */}
          {/* ======================================================== */}
          {viewMode === "years" && (
            <div className="flex flex-col gap-2">
              {/* Sub-Header: Year Range & Page Step */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800 px-1">
                  Select Year ({yearPageStart} – {yearPageStart + 11})
                </span>

                <div className="flex items-center gap-0.5">
                  <button
                    type="button"
                    onClick={() => setYearPageStart((prev) => prev - 12)}
                    className="size-7 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-primary transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <button
                    type="button"
                    disabled={isYearDisabled(yearPageStart + 12)}
                    onClick={() => setYearPageStart((prev) => prev + 12)}
                    className="size-7 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-primary disabled:opacity-30 cursor-pointer transition-colors"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>

              {/* 3x4 Grid of Years */}
              <div className="grid grid-cols-3 gap-2 py-1">
                {visibleYears.map((yr) => {
                  const isSelectedYear = viewYear === yr;
                  const disabledYear = isYearDisabled(yr);

                  let buttonStyles =
                    "bg-slate-50 text-slate-700 hover:bg-primary/10 hover:text-primary hover:border-primary/40 border border-slate-200/70 font-semibold";

                  if (disabledYear) {
                    buttonStyles =
                      "bg-slate-50/50 text-slate-300 border-slate-100 cursor-not-allowed opacity-35";
                  } else if (isSelectedYear) {
                    buttonStyles =
                      "bg-[image:var(--button-gradient)] text-white font-bold border-transparent shadow-md shadow-primary/30 hover:opacity-95 scale-[1.02]";
                  }

                  return (
                    <button
                      key={yr}
                      type="button"
                      disabled={disabledYear}
                      onClick={() => {
                        setViewYear(yr);
                        setViewMode("months"); // Year selected -> automatically moves to Month!
                      }}
                      className={`h-11 rounded-xl text-xs flex items-center justify-center transition-all cursor-pointer ${buttonStyles}`}
                    >
                      {yr}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DatePicker;
