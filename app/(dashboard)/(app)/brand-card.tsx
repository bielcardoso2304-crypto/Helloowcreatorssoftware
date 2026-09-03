import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/avatar";
import type { DirectoryBrandProfile } from "@/lib/get-brand-profile";

export function BrandCard({ brand }: { brand: DirectoryBrandProfile }) {
  return (
    <Card className="transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md">
      <CardContent className="pt-6">
        <Link href={`/marca/${brand.id}`} className="block">
          <div className="flex items-center gap-3">
            <Avatar src={brand.avatar_url} size="size-12" />
            <div className="min-w-0">
              <p className="truncate font-medium leading-tight">
                {brand.company_name}
              </p>
              {brand.segment && (
                <p className="truncate text-xs text-muted-foreground">
                  {brand.segment}
                </p>
              )}
            </div>
          </div>

          {brand.bio && (
            <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
              {brand.bio}
            </p>
          )}

          {brand.city_state && (
            <div className="mt-3 text-xs text-muted-foreground">
              {brand.city_state}
            </div>
          )}
        </Link>
      </CardContent>
    </Card>
  );
}
