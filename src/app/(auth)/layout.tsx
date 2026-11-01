import Header from "@/app/components/ui/Header";
import AuthShowcase from "@/app/components/auth/AuthShowcase";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen lg:h-screen w-full flex-col lg:flex-row lg:overflow-hidden bg-background text-foreground">
      {/* Mobile Top Header (only visible on mobile/tablet) */}
      <Header />

      {/* Desktop Showcase & Branding (Visible on lg screens and above) */}
      <AuthShowcase />

      {/* Main Content Area (Login / OTP / etc.) */}
      <main className="flex flex-1 flex-col lg:h-full lg:overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
