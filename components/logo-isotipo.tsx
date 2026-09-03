import Image from "next/image";
import { cn } from "@/lib/utils";

/** Icon-only mark (hand + smile, no wordmark) — used on the standalone
 * auth screens (login, signup, esqueci-senha, redefinir-senha) instead of
 * the full Logo. */
export function LogoIsotipo({ className }: { className?: string }) {
  return (
    <Image
      src="/isotipo.png"
      alt="Helloow Creators"
      width={2000}
      height={1208}
      priority
      className={cn("h-16 w-auto", className)}
    />
  );
}
