import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import { getIsAdmin } from "@/lib/get-current-creator";
import { getDeals, getCreatorOptions } from "@/lib/get-deals";
import { getBrandOptions } from "@/lib/get-brands";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { NewDealForm } from "./new-deal-form";
import { deleteDeal } from "./actions";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export default async function NegociosPage() {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) redirect("/");

  const [deals, creators, brands] = await Promise.all([
    getDeals(),
    getCreatorOptions(),
    getBrandOptions(),
  ]);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 p-6">
      <div>
        <Link
          href="/admin"
          className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Voltar ao dashboard
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">
          Negócios com marcas
        </h1>
        <p className="text-sm text-muted-foreground">
          Registre cada negócio fechado entre um criador e uma marca.
        </p>
      </div>

      <NewDealForm creators={creators} brands={brands} />

      {deals.length === 0 ? (
        <div className="rounded-xl border py-8 text-center text-sm text-muted-foreground">
          Nenhum negócio registrado ainda.
        </div>
      ) : (
        <>
          {/* Cards on narrow screens — a 7-column table doesn't fit a phone. */}
          <div className="flex flex-col gap-3 sm:hidden">
            {deals.map((deal) => (
              <Card key={deal.id}>
                <CardContent className="flex flex-col gap-2 py-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium">{deal.creator_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {deal.brand_name}
                      </p>
                    </div>
                    <form action={deleteDeal.bind(null, deal.id)}>
                      <Button
                        type="submit"
                        variant="ghost"
                        size="icon"
                        className="size-8 shrink-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </form>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Valor</p>
                      <p>{currency.format(deal.deal_value)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Comissão</p>
                      <p>{deal.commission_pct}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Ganho Helloow</p>
                      <p>{currency.format(deal.company_earning)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Data</p>
                      <p>
                        {new Date(
                          deal.deal_date + "T00:00:00"
                        ).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Table on wider screens. */}
          <div className="hidden rounded-xl border sm:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Criador</TableHead>
                  <TableHead>Marca</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Comissão</TableHead>
                  <TableHead>Ganho Helloow</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {deals.map((deal) => (
                  <TableRow key={deal.id}>
                    <TableCell className="font-medium">
                      {deal.creator_name}
                    </TableCell>
                    <TableCell>{deal.brand_name}</TableCell>
                    <TableCell>{currency.format(deal.deal_value)}</TableCell>
                    <TableCell>{deal.commission_pct}%</TableCell>
                    <TableCell>
                      {currency.format(deal.company_earning)}
                    </TableCell>
                    <TableCell>
                      {new Date(
                        deal.deal_date + "T00:00:00"
                      ).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      <form action={deleteDeal.bind(null, deal.id)}>
                        <Button
                          type="submit"
                          variant="ghost"
                          size="icon"
                          className="size-8 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </form>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
}
