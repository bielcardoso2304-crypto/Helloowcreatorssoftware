import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import { getIsAdmin } from "@/lib/get-current-creator";
import { getBrands } from "@/lib/get-brands";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { NewBrandForm } from "./new-brand-form";
import { deleteBrand } from "./actions";

export default async function MarcasPage() {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) redirect("/");

  const brands = await getBrands();

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 p-6">
      <div>
        <Link
          href="/admin/negocios"
          className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Voltar para negócios
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">Marcas</h1>
        <p className="text-sm text-muted-foreground">
          Marcas parceiras disponíveis para selecionar ao registrar um
          negócio.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cadastrar marca</CardTitle>
        </CardHeader>
        <CardContent>
          <NewBrandForm />
        </CardContent>
      </Card>

      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Marca</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {brands.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={2}
                  className="whitespace-normal py-8 text-center text-muted-foreground"
                >
                  Nenhuma marca cadastrada ainda.
                </TableCell>
              </TableRow>
            )}
            {brands.map((brand) => (
              <TableRow key={brand.id}>
                <TableCell className="font-medium">{brand.name}</TableCell>
                <TableCell>
                  <form action={deleteBrand.bind(null, brand.id)}>
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
    </div>
  );
}
