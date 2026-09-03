"use client";

import { useActionState } from "react";
import { createDeal, type DealActionState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CreatorOption } from "@/lib/get-deals";
import type { BrandOption } from "@/lib/get-brands";

const selectClassName =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

const initialState: DealActionState = { error: null };

export function NewDealForm({
  creators,
  brands,
}: {
  creators: CreatorOption[];
  brands: BrandOption[];
}) {
  const [state, formAction, pending] = useActionState(
    createDeal,
    initialState
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registrar negócio</CardTitle>
        <CardDescription>
          O ganho da Helloow é calculado automaticamente a partir da
          comissão.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="creator_id">Criador</Label>
            <select
              id="creator_id"
              name="creator_id"
              required
              defaultValue=""
              className={selectClassName}
            >
              <option value="" disabled>
                Selecione...
              </option>
              {creators.map((c) => (
                <option key={c.user_id} value={c.user_id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="brand_id">Marca</Label>
            <select
              id="brand_id"
              name="brand_id"
              required
              defaultValue=""
              className={selectClassName}
            >
              <option value="" disabled>
                Selecione...
              </option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deal_value">Valor do negócio (R$)</Label>
            <Input
              id="deal_value"
              name="deal_value"
              type="number"
              min={0}
              step="0.01"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="commission_pct">Comissão da Helloow (%)</Label>
            <Input
              id="commission_pct"
              name="commission_pct"
              type="number"
              min={0}
              max={100}
              step="0.1"
              required
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="deal_date">Data do negócio</Label>
            <Input id="deal_date" name="deal_date" type="date" required />
          </div>

          {state.error && (
            <p className="text-sm text-destructive sm:col-span-2">
              {state.error}
            </p>
          )}

          <Button type="submit" disabled={pending} className="sm:col-span-2">
            {pending ? "Salvando..." : "Salvar negócio"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
