import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt="Helloow Creators"
      width={520}
      height={314}
      priority
      className={cn("h-8 w-auto", className)}
    />
  );
}
