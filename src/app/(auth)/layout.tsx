import Header from "@/app/components/ui/Header";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen lg:h-screen w-full flex-col lg:overflow-hidden">
      <Header />
      <main className="flex flex-1 flex-col lg:min-h-0 lg:overflow-hidden">{children}</main>
    </div>
  );
}
