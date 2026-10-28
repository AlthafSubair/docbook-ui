
import Hearder from "@/app/components/ui/Hearder";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Hearder />
      {children}
    </div>
  );
}
