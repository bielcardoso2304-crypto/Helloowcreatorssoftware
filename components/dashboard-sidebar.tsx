"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Calendar, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { logout } from "@/app/(auth)/actions";

const navItems = [
  { href: "/", label: "Início", icon: Home },
  { href: "/network", label: "Network", icon: Users },
  { href: "/eventos", label: "Eventos", icon: Calendar },
];

function navLinkClassName(active: boolean) {
  return cn(
    "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 ease-out active:scale-[0.97]",
    active
      ? "bg-accent text-accent-foreground"
      : "text-muted-foreground hover:translate-x-0.5 hover:bg-muted hover:text-foreground"
  );
}

export function DashboardSidebar({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();

  return (
    <aside className="hidden h-screen w-56 shrink-0 flex-col border-r p-4 md:flex">
      <Link href="/" className="mb-8 px-2">
        <Logo className="h-24" />
      </Link>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className={navLinkClassName(active)}>
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
        {isAdmin && (
          <Link
            href="/admin"
            className={navLinkClassName(pathname === "/admin")}
          >
            <LayoutDashboard className="size-4" />
            Dashboard
          </Link>
        )}
      </nav>

      <div className="space-y-2 border-t pt-4">
        <Link href="/perfil" className={navLinkClassName(pathname === "/perfil")}>
          Meu perfil
        </Link>
        <div className="flex items-center justify-between px-1">
          <ThemeToggle />
          <form action={logout}>
            <Button type="submit" variant="outline" size="sm">
              Sair
            </Button>
          </form>
        </div>
      </div>
    </aside>
  );
}
