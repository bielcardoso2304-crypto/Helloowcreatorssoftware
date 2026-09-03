"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { brandProfileSchema } from "@/lib/validations/brand-profile";
import { uploadAvatarIfProvided } from "@/lib/upload-avatar";
import type { BrandProfileActionState } from "../../brand-profile-form";

export async function updateBrandProfile(
  _prevState: BrandProfileActionState,
  formData: FormData
): Promise<BrandProfileActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const parsed = brandProfileSchema.safeParse({
    company_name: formData.get("company_name"),
    contact_name: formData.get("contact_name"),
    email: formData.get("email"),
    whatsapp: formData.get("whatsapp"),
    city_state: formData.get("city_state"),
    segment: formData.get("segment"),
    bio: formData.get("bio"),
    website_url: formData.get("website_url"),
    instagram_handle: formData.get("instagram_handle"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const { avatarUrl, error: avatarError } = await uploadAvatarIfProvided(
    supabase,
    user.id,
    formData.get("avatar")
  );
  if (avatarError) {
    return { error: avatarError };
  }

  const { error } = await supabase
    .from("brand_profiles")
    .update({
      ...parsed.data,
      ...(avatarUrl ? { avatar_url: avatarUrl } : {}),
    })
    .eq("user_id", user.id);
  if (error) {
    return { error: "Não foi possível salvar suas alterações. Tente novamente." };
  }

  revalidatePath("/perfil");
  redirect("/perfil");
}
