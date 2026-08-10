import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("font-semibold tracking-tight", className)}>
      Helloow<span className="text-primary">Creators</span>
    </span>
  );
}
