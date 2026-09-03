import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getDirectoryBrandProfileById } from "@/lib/get-brand-profile";
import { getIsAdmin } from "@/lib/get-current-creator";
import { getBrandRevenueByName } from "@/lib/get-deals";
import { Avatar } from "@/components/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { DeleteMemberButton } from "../../delete-member-button";
import { instagramUrl } from "@/lib/social-links";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  month: "long",
  year: "numeric",
});

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export default async function BrandDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const brand = await getDirectoryBrandProfileById(id);
  if (!brand) notFound();

  const brandInstagramUrl = instagramUrl(brand.instagram_handle);
  const isAdmin = await getIsAdmin();
  const revenue = isAdmin
    ? await getBrandRevenueByName(brand.company_name)
    : null;

  return (
    <div className="mx-auto max-w-2xl p-6">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Voltar
      </Link>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <Avatar src={brand.avatar_url} size="size-20" />
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-xl font-semibold tracking-tight">
                {brand.company_name}
              </h1>
              {brand.segment && (
                <p className="truncate text-muted-foreground">{brand.segment}</p>
              )}
              {brand.city_state && (
                <span className="mt-1 block text-xs text-muted-foreground">
                  {brand.city_state}
                </span>
              )}
            </div>
          </div>

          {brand.bio && (
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {brand.bio}
            </p>
          )}

          {(brand.website_url || brandInstagramUrl) && (
            <div className="mt-6">
              <p className="mb-1 text-sm font-medium">Links</p>
              <div className="rounded-lg border px-3">
                {brand.website_url && (
                  <div className="flex items-center justify-between border-b py-3 last:border-b-0">
                    <p className="text-sm font-medium">Site</p>
                    <a
                      href={brand.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-primary underline underline-offset-4"
                    >
                      Abrir
                    </a>
                  </div>
                )}
                {brandInstagramUrl && (
                  <div className="flex items-center justify-between border-b py-3 last:border-b-0">
                    <div>
                      <p className="text-sm font-medium">Instagram</p>
                      <p className="text-sm text-muted-foreground">
                        {brand.instagram_handle}
                      </p>
                    </div>
                    <a
                      href={brandInstagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-primary underline underline-offset-4"
                    >
                      Abrir
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          <p className="mt-6 text-xs text-muted-foreground">
            Na comunidade desde {dateFormatter.format(new Date(brand.created_at))}
          </p>

          {isAdmin && revenue && (
            <div className="mt-6 border-t pt-4">
              <p className="mb-3 text-sm font-medium">Área do admin</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">
                    Faturamento gerado
                  </p>
                  <p className="text-lg font-semibold tracking-tight">
                    {currency.format(revenue.totalValue)}
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">
                    Lucro para a Helloow
                  </p>
                  <p className="text-lg font-semibold tracking-tight">
                    {currency.format(revenue.totalEarning)}
                  </p>
                </div>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {revenue.dealCount === 0
                  ? "Nenhum negócio registrado com esta marca ainda."
                  : `${revenue.dealCount} ${revenue.dealCount === 1 ? "negócio" : "negócios"} registrados.`}
              </p>
              <div className="mt-4">
                <DeleteMemberButton
                  userId={brand.user_id}
                  name={brand.company_name}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
