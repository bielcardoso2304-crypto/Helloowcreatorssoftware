"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getIsAdmin } from "@/lib/get-current-creator";
import { brandSchema } from "@/lib/validations/brand";

export type BrandActionState = { error: string | null };

export async function createBrand(
  _prevState: BrandActionState,
  formData: FormData
): Promise<BrandActionState> {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) return { error: "Acesso negado." };

  const parsed = brandSchema.safeParse({ name: formData.get("name") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("brands").insert(parsed.data);
  if (error) {
    return {
      error: error.message.includes("duplicate")
        ? "Essa marca já está cadastrada."
        : "Não foi possível salvar a marca. Tente novamente.",
    };
  }

  revalidatePath("/admin/marcas");
  revalidatePath("/admin/negocios");
  return { error: null };
}

export async function deleteBrand(id: string) {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) return;

  const supabase = await createClient();
  await supabase.from("brands").delete().eq("id", id);

  revalidatePath("/admin/marcas");
  revalidatePath("/admin/negocios");
}
