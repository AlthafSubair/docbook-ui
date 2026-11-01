import { redirect } from "next/navigation";

export default function DoctorsRedirect({
  searchParams,
}: {
  searchParams: Promise<{ clinicId?: string }>;
}) {
  return redirect("/clinics");
}
