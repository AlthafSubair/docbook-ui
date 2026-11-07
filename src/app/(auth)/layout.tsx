import Header from "@/app/components/ui/Header";
import AuthShowcase from "@/app/components/auth/AuthShowcase";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-[100dvh] w-full flex-col lg:flex-row lg:overflow-hidden bg-background text-foreground overflow-hidden">
      {/* Mobile Top Header (only visible on mobile/tablet) */}
      <Header />

      {/* Desktop Showcase & Branding (Visible on lg screens and above) */}
      <AuthShowcase />

      {/* Main Content Area (Login / OTP / etc.) */}
      <main className="flex flex-1 flex-col min-h-0 overflow-y-auto lg:h-full">
        {children}
      </main>
    </div>
  );
}
