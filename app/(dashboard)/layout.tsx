import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Auth guard only. Individual pages handle onboarding/admin routing.
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return <>{children}</>;
}
