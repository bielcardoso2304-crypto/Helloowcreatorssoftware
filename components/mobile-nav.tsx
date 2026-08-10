"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Calendar, LayoutDashboard, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { logout } from "@/app/(auth)/actions";

function useNavItems(isAdmin: boolean) {
  return [
    { href: "/", label: "Início", icon: Home },
    { href: "/network", label: "Network", icon: Users },
    { href: "/eventos", label: "Eventos", icon: Calendar },
    { href: "/perfil", label: "Perfil", icon: UserRound },
    ...(isAdmin
      ? [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }]
      : []),
  ];
}

/** Compact top bar shown only on small screens — the sidebar carries this
 * on desktop instead. */
export function MobileTopBar() {
  return (
    <header className="flex items-center justify-between border-b p-3 md:hidden">
      <Logo className="text-sm" />
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <form action={logout}>
          <Button type="submit" variant="outline" size="sm">
            Sair
          </Button>
        </form>
      </div>
    </header>
  );
}

/** Fixed bottom tab bar for small screens, replacing the sidebar nav. */
export function MobileBottomNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const items = useNavItems(isAdmin);

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex border-t bg-background pb-[env(safe-area-inset-bottom)] md:hidden"
      aria-label="Navegação"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-all duration-150 ease-out active:scale-95",
              active ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Icon className="size-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
