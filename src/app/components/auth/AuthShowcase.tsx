import {
  Stethoscope,
  Clock,
  CalendarCheck,
  Users,
  Sparkles,
} from "lucide-react";

interface AuthShowcaseProps {
  className?: string;
}

export default function AuthShowcase({ className = "" }: AuthShowcaseProps) {
  return (
    <section
      className={`hidden lg:flex lg:w-1/2 xl:w-7/12 relative flex-col justify-between p-8 xl:p-12 lg:py-8 lg:px-10 xl:py-10 xl:px-14 bg-gradient-to-br from-primary to-primary-dark text-white overflow-hidden isolate lg:h-full ${className}`.trim()}
    >
      {/* Ambient background glows & pattern overlays using token colors */}
      <div className="absolute -top-32 -left-32 size-96 rounded-full bg-primary/25 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 size-96 rounded-full bg-primary-dark/35 blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Brand Header */}
      <div className="relative z-10 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="size-11 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-md shadow-black/10">
            <Stethoscope className="size-6 stroke-[2.3]" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-2xl tracking-tight text-white leading-none">
              Doc<span className="text-white/80">Book</span>
            </span>
            <span className="text-[11px] font-medium text-white/75 tracking-wider uppercase mt-1">
              Smart Clinic Appointments
            </span>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur-xs text-xs font-semibold text-white/90">
          <Sparkles className="size-3.5 text-white/90" />
          <span>Fast & Secure</span>
        </div>
      </div>

      {/* Hero Copy & Value Propositions */}
      <div className="relative z-10 my-auto py-4 xl:py-6 max-w-xl">
        <h2 className="text-2xl lg:text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-tight">
          Healthcare appointments made simple, fast & stress-free.
        </h2>

        <p className="mt-3 xl:mt-4 text-sm lg:text-base xl:text-lg text-white/85 leading-relaxed font-normal">
          Skip the crowded clinic waiting rooms. Book verified doctors, track your live token status, and take care of your entire family in one place.
        </p>

        {/* Highlights Grid */}
        <div className="mt-5 xl:mt-8 grid grid-cols-1 gap-2.5 xl:gap-3.5">
          <div className="flex items-start gap-3 xl:gap-3.5 p-3 xl:p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm transition-transform hover:scale-[1.01]">
            <div className="size-9 xl:size-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0 text-white">
              <Clock className="size-4.5 xl:size-5" />
            </div>
            <div>
              <h3 className="text-xs xl:text-sm font-bold text-white">Live Queue & Token Tracker</h3>
              <p className="text-[11px] xl:text-xs text-white/80 mt-0.5">Know exactly when your turn arrives and skip unnecessary lounge waiting.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 xl:gap-3.5 p-3 xl:p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm transition-transform hover:scale-[1.01]">
            <div className="size-9 xl:size-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0 text-white">
              <CalendarCheck className="size-4.5 xl:size-5" />
            </div>
            <div>
              <h3 className="text-xs xl:text-sm font-bold text-white">Instant Slot Confirmation</h3>
              <p className="text-[11px] xl:text-xs text-white/80 mt-0.5">Select your preferred date and time slot with real-time availability.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 xl:gap-3.5 p-3 xl:p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm transition-transform hover:scale-[1.01]">
            <div className="size-9 xl:size-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0 text-white">
              <Users className="size-4.5 xl:size-5" />
            </div>
            <div>
              <h3 className="text-xs xl:text-sm font-bold text-white">Family Health Profiles</h3>
              <p className="text-[11px] xl:text-xs text-white/80 mt-0.5">Manage and book appointments for your children, spouse, or parents easily.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

