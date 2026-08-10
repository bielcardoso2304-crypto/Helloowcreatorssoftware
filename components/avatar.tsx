import { User } from "lucide-react";
import { cn } from "@/lib/utils";

/** Profile photo with a generic person-icon fallback when there's no
 * avatar_url yet — no third-party image asset involved. */
export function Avatar({
  src,
  size = "size-12",
  className,
}: {
  src?: string | null;
  size?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        size,
        "flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted",
        className
      )}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="size-full object-cover" />
      ) : (
        <User className="size-1/2 text-muted-foreground" />
      )}
    </div>
  );
}
