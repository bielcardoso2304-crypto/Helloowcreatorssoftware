"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getIsAdmin } from "@/lib/get-current-creator";
import { dealSchema } from "@/lib/validations/deal";

export type DealActionState = { error: string | null };

export async function createDeal(
  _prevState: DealActionState,
  formData: FormData
): Promise<DealActionState> {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) return { error: "Acesso negado." };

  const parsed = dealSchema.safeParse({
    creator_id: formData.get("creator_id"),
    brand_id: formData.get("brand_id"),
    deal_value: formData.get("deal_value"),
    commission_pct: formData.get("commission_pct"),
    deal_date: formData.get("deal_date"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("deals").insert(parsed.data);
  if (error) {
    return { error: "Não foi possível salvar o negócio. Tente novamente." };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/negocios");
  return { error: null };
}

export async function deleteDeal(id: string) {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) return;

  const supabase = await createClient();
  await supabase.from("deals").delete().eq("id", id);

  revalidatePath("/admin");
  revalidatePath("/admin/negocios");
}
