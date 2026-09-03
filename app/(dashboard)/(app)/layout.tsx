import { redirect } from "next/navigation";
import { getCurrentCreator, getIsAdmin } from "@/lib/get-current-creator";
import { getCurrentBrandProfile } from "@/lib/get-brand-profile";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { MobileTopBar, MobileBottomNav } from "@/components/mobile-nav";

// Chrome + routing guard for the app: a member (creator or brand) without
// a profile yet is sent to onboarding first. Admins get the same nav as
// everyone else, plus an extra "Dashboard" link. Sidebar on desktop, top
// bar + bottom tabs on small screens (phones) — see dashboard-sidebar.tsx
// / mobile-nav.tsx.
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAdmin = await getIsAdmin();

  const [creator, brandProfile] = await Promise.all([
    getCurrentCreator(),
    getCurrentBrandProfile(),
  ]);
  if (!creator && !brandProfile) redirect("/onboarding");

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <DashboardSidebar isAdmin={isAdmin} />
      <div className="flex flex-1 flex-col">
        <MobileTopBar />
        <main className="flex-1 pb-16 md:pb-0">{children}</main>
      </div>
      <MobileBottomNav isAdmin={isAdmin} />
    </div>
  );
}
