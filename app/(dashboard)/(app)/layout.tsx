import { redirect } from "next/navigation";
import { getCurrentCreator, getIsAdmin } from "@/lib/get-current-creator";
import { DashboardSidebar } from "@/components/dashboard-sidebar";

// Chrome (sidebar) + routing guard for the app: a creator without a profile
// yet is sent to onboarding first. Admins get the same sidebar as everyone
// else, plus an extra "Dashboard" link (see DashboardSidebar).
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAdmin = await getIsAdmin();

  const creator = await getCurrentCreator();
  if (!creator) redirect("/onboarding");

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar isAdmin={isAdmin} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
